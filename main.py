from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import OpenAI
import os

app = FastAPI(title="Tryon Technologies AI API", version="1.0.0")

allowed_origins = [x.strip() for x in os.getenv("ALLOWED_ORIGINS", "*").split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1200)

SYSTEM_PROMPT = """
You are the website assistant for Tryon Technologies Pvt. Ltd.
Help visitors understand the company's services: business websites and software,
AI automation, CCTV/IP cameras/NVR/DVR, networking/LAN/Wi-Fi/switches/routers,
intrusion detection systems, access control, fire alarm, cloud and IT support.
Be concise, polite and practical. Do not invent product models, prices, certifications,
client names, project results, warranties, response times or technical specifications.
If a detail is not confirmed, say it must be verified by the Tryon team.
Never ask users for passwords, OTPs, payment card data or sensitive credentials.
For quotations or site-specific advice, direct the visitor to tryontechindia@gmail.com.
"""

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Tryon Technologies AI API"}

@app.post("/api/chat")
def chat(body: ChatRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="AI is not configured. Add OPENAI_API_KEY on the server.")
    try:
        client = OpenAI(api_key=api_key)
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            instructions=SYSTEM_PROMPT,
            input=body.message,
        )
        return {"reply": response.output_text}
    except Exception:
        raise HTTPException(status_code=502, detail="AI service is temporarily unavailable.")
