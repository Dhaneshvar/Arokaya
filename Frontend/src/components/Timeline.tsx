import React, { useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { useNavigate } from 'react-router-dom';

import { 
  Box, 
  Container, 
  Typography, 
  IconButton,
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Fab,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider
} from '@mui/material';
import CustomizedDialogs from './ReportModal';
import CircularProgress from '@mui/material/CircularProgress';
import { ArrowLeft, ClipboardPlus, Clock, MessageCircle, Heart, Users, Activity, User } from 'lucide-react';

import {
  CalendarDays,
  ClipboardList,
  Pill,
  HeartPulse,
  PlusCircle,
  Save,
  PencilLine,
  Stethoscope,
} from "lucide-react";

type TimelineItem = {
  id: number;
  date: string;
  doctorNotes: string;
  prescription: string;
  symptoms: string;
  isEditing?: boolean;
};

const WorkIcon: React.FC = () => (
  <Stethoscope style={{ width: "20px", height: "20px", color: "white" }} />
);

const Timeline: React.FC = () => {
  const navigate = useNavigate();
  const [openPopup, setPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPatientSummary, setGeneratedPatientSummary] = useState("");
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<TimelineItem, "id">>({
    date: "",
    doctorNotes: "",
    prescription: "",
    symptoms: "",
  });

  const handleAddItem = () => {
    if (!newItem.date) return;
    setItems((prev) => [
      ...prev,
      { ...newItem, id: Date.now(), isEditing: false },
    ]);
    setNewItem({ date: "", doctorNotes: "", prescription: "", symptoms: "" });
  };

  const handleUpdateItem = (id: number, key: keyof TimelineItem, value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      )
    );
  };

  const toggleEdit = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  const generateSummary = () => {
    const summary = items.map(({ id, isEditing, ...data }) => data);
    console.log("Summary to send to Gen AI:", summary);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleChatClick = () => {
    navigate('/chat');
  };

  const handleCardClick = () => {
    navigate('/swipecard');
  }

  const generatePatientSummary = async () => {
    setIsLoading(true); // Start loader
    try {
      const response = await fetch('http://127.0.0.1:5000/generatePatientSummary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientReport: items,
        }),
      });
  
      const data = await response.json();
      console.log("summary", data.conversation['Summary']);
  
      if (data && data.conversation) {
        setGeneratedPatientSummary(data.conversation['Summary']);
        setPopupOpen(true);
      }
    } catch (error) {
      console.error('Error fetching the summary:', error);
      setPopupOpen(false);
    } finally {
      setIsLoading(false); // Stop loader
    }
  };
  

  console.log("items", items);

  return (
    
    <div className="App" style={{ background: "#f9f9f9", minHeight: "100vh",}}>
      <AppBar position="static" elevation={0} color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={handleGoBack}
            sx={{ mr: 2 }}
          >
            <ArrowLeft />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Activity size={28} color="#4CAF50" /> {/* Slightly larger, green */}
          <Typography variant="h6" component="div" sx={{ ml: 1, display: 'flex', alignItems: 'baseline' }}>
              <Box
                component="span"
                sx={{
                  fontFamily: 'Pacifico, cursive',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  mr: 1
                }}
              >
                Arokaya
              </Box>
              <Box
                component="span"
                sx={{
                  fontFamily: 'Roboto Mono, monospace',
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                }}
              >
                (An AI powered MediAssist)
              </Box>
              <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                  <Button color="inherit">Features</Button>
                  <Button color="inherit">Testimonials</Button>
                  <Button color="inherit">Contact</Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    // sx={{backgroundColor: 'green'}}
                    startIcon={<MessageCircle />}
                    onClick={handleChatClick}
                  >
                    Ask Arokaya Assistance
                  </Button>
                  <Button 
                    variant="contained" 
                    // color="primary" 
                    // sx={{backgroundColor: 'green'}}
                    startIcon={<Activity />}
                    onClick={handleCardClick}
                  >
                    Medical Diagnostic
                  </Button>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                  {isLoading ? (
                    <>
                      <CircularProgress size={24} color="primary" sx={{color: '#45d219'}} />
                      <span style={{ fontSize: "1rem", color: "#45d219", fontWeight: 500 }}>
                        Generating Patient Visits Summary ...
                      </span>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<ClipboardPlus />}
                      onClick={generatePatientSummary}
                      sx={{
                        border: "2px solid rgb(132, 186, 249)",
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        padding: "0.6rem 1.2rem",
                        minWidth: "200px",
                        transition: "all 0.2s ease-in-out",
                        '&:hover': {
                          backgroundColor: "#1565c0",
                          transform: "scale(1.05)",
                        },
                        '&:active': {
                          transform: "scale(0.97)",
                        },
                      }}
                    >
                      Generate Summary
                    </Button>
                  )}
                </div>
                </Box>
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          padding: "2rem",
          margin: "2rem",
        }}
      >
        <h2 style={{ marginBottom: "2rem", textAlign: 'center' }}>➕ Add Medical Record of Patient Dhaneshvar</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <label>
            <CalendarDays size={16} /> Date:
            <input
              type="date"
              value={newItem.date}
              onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
              style={inputStyle}
            />
          </label>
          <label>
            <ClipboardList size={16} /> Doctor Notes:
            <input
              placeholder="Notes"
              value={newItem.doctorNotes}
              onChange={(e) => setNewItem({ ...newItem, doctorNotes: e.target.value })}
              style={inputStyle}
            />
          </label>
          <label>
            <Pill size={16} /> Prescription:
            <input
              placeholder="Prescription"
              value={newItem.prescription}
              onChange={(e) => setNewItem({ ...newItem, prescription: e.target.value })}
              style={inputStyle}
            />
          </label>
          <label>
            <HeartPulse size={16} /> Symptoms:
            <input
              placeholder="Symptoms"
              value={newItem.symptoms}
              onChange={(e) => setNewItem({ ...newItem, symptoms: e.target.value })}
              style={inputStyle}
            />
          </label>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <button
            onClick={handleAddItem}
            style={{
              background: "#1976d2",
              color: "#fff",
              padding: "0.6rem 1.2rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <PlusCircle size={16} /> Add Patient Record
          </button>
        </div>
      </div>

      {generatedPatientSummary && openPopup && (
        <CustomizedDialogs 
          reportDetails={generatedPatientSummary} 
          setPopupOpen={setPopupOpen} 
          openPopup={openPopup}
          />
      )}

      {/* Timeline */}
      <VerticalTimeline lineColor="#1976d2">
        {items.map((item) => (
          <VerticalTimelineElement
            key={item.id}
            date={item.date}
            iconStyle={{ background: "#1976d2", color: "#fff" }}
            icon={<WorkIcon />}
            contentStyle={{ background: "#e3f2fd", color: "#000" }}
            contentArrowStyle={{ borderRight: "7px solid #1976d2" }}
          >
            {item.isEditing ? (
              <>
                <input
                  value={item.date}
                  onChange={(e) => handleUpdateItem(item.id, "date", e.target.value)}
                  style={inputStyle}
                />
                <input
                  value={item.doctorNotes}
                  onChange={(e) => handleUpdateItem(item.id, "doctorNotes", e.target.value)}
                  style={inputStyle}
                />
                <input
                  value={item.prescription}
                  onChange={(e) => handleUpdateItem(item.id, "prescription", e.target.value)}
                  style={inputStyle}
                />
                <input
                  value={item.symptoms}
                  onChange={(e) => handleUpdateItem(item.id, "symptoms", e.target.value)}
                  style={inputStyle}
                />
                <button onClick={() => toggleEdit(item.id)} style={editBtnStyle}>
                  <Save size={14} /> Save
                </button>
              </>
            ) : (
              <>
                <h3>
                  <ClipboardList size={16} /> Doctor Notes:
                </h3>
                <p>{item.doctorNotes}</p>
                <h4>
                  <Pill size={16} /> Prescription:
                </h4>
                <p>{item.prescription}</p>
                <h4>
                  <HeartPulse size={16} /> Symptoms:
                </h4>
                <p>{item.symptoms}</p>
                <button onClick={() => toggleEdit(item.id)} style={editBtnStyle}>
                  <PencilLine size={14} /> Edit
                </button>
              </>
            )}
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.5rem",
  marginTop: "0.5rem",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "1rem",
};

const editBtnStyle: React.CSSProperties = {
  marginTop: "1rem",
  background: "#1976d2",
  color: "#fff",
  border: "none",
  padding: "0.4rem 0.8rem",
  borderRadius: "6px",
  cursor: "pointer",
};

export default Timeline;

