import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  AppBar, 
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  CircularProgress,
  Slide,
  Zoom,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Tooltip,
} from '@mui/material';
import { Send, ArrowLeft, Calendar, Clock, X, Menu, RefreshCw, Trash2, Activity, User, HelpCircle, Bell, Settings, LogOut, Upload, FileText, AlertCircle, Thermometer, Stethoscope, Pill as Pills, Heart, CalendarPlus } from 'lucide-react';
import { generateResponse } from '../services/chatService';
import { Message } from '../types/types';
import AppointmentForm from './AppointmentForm';
import MedicationReminder from './MedicationReminder';
import { TabPanel, a11yProps } from './TabPanel';

const ChatbotPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      content: "Hello! I'm your Arokaya AI Assistant. How can I help you today? You can ask me about medical information, book appointments, or set medication reminders.", 
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [appointmentFormOpen, setAppointmentFormOpen] = useState(false);
  const [reminderFormOpen, setReminderFormOpen] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);

  const quickQuestions = [
    // {
    //   category: 'Symptoms',
    //   icon: <Thermometer size={16} />,
    //   questions: [
    //     "What are the symptoms of the flu?",
    //     "What causes frequent headaches?",
    //     "Is my cough serious?",
    //   ]
    // },
    // {
    //   category: 'Medical Advice',
    //   icon: <Stethoscope size={16} />,
    //   questions: [
    //     "When should I see a doctor?",
    //     "How to treat a minor burn?",
    //     "First aid for cuts and scrapes",
    //   ]
    // },
    // {
    //   category: 'Medications',
    //   icon: <Pills size={16} />,
    //   questions: [
    //     "Common medication side effects",
    //     "Drug interaction concerns",
    //     "When to take medications",
    //   ]
    // },
    {
      category: 'Booking Tips',
      icon: <CalendarPlus  size={16} />,
      questions: [
        "I have heavy headache, can you book appoinment with doctor ",
        "can you show me available doctors",
        "I wanted to visit Dr. Raju is he available on 12.12.2024 at 5.00 PM?",
      ]
    }
  ];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (input.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowQuickQuestions(false);

    try {
      setTimeout(async () => {
        fetch('http://127.0.0.1:5000/agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),  // Send user message here
        })
          .then((res) => res.json())
          .then((data) => {
            const botMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: data.res, // Assuming response JSON has { reply: "..." }
              sender: 'bot',
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
          })
          .catch((error) => {
            console.error('Error generating response:', error);
            setIsTyping(false);
          });
      }, 1500);
    } catch (error) {
      console.error('Error generating response:', error);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClearChat = () => {
    setMessages([
      { 
        id: '1', 
        content: "Hello! I'm your Arokaya AI Assistant. How can I help you today? You can ask me about medical information, book appointments, or set medication reminders.", 
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
    ]);
    setShowQuickQuestions(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
        const userMessage: Message = {
          id: Date.now().toString(),
          content: `Uploaded prescription: ${file.name}`,
          sender: 'user',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
        setShowQuickQuestions(false);
        
        setIsTyping(true);
        setTimeout(() => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "I've received your prescription. I'll analyze it and help you understand the medications and dosage instructions. Please let me know if you have any specific questions about your prescription.",
            sender: 'bot',
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 1500);
      } else {
        alert('Please upload only PDF or image files');
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
                  // color: '#1976d2',
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
                  // color: '#555',
                }}
              >
                (An AI powered MediAssist)
              </Box>
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          {!isMobile && (
            <>
              <Button 
                color="inherit" 
                startIcon={<Calendar />}
                onClick={() => setAppointmentFormOpen(true)}
              >
                Book Appointment
              </Button>
              <Button 
                color="inherit" 
                startIcon={<Clock />}
                onClick={() => setReminderFormOpen(true)}
                sx={{ ml: 1 }}
              >
                Set Reminder
              </Button>
              <IconButton 
                color="inherit"
                onClick={handleClearChat}
                sx={{ ml: 1 }}
                aria-label="clear chat"
              >
                <Trash2 size={20} />
              </IconButton>
            </>
          )}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280, pt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <User />
            </Avatar>
            <Box>
              <Typography variant="subtitle1">Dhaneshvar</Typography>
              <Typography variant="body2" color="text.secondary">dhaneshvar@example.com</Typography>
            </Box>
            <IconButton 
              edge="end" 
              onClick={() => setDrawerOpen(false)}
              sx={{ ml: 'auto' }}
            >
              <X size={20} />
            </IconButton>
          </Box>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => {
                setAppointmentFormOpen(true);
                setDrawerOpen(false);
              }}>
                <ListItemIcon>
                  <Calendar size={24} />
                </ListItemIcon>
                <ListItemText primary="Book Appointment" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => {
                setReminderFormOpen(true);
                setDrawerOpen(false);
              }}>
                <ListItemIcon>
                  <Clock size={24} />
                </ListItemIcon>
                <ListItemText primary="Set Medication Reminder" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => {
                handleClearChat();
                setDrawerOpen(false);
              }}>
                <ListItemIcon>
                  <RefreshCw size={24} />
                </ListItemIcon>
                <ListItemText primary="New Conversation" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <HelpCircle size={24} />
                </ListItemIcon>
                <ListItemText primary="Help & FAQ" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Bell size={24} />
                </ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Settings size={24} />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleGoBack}>
                <ListItemIcon>
                  <LogOut size={24} />
                </ListItemIcon>
                <ListItemText primary="Back to Home" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {isMobile && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            aria-label="chat tabs"
          >
            <Tab label="Chat" {...a11yProps(0)} />
            <Tab label="Appointments" {...a11yProps(1)} />
            <Tab label="Reminders" {...a11yProps(2)} />
          </Tabs>
        </Box>
      )}

      <TabPanel value={tabValue} index={0}>
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            bgcolor: '#f5f7fb'
          }}
        >
          <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {messages.map((message, index) => (
              <Zoom
                in={true}
                key={message.id}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  {message.sender === 'bot' && (
                    <Avatar sx={{ mr: 1, bgcolor: 'primary.main', height: 32, width: 32 }}>
                      <Activity size={16} />
                    </Avatar>
                  )}
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7, textAlign: 'right' }}>
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Paper>
                  {message.sender === 'user' && (
                    <Avatar sx={{ ml: 1, bgcolor: '#9C27B0', height: 32, width: 32 }}>
                      <User size={16} />
                    </Avatar>
                  )}
                </Box>
              </Zoom>
            ))}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mt: 1 }}>
                <Avatar sx={{ mr: 1, bgcolor: 'primary.main', height: 32, width: 32 }}>
                  <Activity size={16} />
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: '18px 18px 18px 4px',
                    bgcolor: 'background.paper',
                    display: 'inline-flex',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Typing
                    </Typography>
                    <Box sx={{ display: 'flex', mx: 1 }}>
                      <Slide direction="up" in={true} style={{ transitionDelay: '0ms' }}>
                        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'text.secondary', mx: 0.5 }} />
                      </Slide>
                      <Slide direction="up" in={true} style={{ transitionDelay: '200ms' }}>
                        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'text.secondary', mx: 0.5 }} />
                      </Slide>
                      <Slide direction="up" in={true} style={{ transitionDelay: '400ms' }}>
                        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'text.secondary', mx: 0.5 }} />
                      </Slide>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Container>
        </Box>
        
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
          <Container maxWidth="md">
            {showQuickQuestions && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Quick Questions
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {quickQuestions.map((category, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
                        {category.icon}
                        <span style={{ marginLeft: '4px' }}>{category.category}</span>
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {category.questions.map((question, qIndex) => (
                          <Chip
                            key={qIndex}
                            label={question}
                            onClick={() => handleQuickQuestion(question)}
                            sx={{
                              borderRadius: '16px',
                              backgroundColor: 'rgba(25, 118, 210, 0.08)',
                              '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.12)',
                              },
                              height: 'auto',
                              '& .MuiChip-label': {
                                display: 'block',
                                whiteSpace: 'normal',
                                padding: '8px 12px',
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </>
            )}
            
            <Box sx={{ display: 'flex', mt: 1 }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="application/pdf,image/*"
                style={{ display: 'none' }}
              />
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                inputRef={inputRef}
                multiline
                maxRows={4}
                InputProps={{
                  sx: { borderRadius: '24px', pr: 1 }
                }}
              />
              <Tooltip title="Upload Prescription">
                <IconButton 
                  color="primary"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ ml: 1 }}
                >
                  <Upload />
                </IconButton>
              </Tooltip>
              <IconButton 
                color="primary" 
                onClick={handleSend} 
                disabled={input.trim() === '' || isTyping}
                sx={{ ml: 1 }}
              >
                {isTyping ? <CircularProgress size={24} /> : <Send />}
              </IconButton>
            </Box>
          </Container>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <AppointmentForm 
          fullPage={true} 
          onClose={() => setTabValue(0)}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <MedicationReminder 
          fullPage={true} 
          onClose={() => setTabValue(0)}
        />
      </TabPanel>

      <Dialog
        open={appointmentFormOpen}
        onClose={() => setAppointmentFormOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Book an Appointment
          <IconButton
            aria-label="close"
            onClick={() => setAppointmentFormOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AppointmentForm 
            fullPage={false} 
            onClose={() => setAppointmentFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={reminderFormOpen}
        onClose={() => setReminderFormOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Set Medication Reminder
          <IconButton
            aria-label="close"
            onClick={() => setReminderFormOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <MedicationReminder
            fullPage={false}
            onClose={() => setReminderFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ChatbotPage;