# Architectural Decision Record (ADR) Assistant

This application helps extract, store, and query Architectural Decision Records (ADRs) using natural language processing and semantic search techniques.

## Features

1. **ADR Scraper**: Extracts context-decision pairs from GitHub or GitLab repositories containing ADRs.
   - Inputs: Repository URL, context heading, decision heading, context ending, and decision ending.
   - Outputs: Extracted context-decision pairs and their embeddings stored in the database.

2. **Chat Interface**: Allows users to query the system about architectural decisions.
   - Provides responses based on stored ADRs and newly added records.
   - Utilizes a fine-tuned language model for generating relevant answers.

## Technology Stack

- Frontend: React.js
- Backend: Flask
- Database: FAISS (Facebook AI Similarity Search)
- Embeddings: BERT
- Language Model: Fine-tuned FLAN-T5
- Semantic Search: FAISS vector search with cosine similarity

## Setup and Installation

### Backend

1. Set up a virtual environment:
   ```bash
   pip install virtualenv
   python3.10 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Replace API_KEY in utility.py file

4. Run the backend:
   ```bash
   cd backend
   python3 config.py
   ```

To deactivate the virtual environment, run: `deactivate`

### Frontend:
In the frontend directory, run `npm install --legacy-peer-deps` and then `npm start`


## Features of the application

1. The scrapper extracts context, decision pairs from the given github/ gitlab URL of the folder containing ADRs.The Scrapper takes github/gitlab URL, context heading, decision heading, context ending and decision ending as inputs, then extracts context, decision pairs, then pushes context, decision pair embeddings to the database. 

2. The chat-interface allows users to get decision from LLM based on the Architectural Decision records stored in its database and the newly added ADR's by the user.


## Technologies used 

1. Frontend - Reactjs
2. Backend - Flask
3. Database - faiss database
4. Embeddings - BERT embeddings
5. LLM - OpenAI 4o-mini
6. semantic search -  Faiss vector search with cosine similarity

### Implementation of Semantic Search 

The embeddings of the context and decision stitched together into one sentence have to be pushed into the database to create vector search index for running vector queries.


## Data sources
`data.csv`
The application supports extraction of adrs from github and gitlab sources.
