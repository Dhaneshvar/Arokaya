import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
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
import { MessageCircle, Calendar, Clock, FileText, Heart, Users, Activity, User } from 'lucide-react';

const features = [
  {
    title: 'Medical Consultation',
    description: 'Ask health-related questions and get instant responses from our AI assistant.',
    icon: <MessageCircle size={36} />,
    color: '#1976D2'
  },
  {
    title: 'Book Appointments',
    description: 'Schedule appointments with healthcare professionals using AI Agent',
    icon: <Calendar size={36} />,
    color: '#4CAF50'
  },
  {
    title: 'Medication Reminders',
    description: 'Set up reminders for taking medications on time using Agents',
    icon: <Clock size={36} />,
    color: '#FF9800'
  },
  {
    title: 'Medical Records',
    description: 'Access and manage your medical records securely.',
    icon: <FileText size={36} />,
    color: '#E91E63'
  },
  {
    title: 'Health Tips',
    description: 'Receive personalized health tips based on your profile.',
    icon: <Heart size={36} />,
    color: '#9C27B0'
  },
  {
    title: 'Find Specialists',
    description: 'Find specialized doctors near you for specific health issues.',
    icon: <Users size={36} />,
    color: '#00BCD4'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Patient',
    content: 'This chatbot made scheduling appointments so easy! I got all my questions answered without waiting on hold.',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    name: 'Michael Chen',
    role: 'Patient',
    content: 'I use the medication reminders daily. The interface is intuitive and the AI responds intelligently to my questions.',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Healthcare Professional',
    content: 'The appointment system has reduced no-shows in my practice. My patients love how easy it is to use.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleChatClick = () => {
    navigate('/chat');
  };

  const handleCardClick = () => {
    navigate('/swipecard');
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Activity size={32} color="#1976D2" />
            <Typography variant="h5" component="div" sx={{ ml: 1, fontWeight: 600, color: '#1976D2' }}>
            Arokaya
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button color="inherit">Features</Button>
            <Button color="inherit">Testimonials</Button>
            <Button color="inherit">Contact</Button>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<MessageCircle />}
              onClick={handleChatClick}
            >
              Ask Arokaya Assistance
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Activity />}
              onClick={handleCardClick}
            >
              Medical Diagnostic
            </Button>
          </Box>
          {isMobile && (
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<MessageCircle />}
              onClick={handleChatClick}
              size="small"
            >
              Ask Arokaya
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, md: 10 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Your AI Powered MediAssist
          </Typography>
          <Typography variant="h5" component="h2" sx={{ mb: 4, opacity: 0.9 }}>
            Book appointments, get medical advice, and manage your health with our intelligent assistant.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            color="secondary" 
            onClick={handleChatClick}
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontSize: '1.1rem',
              boxShadow: '0 8px 16px rgba(76, 175, 80, 0.3)',
              '&:hover': {
                boxShadow: '0 12px 20px rgba(76, 175, 80, 0.4)',
              }
            }}
          >
          <Typography variant="body1" sx={{ fontWeight: 500, mr: 1 }}>
          CHAT WITH
          </Typography>
          <Activity size={20} style={{ marginRight: 6 }} />
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            AROKAYA
          </Typography>
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6, fontWeight: 600 }}>
          How MediAssist Can Help You
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
                elevation={2}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2, color: feature.color }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6, fontWeight: 600 }}>
            What Our Users Say
          </Typography>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={testimonial.avatar} alt={testimonial.name} sx={{ width: 56, height: 56 }} />
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="h6" component="div">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1, fontStyle: 'italic' }}>
                      "{testimonial.content}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#f5f5f7', py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Our AI medical assistant is available 24/7 to help with your healthcare needs.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            color="primary" 
            onClick={handleChatClick}
            startIcon={<MessageCircle />}
            sx={{ px: 4, py: 1.5 }}
          >
            Chat with Arokaya Now
          </Button>
        </Container>
      </Box>

      <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 4 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Activity size={24} />
                <Typography variant="h6" sx={{ ml: 1 }}>Arokaya</Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Your AI-powered healthcare assistant for appointments, reminders, and medical advice.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>Quick Links</Typography>
              <Typography variant="body2" gutterBottom sx={{ opacity: 0.8 }}>Features</Typography>
              <Typography variant="body2" gutterBottom sx={{ opacity: 0.8 }}>Testimonials</Typography>
              <Typography variant="body2" gutterBottom sx={{ opacity: 0.8 }}>Privacy Policy</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Terms of Service</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>Contact</Typography>
              <Typography variant="body2" gutterBottom sx={{ opacity: 0.8 }}>support@Arokaya.com</Typography>
              <Typography variant="body2" gutterBottom sx={{ opacity: 0.8 }}>+1 (91) 9239-323-532</Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © {new Date().getFullYear()} Arokaya. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Floating action button for chat */}
      <Fab 
        color="primary" 
        aria-label="chat"
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          display: { md: 'none' },
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.5)'
        }}
        onClick={handleChatClick}
      >
        <MessageCircle />
      </Fab>
    </Box>
  );
};

export default Home;