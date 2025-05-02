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
            """
            You are Arokaya, an AI health assistant designed to identify symptoms and provide medical insights.

            The following are the patient's previous responses. Based on these, generate a concise and clear summary report that includes:

            Possible condition or disease the patient may be experiencing

            Recommended actions: what to take (e.g., medications, food) and what to avoid

            Suggestions on whom the patient should consult (e.g., type of specialist)

            Any additional advice or precautions

            Ensure the response is well-structured, easy to understand, and written in a supportive tone.
            """
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

def generateReport(conversation: str) -> Dict:
    """
    Adds user input to memory, sends it to the model, and stores the AI's next question.
    """

    # Build Claude-style message list (only user entries)
    messages = build_message(conversation)

    # Call model
    response = bedrock_client.converse(
        modelId="amazon.nova-pro-v1:0",
        system=system_prompts,
        inferenceConfig=inference_config,
        messages=messages
    )

    res = response["output"]["message"]["content"][0]["text"].strip()


    # print('res', res)
    return {
        "Summary" : res
    }


# # Example test call
# res = generateReport([{'role': 'user', 'questionAnswer': "i've fever Answer is yes"}, {'role': 'bot', 'question': 'Have you experienced any chills or shivering?'}, {'role': 'user', 'questionAnswer': 'Have you experienced any chills or shivering? Answer is yes'}, {'role': 'bot', 'question': 'Have you noticed any sweating or night sweats?'}, {'role': 'user', 'questionAnswer': 'Have you noticed any sweating or night sweats? Answer is yes'}, {'role': 'bot', 'question': 'Have you experienced any headaches or body aches?'}])
# print("res", res['Summary'])