import json
from langchain_openai import ChatOpenAI
from langchain_openai import OpenAI

from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_history_aware_retriever
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface.embeddings import HuggingFaceEmbeddings

from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

import os

from zipfile import ZipFile
from urllib.parse import urlparse
import shutil
import requests
from uuid import uuid4

from pathlib import Path
from langchain.storage import LocalFileStore

from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
os.environ['OPENAI_API_KEY'] = ""

embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

llm = ChatOpenAI(model="gpt-4o-mini", streaming=True)

# define an llm just for deciding titles of each chat
title_llm = OpenAI()

# Define a simple prompt template
prompt = PromptTemplate(template = """Given a conversation between a user and a chatbot, provide a concise 3-4 word heading or title summarizing the interaction. The title must strictly be less than or equal to 4 words. The conversation: {chatHistory}
 
Answer: """, input_variables=["chatHistory"])

# Create an LLMChain with the prompt and LLM
title_chain = prompt | title_llm

        
ADR_INDEX = Path.cwd() / "faiss_index"
ADR_SOURCES_PATH = Path.cwd() / "ADR_sources"
CHAT_TITLES_STORE_PATH = Path.cwd() / "ADR_chatTitles"
CHAT_HISTORY_STORE_PATH = Path.cwd() / "ADR_chatHistory"

def getRAGChain(embedding_model, index):
    """
    Create and return a Retrieval-Augmented Generation (RAG) chain.

    Args:
        embedding_model: The embedding model to use for vectorization.
        index: The path to the FAISS index.

    Returns:
        A RAG chain that can be used for question-answering tasks.
    """
    vector_store = FAISS.load_local(index, embedding_model, allow_dangerous_deserialization=True)

    retriever = vector_store.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={"k":  5, "score_threshold": 0.2}, # 0.2 means 20% similarity
    )

    contextualize_q_system_prompt = (
        "Given a chat history and the latest user question "
        "which might reference context in the chat history, "
        "formulate a standalone question which can be understood "
        "without the chat history. Do NOT answer the question, "
        "just reformulate it if needed and otherwise return it as is."
    )
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )

    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_q_prompt
    )

    system_prompt = (
        "You are an assistant for question-answering tasks. "
        "Use the following pieces of retrieved context to answer "
        "the question. If you don't know the answer, say that you "
        "don't know. Use five sentences maximum and keep the "
        "answer concise."
        "\n\n"
        "{context}"
    )
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )

    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

    return rag_chain


def folder_extraction(response, repository_name, repository_owner, folder_path, context_h, decison_h, branch,context_e,decision_e, ADR_INDEX, embedding_model):
    """
    Extract and process ADR files from a downloaded repository zip file.

    Args:
        response: The HTTP response containing the zip file.
        repository_name: Name of the repository.
        repository_owner: Owner of the repository.
        folder_path: Path to the folder containing ADRs within the repository.
        context_h: Heading for the context section in ADRs.
        decison_h: Heading for the decision section in ADRs.
        branch: The branch name of the repository.
        context_e: Ending marker for the context section.
        decision_e: Ending marker for the decision section.
        ADR_INDEX: Path to the FAISS index.
        embedding_model: The embedding model to use for vectorization.

    Returns:
        A list containing a boolean indicating success and an error message if applicable.
    """
    zip_file_path = "repository.zip"
    extracted_folder_path = "extracted_folder"
    with open(zip_file_path, 'wb') as zip_file:
        zip_file.write(response.content)

    # Extract the specific folder from the zip file
    with ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(extracted_folder_path)

    # Move the desired folder to the desired location
    final_folder = f"{repository_owner}-{repository_name}"
    isExist = os.path.exists(final_folder)
    print(f"the repo already exists {isExist}")
    if isExist:
        shutil.rmtree(final_folder)
    try:
        if os.path.exists(os.path.join(extracted_folder_path,f"{repository_name}-{branch}"))==False:
            branch="main"
        os.rename(os.path.join(extracted_folder_path,
                  f"{repository_name}-{branch}", folder_path), final_folder)
        os.remove(zip_file_path)
        shutil.rmtree(extracted_folder_path)
    except:
        os.remove(zip_file_path)
        shutil.rmtree(extracted_folder_path)
        return [False, 'Not a valid URL']

    l1 = len(context_h)
    l2 = len(decison_h)
    with open(f"{final_folder}.json", 'w') as file1:

        file_data = {"data": []}

        found_files = []
        for root, dirs, files in os.walk(final_folder):
            for file in files:
                if file.endswith(".md"):
                    found_files.append(os.path.join(root, file))
        # print(found_files)
        for filename in found_files:

            with open(filename, 'r') as f:
                content = f.read()
                begin_1 = content.find(context_h)+l1+2
                begin_2 = content.find(decison_h)+l2+2
                if context_e=='':context_e='#'
                if decision_e=='':decision_e='#'
                if begin_1 != -1:
                    context = content[begin_1:content.find(context_e, begin_1)]
                    decision = content[begin_2:content.find(decision_e, begin_2)]

                    if context == '' or decision == '':
                        continue
                
                    ######### llamaindex code for adr starts here #########

                    # Combine context and decision for embedding
                    combined_text = f'{{"context": "{context}", "decision": "{decision}"}}'
                    # print(combined_text)
                    langchain_documents = []
                    langchain_document = Document(
                    page_content=combined_text,
                    )
                    langchain_documents.append(langchain_document)

                    text_splitter=RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=200)
                    nodes = text_splitter.split_documents(langchain_documents)
                    # print(nodes)

                    vector_store_adr = FAISS.load_local(ADR_INDEX, embedding_model, allow_dangerous_deserialization=True)

                    uuids = [str(uuid4()) for _ in range(len(nodes))]

                    vector_store_adr.add_documents(documents=nodes, ids=uuids)

                    # save the vector store
                    vector_store_adr.save_local(ADR_INDEX)

        file1.seek(0)
        json.dump(file_data, file1)
    shutil.rmtree(final_folder)
    # Remove the file
    if os.path.exists(f"{final_folder}.json"):
        os.remove(f"{final_folder}.json")
        print(f"{final_folder}.json has been removed.")
    else:
        print(f"{final_folder}.json does not exist.")
    return [True, ""]

