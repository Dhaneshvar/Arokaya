import boto3
import json
import os
from dotenv import load_dotenv
from datetime import datetime, timezone
from typing import List, Dict

# Load environment variables
load_dotenv()

# Initialize Bedrock client only once
bedrock_client = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-east-1',
    aws_access_key_id='AKIAWR2VGEGKM4ZD3KEF',
    aws_secret_access_key='7R921d3qhFu8mw3l489W7bKurU0214xGscS5vgaD'
)

#In-memory session storage (replace with DB for production)
session_memory: Dict[str, List[Dict[str, str]]] = {}

# System prompt
system_prompts = [
    {
        "text": (
            "You are Arokaya, an AI health assistant that helps identify symptoms.\n\n"
            "The following are the patient's previous responses.\n"
            "Based on these, suggest the next most relevant health-related question.\n"
            "- Do NOT include or repeat any previous questions.\n"
            "- The question must be answerable with 'yes' or 'no'.\n"
            "- The response should ONLY be the question text. No explanations or context.\n"
            "- Keep the question short and clear."
        )
    }
]

# Model inference config
inference_config = {
    "temperature": 0.5,
    "maxTokens": 4096,
    "topP": 0.9,
}

def build_message(conversation: List[Dict[str, str]]) -> List[Dict[str, List[Dict[str, str]]]]:
    messages = []
    for pair in conversation:
        if pair["role"] == "user":
            messages.append({
                "role": "user",
                "content": [{"text": pair["questionAnswer"]}]
            })
    return messages

def arokayaAiDoctor(session_id: str, question: str, answer: str) -> Dict:
    """
    Adds user input to memory, sends it to the model, and stores the AI's next question.
    """
    if session_id not in session_memory:
        session_memory[session_id] = []

    # Store user input
    session_memory[session_id].append({
        "role": "user",
        "questionAnswer": f"{question} Answer is {answer}"
    })

    # Build Claude-style message list (only user entries)
    messages = build_message(session_memory[session_id])

    # Call model
    response = bedrock_client.converse(
        modelId="amazon.nova-pro-v1:0",
        system=system_prompts,
        inferenceConfig=inference_config,
        messages=messages
    )

    next_question = response["output"]["message"]["content"][0]["text"].strip()

    # Store AI's question only for history (not sent to model next time)
    session_memory[session_id].append({
        "role": "bot",
        "question": next_question
    })

    print('ses', session_memory)
    print({
        "sessionId": session_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "next_question": next_question,
        "history": session_memory[session_id]
    })
    return {
        "sessionId": session_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "next_question": next_question,
        "history": session_memory[session_id]
    }


# # Example test call
# res = arokayaAiDoctor("1", "Have you noticed any chills or sweating accompanying the fever?", "yes")
# print("res", json.dumps(res, indent=2))