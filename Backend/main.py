from flask import Flask, jsonify, request
from agentmain import multiAgentMain
from aidoctorqn import arokayaAiDoctor
from summary import generateReport
from reportForDoctor import generatePatientReport

from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})
import json
@app.route('/')
def home():
    print("running")
    return jsonify({"home": "running"})

@app.route('/agent', methods=['POST'])
def multiAgent():
    if request.method == 'POST':
        data = request.get_json()
        user_message = data.get('message', '')
        res = multiAgentMain(user_message)
        print(res)
        if res is None:
            print("Warning: agent returned None")
            return jsonify({"res": "Can you try a different prompt or share more information? That'll help me respond more accurately", "error": "Can you try again with different prompt"}), 200
        return jsonify({"res": res})
    
@app.route('/askaidoctor', methods=['POST'])
def callAiAgent():
    if request.method == 'POST':
        data = request.get_json()
        session_id = data.get("session_id")
        question = data.get("question")
        answer = data.get("answer")

        if not session_id:
            return jsonify({"error": "session_id is required"}), 400

        res = arokayaAiDoctor(session_id, question, answer)
        print("rssss",res['next_question'])
        return jsonify({"res": res})


@app.route('/generateSummary', methods=['POST'])
def generateSummary():
    if request.method == 'POST':
        data = request.get_json()
        patienceConversation = data.get("patienceConversation")
        print("patienceCon", patienceConversation)
        conversationSummary = generateReport(patienceConversation)
        print("conve", conversationSummary)
        return jsonify({"conversation": conversationSummary})
    
@app.route('/generatePatientSummary', methods=['POST'])
def generatePatientSummary():
    if request.method == 'POST':
        data = request.get_json()
        timelines = data.get("patientReport")
        print("timelines", timelines)
        conversationSummary = generatePatientReport(timelines)
        print("conversation", conversationSummary)
        return jsonify({"conversation": conversationSummary})
        # return jsonify({"dummy": 'dummy'})
    

if __name__ == '__main__':
    app.run(debug=True)


# flask --app main --debug run
# pip freeze > requirements.txt
# pip install -r requirements.txt