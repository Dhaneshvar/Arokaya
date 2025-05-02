import boto3
import uuid
from util import *
from dotenv import load_dotenv
import os

# Load environment variables from .env file


def multiAgentMain(message: str):
    load_dotenv()
    # Access environment variables
    agentId = os.getenv('agentID')
    agentAliasId = os.getenv('agentAliasId')
    # This should print your AWS credentials if loaded correctly
    print("Access Key:", os.getenv("AWS_ACCESS_KEY_ID"))
    print("Secret Key:", os.getenv("AWS_SECRET_ACCESS_KEY"))
    print("agentID", agentId)
    print("agentAliasId", agentAliasId)
    sessionId = str(uuid.uuid4())
    res = invoke_agent(
            agentId = agentId,
            agentAliasId = agentAliasId,
            sessionId = sessionId,
            inputText = message,
            endSession = False,
            enableTrace = True
        )
    print("agentmain",res)

    return res

# res = multiAgentMain("Can you list the available doctors ?")
# print("agentmain",res)
# message = 'can you book me appoinment ?'
# message = '12.12.2002 at 4.30 AM'
# while True:
#     # message = 'what is your name ?'
#     print("User: Enter your query:\n")
#     message = input().strip()
#     if message == 'stop':
#         break
#     else:
#         res = invoke_agent(
#             agentId = agentId,
#             agentAliasId = agentAliasId,
#             sessionId = sessionId,
#             inputText = message,
#             endSession = False,
#             enableTrace = True
#         )

#         print(res)