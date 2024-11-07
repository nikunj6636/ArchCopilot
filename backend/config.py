import json
import uuid

from flask import Flask, request, Response, jsonify
from flask_cors import CORS

from langchain_core.runnables.history import RunnableWithMessageHistory

from utility import adr_rag_chain, title_chain, repo_extraction, CHAT_TITLES_STORE_PATH, CHAT_HISTORY_STORE_PATH
from langchain_core.messages import AIMessage
from langchain_community.chat_message_histories.file import FileChatMessageHistory, BaseChatMessageHistory
from langchain.storage import LocalFileStore

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Function to get chat history for a given session
def get_session_history(session_id: str) -> BaseChatMessageHistory:
    return FileChatMessageHistory(f"{CHAT_HISTORY_STORE_PATH}/messages_{session_id}.json", encoding="utf-8")

# Initialize conversational RAG chain with message history
conversational_rag_chain = RunnableWithMessageHistory(
    adr_rag_chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="answer",
)

@app.route('/api/')
def home():
    """Homepage route"""
    return 'Welcome to the homepage!'

@app.route('/api/submiturl_adr', methods=['POST'])
def process_url():
    """
    Process submitted URL for ADR extraction
    
    Expects JSON payload with 'url', 'context_h', 'decision_h', 'context_e', and 'decision_e'
    """
    if request.method == 'POST':
        res = request.get_json()

        is_success, message = repo_extraction(
            res['url'], res['context_h'], res['decision_h'], res['context_e'], res['decision_e'])
        if is_success == False:
            return {"message": message}
        else:
            return {"message": "successfully extracted adrs"}

    else:
        print("error")

@app.route('/api/getChatIds', methods=['GET'])
def getChatIds():
    """
    Retrieve chat IDs and titles
    
    Returns an array of chat IDs and titles from local storage
    """
    if request.method == 'GET':
        file_store = LocalFileStore(CHAT_TITLES_STORE_PATH)
        ids = []
        titles = []
        for key in file_store.yield_keys():
            value = file_store.mget([key])[0].decode('utf-8')
            ids.append(key)
            titles.append(value)
        
        return jsonify({'ids': ids, 'titles': titles})

@app.route("/api/chat", methods=['POST'])
def chat():
    """
    Handle chat requests
    
    Expects JSON payload with 'message' and 'session_id'
    Returns a streaming response of the AI's reply
    """
    if request.method == 'POST':
        user_prompt = request.json['message']
        session_id = request.json['session_id']

        def generate():
            streaming_response = conversational_rag_chain.stream(
                {"input": user_prompt},
                config={
                    "configurable": {"session_id": session_id},
                }
            )
            for chunk in streaming_response:
                if answer_chunk := chunk.get("answer"):
                    yield answer_chunk

        return Response(generate(), mimetype='text/event-stream')

@app.route('/api/newChat', methods=['GET'])
def newChat():
    """
    Create a new chat
    
    Generates a new UUID for the chat and stores it with a default title
    Returns the new chat ID and title
    """
    if request.method == 'GET':
        id = str(uuid.uuid1())
        file_store = LocalFileStore(CHAT_TITLES_STORE_PATH)

        file_store.mset(
        [
            [id, b"Untitled"]
        ]
        )

        return jsonify({'id': id, 'title': 'Untitled'})

@app.route('/api/getChatHistory', methods=['POST'])
def getChatHistory():
    """
    Retrieve chat history
    
    Expects JSON payload with 'chatId'
    Returns the chat history for the specified chat ID
    """
    if request.method == 'POST':
        session_id = request.json['chatId']

        messages = get_session_history(session_id).messages
        chatHistory = []

        for message in messages:
            if isinstance(message, AIMessage):
                role = "assistant"
            else:
                role = "user"
            chatHistory.append({"role": role, "content": message.content})

        return jsonify({'chatHistory': chatHistory})

@app.route('/api/changeTitle', methods=['POST'])
def changeTitle():
    """
    Change chat title
    
    Expects JSON payload with 'chatId'
    Generates a new title based on the last two messages in the chat history
    Updates the title in local storage and returns the new title
    """
    if request.method == 'POST':
        session_id = request.json['chatId']

        messages = get_session_history(session_id).messages
        
        chatHistory = {}

        for i in range(len(messages)-2, len(messages)):
            if isinstance(messages[i], AIMessage):
                role = "chatbot_reply"
            else:
                role = "user_query"
            chatHistory[role]= messages[i].content
        
        # Run the chain with a question
        title = title_chain.invoke(json.dumps(chatHistory))

        # changing the title in database
        file_store = LocalFileStore(CHAT_TITLES_STORE_PATH)
        file_store.mset([[session_id, title.encode('utf-8')]])
        obj = jsonify({"title": title})
        return obj
    
if __name__=="__main__":
    app.run(host="0.0.0.0", port = 5000)