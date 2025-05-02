import boto3
import json
import os
from dotenv import load_dotenv
from typing import List, Dict

# Load environment variables
load_dotenv()

# Initialize Bedrock client
bedrock_client = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-east-1',
    aws_access_key_id='AKIAWR2VGEGKM4ZD3KEF',
    aws_secret_access_key='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'
)

# System prompt
system_prompts = [
    {
        "text": (
            """
            You are Arokaya, an AI health assistant designed to analyze patient visit records and summarize key medical insights.

            Below is a series of the patient's past medical visits, each including the date, reported symptoms, doctor's notes, and prescribed medications.

            Your task is to generate a medical history summary that is easy to read and clinically useful. For each visit, include:

            - Date of visit  
            - Reported symptoms  
            - Doctor’s observations or notes  
            - Medications prescribed  
            - Comparison with the previous visit (status changes or progression)  
            - Notable improvements, if any  
            - Any abnormalities or concerns observed

            Present the entire history in a clear, chronological narrative without repeating instructions or adding commentary. Focus on conveying the essential clinical information for quick understanding.

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

def build_message(visits: List[Dict[str, str]]) -> List[Dict[str, List[Dict[str, str]]]]:
    """
    Formats the visit records into a structured string message for the AI.
    """
    message_parts = []
    for visit in visits:
        date = visit.get("date", "Unknown date")
        symptoms = visit.get("symptoms", "Not provided")
        notes = visit.get("doctorNotes", "Not provided")
        prescription = visit.get("prescription", "Not provided")

        entry = (
            f"Visit Date: {date}\n"
            f"Symptoms: {symptoms}\n"
            f"Doctor Notes: {notes}\n"
            f"Prescription: {prescription}\n"
            "-------------------------\n"
        )
        message_parts.append(entry)

    # Join all parts into one message
    combined_message = "\n".join(message_parts)

    return [{
        "role": "user",
        "content": [{"text": combined_message}]
    }]

def generatePatientReport(visits: List[Dict[str, str]]) -> Dict:
    """
    Generates a medical summary report from a list of patient visit records.
    """

    messages = build_message(visits)

    response = bedrock_client.converse(
        modelId="amazon.nova-pro-v1:0",
        system=system_prompts,
        inferenceConfig=inference_config,
        messages=messages
    )

    summary = response["output"]["message"]["content"][0]["text"].strip()

    return {
        "Summary": summary
    }


# sample_visits = [
#     {
#         "date": "2002-12-12",
#         "doctorNotes": "Patient had flu-like symptoms and slight fever.",
#         "prescription": "Paracetamol 500mg",
#         "symptoms": "Fever, headache, and cough",
#         "id": 1746187261688,
#         "isEditing": False
#     },
#     {
#         "date": "2022-12-12",
#         "doctorNotes": "Symptoms have improved, prescribed rest and fluids.",
#         "prescription": "None",
#         "symptoms": "Mild fatigue",
#         "id": 1746187308357,
#         "isEditing": False
#     }
# ]

# # Example call:
# report = generatePatientReport(sample_visits)
# print(report["Summary"])


# [
#     {
#         "date": "2002-12-12",
#         "doctorNotes": "dhanadf",
#         "prescription": "adf",
#         "symptoms": "adfadf",
#         "id": 1746187261688,
#         "isEditing": false
#     },
#     {
#         "date": "2222-12-12",
#         "doctorNotes": "adfa",
#         "prescription": "adfa",
#         "symptoms": "adfaf",
#         "id": 1746187308357,
#         "isEditing": false
#     }
# ]

# sample_visits = [
#     {
#         "date": "2021-01-15",
#         "doctorNotes": "Patient reported high fever and body aches. Suspected viral infection.",
#         "prescription": "Paracetamol 650mg, rest, and fluids",
#         "symptoms": "High fever, muscle pain",
#         "id": 1746187261001,
#         "isEditing": False
#     },
#     {
#         "date": "2021-03-20",
#         "doctorNotes": "Cough persisted, prescribed antibiotics. No fever.",
#         "prescription": "Azithromycin 500mg",
#         "symptoms": "Dry cough, throat irritation",
#         "id": 1746187261002,
#         "isEditing": False
#     },
#     {
#         "date": "2021-06-05",
#         "doctorNotes": "Patient had seasonal allergies. Eyes were watery and itchy.",
#         "prescription": "Levocetirizine 5mg",
#         "symptoms": "Sneezing, itchy eyes, runny nose",
#         "id": 1746187261003,
#         "isEditing": False
#     },
#     {
#         "date": "2021-09-10",
#         "doctorNotes": "Complained of lower back pain due to prolonged sitting. Suggested posture correction.",
#         "prescription": "Ibuprofen 400mg",
#         "symptoms": "Lower back pain",
#         "id": 1746187261004,
#         "isEditing": False
#     },
#     {
#         "date": "2021-12-01",
#         "doctorNotes": "Complained of anxiety and lack of sleep. Referred to counseling.",
#         "prescription": "Melatonin 3mg, advised therapy",
#         "symptoms": "Insomnia, anxiety",
#         "id": 1746187261005,
#         "isEditing": False
#     },
#     {
#         "date": "2022-02-22",
#         "doctorNotes": "Mild dehydration after travel. Prescribed ORS and rest.",
#         "prescription": "ORS, rest",
#         "symptoms": "Fatigue, dry mouth",
#         "id": 1746187261006,
#         "isEditing": False
#     },
#     {
#         "date": "2022-05-10",
#         "doctorNotes": "Complained of eye strain from screen exposure. Suggested screen breaks.",
#         "prescription": "Lubricating eye drops",
#         "symptoms": "Eye strain, blurred vision",
#         "id": 1746187261007,
#         "isEditing": False
#     },
#     {
#         "date": "2022-08-18",
#         "doctorNotes": "Mild skin rash observed. Possible allergic reaction to detergent.",
#         "prescription": "Antihistamine cream",
#         "symptoms": "Itchy skin rash on arms",
#         "id": 1746187261008,
#         "isEditing": False
#     },
#     {
#         "date": "2023-01-04",
#         "doctorNotes": "Reported chest discomfort during exercise. Referred for ECG.",
#         "prescription": "N/A - referred for diagnostics",
#         "symptoms": "Mild chest discomfort",
#         "id": 1746187261009,
#         "isEditing": False
#     },
#     {
#         "date": "2023-04-14",
#         "doctorNotes": "Follow-up after ECG. No abnormalities found. Advised to continue exercise with warm-up.",
#         "prescription": "None",
#         "symptoms": "No current symptoms",
#         "id": 1746187261010,
#         "isEditing": False
#     }
# ]