def repo_extraction(repo_url, context_h, decision_h,context_e,decision_e):
    """
    Extract ADRs from a given repository URL.

    Args:
        repo_url: URL of the GitHub or GitLab repository.
        context_h: Heading for the context section in ADRs.
        decision_h: Heading for the decision section in ADRs.
        context_e: Ending marker for the context section.
        decision_e: Ending marker for the decision section.

    Returns:
        A list containing a boolean indicating success and either the repository name or an error message.
    """
    parsed_url = urlparse(repo_url)
    path_segments = parsed_url.path.strip('/').split('/')
    if context_h == '' or decision_h == '':
        return [False, 'please enter the context and decision headings']
    if len(path_segments) >= 2:
        repository_owner = path_segments[0]
        repository_name = path_segments[1]
    else:
        return [False, "Not valid url"]

    if parsed_url.netloc == "github.com":

        if len(path_segments)==2:
            folder_path=""
            branch="main"
        else:
            folder_path = '/'.join(path_segments[4:])
            branch=path_segments[3]
        archive_url = f"https://github.com/{repository_owner}/{repository_name}/archive/{branch}.zip"

        response = requests.get(archive_url)
        adr_sources = LocalFileStore(ADR_SOURCES_PATH)

        if adr_sources.mget([f"{repository_owner}-{repository_name}"])[0] != None:
            return [False, "Source already present"]
        elif response.status_code == 200:
            # Save the zip file to your local directory
            adr_sources.mset([[f"{repository_owner}-{repository_name}", b"1"]])
            Success, message = folder_extraction(
            response, repository_name, repository_owner, folder_path, context_h, decision_h, branch,context_e,decision_e, ADR_INDEX, embedding_model)
            if Success == False:
                return [False, message]
            return [True, f"{repository_owner}-{repository_name}"]

        else:
            print(
                f"Failed to download the repository. Status code: {response.status_code}")
            return [False, f"Failed to download the repository. Status code: {response.status_code}"]

    elif parsed_url.netloc == "gitlab.com":
        folder_path = '/'.join(path_segments[5:])

        archive_url = f"https://gitlab.com/{repository_owner}/{repository_name}/-/archive/{path_segments[4]}/{repository_name}-{path_segments[4]}.zip"

        response = requests.get(archive_url)

        if adr_sources.mget([f"{repository_owner}-{repository_name}"])[0] != None:
            return [False, "Source already present"]
        elif response.status_code == 200:
            adr_sources.mset([[f"{repository_owner}-{repository_name}", b"1"]])
            
            folder_extraction(response, repository_name, repository_owner,
                              folder_path, context_h, decision_h, path_segments[4],context_e,decision_e, ADR_INDEX, embedding_model)
            return [True, f"{repository_owner}-{repository_name}"]
        else:
            print(
                f"Failed to download the repository. Status code: {response.status_code}")
            return [False, f"Failed to download the repository. Status code: {response.status_code}"]

    print("Not valid url")
    return [False, "Not valid url"]


adr_rag_chain = getRAGChain(embedding_model, ADR_INDEX)