import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './components/Home';
import ChatbotPage from './components/ChatbotPage';
import SwipeCards from './components/CardSwipe';
import Timeline  from './components/Timeline';

import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router
      future={{
       v7_startTransition: true,
       v7_relativeSplatPath: true,
       // Add other flags as needed
     }}
     >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatbotPage />} />
          <Route path="/swipecard" element={<SwipeCards />} />
          <Route path="/doctorVisits" element={<Timeline />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;