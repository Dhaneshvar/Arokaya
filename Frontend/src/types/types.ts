export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: Date;
  time: string;
  reason: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: Date;
  days: string[];
  active: boolean;
}