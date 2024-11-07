from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders.json_loader import JSONLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from tqdm import tqdm

# # Set up logging
# logging.basicConfig(level=logging.INFO)

### Data ingestion
loader = JSONLoader(file_path="context_decision.json",jq_schema=".data[]",  text_content=False)
data = loader.load()
# print(data)
# logging.info(f"Loaded {len(data)} rows from the JSON file.")

# Splitting data into chunks with progress ba text_content=Falser
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
documents = []
for doc in tqdm(data, desc="Splitting documents", unit="doc"):
    chunks = text_splitter.split_documents([doc])
    documents.extend(chunks)
# logging.info(f"Split data into {len(documents)} document chunks.")

# Initialize the embedding model
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
# logging.info("Initialized embedding model.")

# Create database with progress bar
# logging.info("Creating FAISS index...")
db = FAISS.from_documents(tqdm(documents, desc="Creating FAISS index", unit="doc"), embeddings)
# logging.info("Created FAISS index from documents.")

# Saving FAISS index db locally
db.save_local("/kaggle/working/faiss_index")
# logging.info("Saved FAISS index to /kaggle/working/faiss_index.")