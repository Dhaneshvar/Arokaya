// Mock response generator for the chatbot

// Sample responses
const responses: Record<string, string> = {
  "appointment": "I can help you book an appointment. Please click on the 'Book Appointment' button at the top of the chat or use the menu to access the appointment form.",
  "medication": "I can help you set up medication reminders. Click on the 'Set Reminder' button at the top of the chat or use the menu to access the reminder form.",
  "headache": "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or eye strain. For occasional headaches, over-the-counter pain relievers like acetaminophen or ibuprofen may help. If headaches are severe, persistent, or accompanied by other symptoms, please consult with a healthcare professional.",
  "cold": "Common cold symptoms include runny nose, congestion, sore throat, cough, and mild fever. Rest, staying hydrated, and over-the-counter cold medications can help manage symptoms. Most colds resolve within 7-10 days.",
  "flu": "Flu symptoms include fever, body aches, fatigue, cough, and sometimes vomiting or diarrhea. If you suspect you have the flu, rest and stay hydrated. Antiviral medications may be prescribed if diagnosed early. Severe symptoms warrant medical attention.",
  "covid": "COVID-19 symptoms can include fever, cough, shortness of breath, fatigue, body aches, loss of taste or smell, sore throat, and congestion. If you suspect you have COVID-19, please get tested and follow isolation guidelines if positive.",
  "emergency": "If you're experiencing a medical emergency such as chest pain, difficulty breathing, severe bleeding, or signs of stroke, please call emergency services (911) immediately or go to the nearest emergency room.",
  "hello": "Hello! I'm your MediAssist AI chatbot. How can I assist you with your healthcare needs today?",
  "hi": "Hi there! I'm your MediAssist AI chatbot. How can I help you today with appointments, medication reminders, or medical questions?",
  "help": "I can help you with booking medical appointments, setting medication reminders, answering basic medical questions, and providing health information. What would you like assistance with today?",
};

const generalMedicalTopics = [
  "A healthy diet includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It's recommended to limit processed foods, added sugars, and excessive salt.",
  "Regular exercise is important for overall health. Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity each week, plus muscle-strengthening activities twice a week.",
  "Adults should aim for 7-9 hours of quality sleep per night. Consistent sleep schedules, a comfortable sleep environment, and limiting screen time before bed can help improve sleep quality.",
  "Stress management techniques include deep breathing, meditation, physical activity, connecting with others, and limiting stressors when possible. Chronic stress can negatively impact physical and mental health.",
  "Routine health screenings are important for early detection of health issues. The specific screenings recommended depend on age, sex, family history, and personal risk factors.",
  "Stay up-to-date with vaccinations to protect against preventable diseases. This includes annual flu shots and other recommended vaccines based on age and risk factors.",
  "Mental health is an important part of overall wellbeing. If you're experiencing persistent sadness, anxiety, or other concerning symptoms, consider speaking with a healthcare provider.",
  "Regular hand washing, covering coughs and sneezes, staying home when sick, and maintaining up-to-date vaccinations can help prevent the spread of infectious diseases.",
];

export const generateResponse = async (input: string): Promise<string> => {
  // Convert input to lowercase for easier matching
  const lowerInput = input.toLowerCase();
  
  // Check for exact matches first
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerInput.includes(keyword)) {
      return response;
    }
  }
  
  // Check for question about appointment booking
  if (lowerInput.includes("book") || 
      lowerInput.includes("schedule") || 
      lowerInput.includes("appointment") || 
      lowerInput.includes("see a doctor") || 
      lowerInput.includes("visit")) {
    return "I can help you book an appointment. Please click on the 'Book Appointment' button at the top of the chat or use the menu to access the appointment form. You can choose a specialist, date, and time that works for you.";
  }
  
  // Check for question about medication reminders
  if (lowerInput.includes("reminder") || 
      lowerInput.includes("medication") || 
      lowerInput.includes("medicine") || 
      lowerInput.includes("pill") || 
      lowerInput.includes("drug") ||
      lowerInput.includes("prescription")) {
    return "I can help you set up medication reminders. Click on the 'Set Reminder' button at the top of the chat or use the menu to access the reminder form. You can add details about your medications and when you need to take them.";
  }
  
  // Check for common symptoms
  if (lowerInput.includes("pain") || 
      lowerInput.includes("ache") || 
      lowerInput.includes("hurt") || 
      lowerInput.includes("sore")) {
    return "I'm noticing you're describing pain or discomfort. To provide better guidance, could you specify where you're experiencing the pain, how long it's been present, and its severity? For severe or persistent pain, please consult with a healthcare professional.";
  }
  
  // Check for emergency keywords
  if (lowerInput.includes("emergency") || 
      lowerInput.includes("severe") || 
      lowerInput.includes("chest pain") || 
      lowerInput.includes("can't breathe") || 
      lowerInput.includes("stroke") ||
      lowerInput.includes("heart attack")) {
    return "If you're experiencing a medical emergency such as chest pain, difficulty breathing, severe bleeding, or signs of stroke, please call emergency services (911) immediately or go to the nearest emergency room. These symptoms require immediate professional medical attention.";
  }
  
  // Check for basic greetings
  if (lowerInput.includes("hello") || 
      lowerInput.includes("hi") || 
      lowerInput.includes("hey") || 
      lowerInput.startsWith("good morning") || 
      lowerInput.startsWith("good afternoon") ||
      lowerInput.startsWith("good evening")) {
    return "Hello! I'm your MediAssist AI chatbot. How can I assist you with your healthcare needs today? I can help with booking appointments, setting medication reminders, or answering basic medical questions.";
  }
  
  // If no matches, return a general health tip or ask for clarification
  if (Math.random() > 0.5) {
    const randomIndex = Math.floor(Math.random() * generalMedicalTopics.length);
    return generalMedicalTopics[randomIndex] + "\n\nHow else can I assist you with your healthcare needs today?";
  } else {
    return "I'm not sure I understood your question. Could you please provide more details or rephrase? I can help with booking appointments, setting medication reminders, or answering basic medical questions.";
  }
};