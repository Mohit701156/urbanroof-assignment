# UrbanRoof Detailed Diagnostic Report (DDR) Generator

A full-stack AI web application to generate DDRs from given inspection and thermal PDF reports.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Local `.env` file at the root directory of the project.

### 1. Environment Configuration
Create a `.env` file in the root directory:
```
# API Selection (openrouter or groq)
MODEL_PROVIDER=groq
MODEL_NAME=llama3-70b-8192

# API Keys
GROQ_API_KEY=your_groq_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 2. Backend Setup
```bash
cd server
npm install
npm start
```
*Server runs on http://localhost:5000*

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*Client runs on http://localhost:5173 (or as indicated by Vite)*

---

## 🎥 Demo Script for Loom

**[0:00 - 0:15] Introduction & What We Built**
"Hi! I'm here to showcase the UrbanRoof Detailed Diagnostic Report (DDR) generator. This is a full-stack React + Node.js application that uses AI to ingest PDF inspection and thermal reports and output a professional, structured, client-ready report. We used Groq/OpenRouter to ensure it's fully free while remaining modular."

**[0:15 - 0:45] How It Works (Demoing UI)**
"First, notice our beautiful, clean UI with drag-and-drop capabilities. I'll upload the inspection report here, and optionally the thermal report. Once I click 'Generate Diagnostic Report', the Express backend parses the PDF text using \`pdf-parse\` and runs a two-step AI pipeline prompt: Data Cleaning & DDR Generation. Let's wait a few seconds while the AI thinks..."

**[0:45 - 1:15] Reviewing the Generated Report**
"Here is the finalized DDR report. Notice the structure perfectly adheres to the required 7 sections: Property Issue Summary, Area-wise Observations, Probable Root Cause, Severity Assessment, Recommended Actions, Additional Notes, and Missing Information. Where image mapping is expected, we've created a placeholder system simulating an image extraction. The user can also export this beautifully formatted report directly to a PDF."

**[1:15 - 1:40] Limitations & Improvements**
"Due to execution constraints on Node.js compared to Python, robust PDF image extraction natively (like PyMuPDF) is mocked in this Node environment, though text extraction works flawlessly. If we had more time:
1. I would swap \`pdf-parse\` for a Python microservice with \`PyMuPDF\` to accurately pluck and map images to textual coordinates.
2. We would add streaming support to the frontend so the user can watch the AI report type out in real-time.
3. Enhance the chunking algorithm for larger 50+ page PDFs using LangChain or LlamaIndex.

Thanks for watching!"
