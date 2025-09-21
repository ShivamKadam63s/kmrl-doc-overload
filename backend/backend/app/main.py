from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import motor.motor_asyncio
import uuid
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://mongodb:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client.kmrl

app = FastAPI(title="kmrl-doc-overload-backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/ingest")
async def ingest(file: UploadFile = File(...)):
    contents = await file.read()
    doc_id = str(uuid.uuid4())
    doc = {
        "_id": doc_id,
        "filename": file.filename,
        "size": len(contents),
        "text": "",  # placeholder, worker should fill OCR/text
    }
    await db.documents.insert_one(doc)
    return {"document_id": doc_id, "filename": file.filename}

@app.get("/documents")
async def list_documents():
    items = []
    cursor = db.documents.find().sort("filename", 1)
    async for d in cursor:
        items.append(d)
    return items
