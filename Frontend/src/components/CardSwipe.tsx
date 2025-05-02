import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { HeartPulse, ArrowLeftCircle, ArrowRightCircle, Cable, ClipboardPlus  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import maledoctor from '../services/Assets/maledoctor.png';
import femaledoctor from '../services/Assets/femaledoctor.png';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  AppBar, 
  Toolbar,
} from '@mui/material';

import { ArrowLeft, Activity } from 'lucide-react';

import CustomizedDialogs from './ReportModal';

interface CardType {
  id: number;
  name: string;
  url: string;
}

const doctorImages = [
  femaledoctor,
  maledoctor,
];

const SwipeCards: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [questionInput, setQuestionInput] = useState('');
  const [started, setStarted] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<CardType[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [currHistory, setAllHistory] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState('')
  const [openPopup, setPopupOpen] = useState(false);

  const navigate = useNavigate();

  const handleStart = async () => {
    if (questionInput.trim()) {
      const firstCard = { id: 1, name: questionInput.trim(), url: 'https://placehold.co/300x400' };
      setCards([firstCard]);
      await setQuestionHistory([firstCard]);
      console.log(firstCard, questionInput)
      setStarted(true);
      await callAPI('yes')
    }
  };

  const callAPI = async (direction: 'yes' | 'no') => {
    try {
      const response = await fetch('http://127.0.0.1:5000/askaidoctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questionHistory.length === 0 ? questionInput : questionHistory[questionHistory.length - 1]?.name,
          // question: questionHistory[questionHistory.length - 1]?.name,
          answer: direction,
          session_id: 1,
        }),
      });

      const data = await response.json();
      console.log("Data", data.res);
      console.log("questionHistory in react", questionHistory)
      console.log("res histsory", data.res['history'])
      setAllHistory(data.res['history'])

      if (data && data.res) {

        const newCard = {
          id: questionHistory.length + 1,
          name: data.res['next_question'],
          url: 'https://placehold.co/300x400',
        };
        setCards([newCard]);
        setQuestionHistory((prev) => [...prev, newCard]);
      }
    } catch (error) {
      console.error('Error fetching the next question:', error);
    }
  }

  const handleSwipe = async (id: number, direction: 'yes' | 'no') => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    callAPI(direction)
    
  };

  const handleSkip = () => {
    setCards((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    setIsFinished(true);
    setCards([]);
  };

  const handleRedirect = () => {
    navigate('/chat');
  };

  const handlePrevious = () => {
    if (questionHistory.length > 1) {
      const previous = questionHistory[questionHistory.length - 2];
      setCards([previous]);
      setQuestionHistory((prev) => prev.slice(0, -1));
    }
  };


  const handleGoBack = () => {
    navigate('/');
  };

  const handleGenerateSummary = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/generateSummary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patienceConversation: currHistory,
          }),
        });
        setAllHistory('');
        setQuestionHistory([]);
        setCards([]);
        const data = await response.json();
        console.log("summary", data.conversation['Summary']);

        if (data && data.conversation) {
          setGeneratedSummary(data.conversation['Summary'])
          setPopupOpen(true)
        }
      } catch (error) {
        console.error('Error fetching the next question:', error);
        setPopupOpen(false)
      }
    }


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
        </Toolbar>
      </AppBar>
      <div className="relative h-screen w-full bg-gradient-to-br from-cyan-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-blue-900">Answer Arokaya's Question</h1>
        <p className="text-sm text-gray-600">
          <ArrowLeftCircle className="inline w-5 h-5 text-red-500 mx-1" /> Swipe left for No
          <Cable className="inline w-5 h-5 mx-1" style={{ color: '#ffd500' }} />
          Swipe right for Yes
          <ArrowRightCircle className="inline w-5 h-5 text-green-500 mx-1" />
        </p>
      </div>

      {!started ? (
        <div className="flex flex-col items-center" style={{paddingTop: '50px'}}>
          <h4 style={{paddingBottom: '50px'}} >Imagine you're talking to your virtual doctor. What would you like to say?</h4>
          <input
            type="text"
            placeholder="How are you feeling today?"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300 w-64 mb-4"
            />
          <Button variant="contained" color="success" onClick={handleStart}>Get Started</Button>
        </div>
      ) : (
        <>
          <div className="relative w-72 h-96">
            {!isFinished ? (
              cards.length > 0 ? (
                cards.map((card, index) => (
                  <Card
                    key={card.id}
                    card={card}
                    index={index}
                    isFront={index === cards.length - 1}
                    onSwipe={(dir) => handleSwipe(card.id, dir)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-blue-800 font-semibold">
                  <HeartPulse className="animate-pulse w-12 h-12 text-red-500 mb-4" />
                  <p>Generating next question...</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-blue-800 font-semibold">
                <p>Interaction Ended</p>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ClipboardPlus  />}
                  // onClick={handleRedirect}
                  onClick={handleGenerateSummary}
                >
                  Generate Summary
                </Button>
                <p className="text-xl">Thank you for your responses</p>
                {generatedSummary && (
                  <CustomizedDialogs 
                    reportDetails={generatedSummary} 
                    setPopupOpen={setPopupOpen} 
                    openPopup={openPopup}
                    />
                )}
              </div>
            )}
          </div>

          {!isFinished && (
            <div className="mt-6 flex gap-4">
              <button onClick={handlePrevious} className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white font-medium">Previous</button>
              <button onClick={handleSkip} className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-white font-medium">Skip</button>
              <button onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium">Submit</button>
            </div>
          )}
         
        </>
      )}
    </div>
    </Box>
  );
};

interface CardProps {
  card: CardType;
  isFront: boolean;
  onSwipe: (direction: 'yes' | 'no') => void;
  index: number;
}

const Card: React.FC<CardProps> = ({ card, isFront, onSwipe, index }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-15, 15]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const handleDragEnd = () => {
    if (x.get() > 100) {
      onSwipe('yes');
    } else if (x.get() < -100) {
      onSwipe('no');
    }
  };

  return (
    <motion.div
      className="absolute h-96 w-72 rounded-2xl shadow-2xl border border-blue-300 bg-white flex items-center justify-center text-center px-4 py-6"
      style={{
        backgroundImage: `url(${doctorImages[index+1 % doctorImages.length]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        x,
        rotate,
        opacity,
        cursor: isFront ? 'grab' : 'default',
        zIndex: isFront ? 10 : 5,
      }}
      animate={{ scale: isFront ? 1 : 0.95, y: isFront ? 0 : 10 }}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      <div className="backdrop-blur-sm bg-white/70 p-4 rounded-xl w-full">
        <p className="text-md font-semibold text-gray-900">{card.name}</p>
      </div>
    </motion.div>
  );
};

export default SwipeCards;
