
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { HeartPulse, ArrowRightCircle, ArrowLeftCircle } from 'lucide-react';

interface CardType {
  id: number;
  question: string;
}

const initialCards: CardType[] = [
  { id: 1, question: 'Do you experience frequent headaches?' },
  { id: 2, question: 'Are you currently on any medication?' },
  { id: 3, question: 'Do you have a history of allergies?' },
];

const SwipeCards: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>(initialCards);
  const [questionId, setQuestionId] = useState(4);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleAnswer = async (card: CardType, answer: 'Yes' | 'No' | 'Skip') => {
    setHasStarted(true);

    if (answer !== 'Skip') {
      console.log(`Q: ${card.question}, A: ${answer}`);
      const newQuestion = await fetchNextQuestion(card.question, answer);
      if (newQuestion) {
        setCards((prev) => [...prev, { id: questionId, question: newQuestion }]);
        setQuestionId((id) => id + 1);
      }
    }
    setCards((prev) => prev.filter((c) => c.id !== card.id));
  };

  const handleSubmit = () => {
    setCards([]);
    setSessionEnded(true);
  };

  const topCard = cards[cards.length - 1];

  return (
    <div
      className="grid h-screen w-full place-items-center bg-blue-100 px-4 relative"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1588776814546-bfbf443f3b20?auto=format&fit=crop&w=1470&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative w-80 h-[450px]">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            isFront={index === cards.length - 1}
            onSwipe={(answer) => handleAnswer(card, answer)}
          />
        ))}
        {sessionEnded && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute h-[450px] w-80 rounded-xl bg-white shadow-xl p-6 text-center flex flex-col justify-center items-center"
          >
            <h2 className="text-xl font-bold text-green-700">Session Ended</h2>
            <p className="mt-2 text-gray-500">Thank you for your time!</p>
          </motion.div>
        )}
        {!hasStarted && !sessionEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col justify-center items-center bg-white/60 rounded-xl"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-red-500 mb-3"
            >
              <HeartPulse size={48} strokeWidth={1.5} />
            </motion.div>
            <p className="text-sm text-gray-700 font-medium">Waiting for your first response...</p>
          </motion.div>
        )}
      </div>

      {!sessionEnded && cards.length > 0 && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => handleAnswer(topCard, 'Skip')}
            className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

interface CardProps {
  card: CardType;
  isFront: boolean;
  onSwipe: (answer: 'Yes' | 'No') => void;
}

const Card: React.FC<CardProps> = ({ card, isFront, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-15, 15]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const showYes = useTransform(x, (latest) => latest > 50 ? 1 : 0);
  const showNo = useTransform(x, (latest) => latest < -50 ? 1 : 0);

  const handleDragEnd = () => {
    const xVal = x.get();
    if (xVal > 100) onSwipe('Yes');
    else if (xVal < -100) onSwipe('No');
  };

  return (
    <motion.div
      className="absolute h-[450px] w-80 rounded-xl bg-white shadow-xl p-6 text-center flex flex-col justify-center items-center border-2 border-blue-200"
      style={{
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
      <h2 className="text-lg font-semibold text-blue-800">{card.question}</h2>
      <p className="mt-4 text-sm text-gray-500">Swipe right for Yes, left for No</p>

      {/* Arrows */}
      <motion.div
        style={{ opacity: showYes }}
        className="absolute right-4 top-4 text-green-600"
      >
        <ArrowRightCircle size={32} />
      </motion.div>
      <motion.div
        style={{ opacity: showNo }}
        className="absolute left-4 top-4 text-red-600"
      >
        <ArrowLeftCircle size={32} />
      </motion.div>
    </motion.div>
  );
};

// Simulated API response
const fetchNextQuestion = async (_: string, __: string): Promise<string | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const next = [
        'Have you experienced chest pain recently?',
        'Do you sleep well at night?',
        'Is there a family history of diabetes?',
      ];
      const random = next[Math.floor(Math.random() * next.length)];
      resolve(random);
    }, 800);
  });
};

export default SwipeCards;


// import React, { useState } from 'react';
// import { motion, useMotionValue, useTransform } from 'framer-motion';

// interface CardType {
//   id: number;
//   name: string;
//   url: string;
// }

// const initialCards: CardType[] = [
//   { id: 1, name: 'Arokaya', url: 'https://placehold.co/300x400' },
//   { id: 2, name: 'MediAssist', url: 'https://placehold.co/300x400?text=Assist' },
// ];

// const SwipeCards: React.FC = () => {
//   const [cards, setCards] = useState<CardType[]>(initialCards);

//   return (
//     <div className="grid h-screen w-full place-items-center bg-neutral-100">
//       <div className="relative w-72 h-96">
//         {cards.map((card, index) => (
//           <Card
//             key={card.id}
//             card={card}
//             isFront={index === cards.length - 1}
//             onSwipe={() => setCards((prev) => prev.filter((c) => c.id !== card.id))}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// interface CardProps {
//   card: CardType;
//   isFront: boolean;
//   onSwipe: () => void;
// }

// const Card: React.FC<CardProps> = ({ card, isFront, onSwipe }) => {
//   const x = useMotionValue(0);
//   const rotate = useTransform(x, [-150, 150], [-15, 15]);
//   const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

//   const handleDragEnd = () => {
//     if (Math.abs(x.get()) > 100) {
//       onSwipe();
//     }
//   };

//   return (
//     <motion.div
//       className="absolute h-96 w-72 rounded-xl bg-cover bg-center shadow-xl"
//       style={{
//         backgroundImage: `url(${card.url})`,
//         x,
//         rotate,
//         opacity,
//         cursor: isFront ? 'grab' : 'default',
//         zIndex: isFront ? 10 : 5,
//       }}
//       animate={{ scale: isFront ? 1 : 0.95, y: isFront ? 0 : 10 }}
//       drag={isFront ? 'x' : false}
//       dragConstraints={{ left: 0, right: 0 }}
//       onDragEnd={handleDragEnd}
//     >
//       <div className="absolute bottom-0 w-full bg-black/50 text-white text-center py-2 font-semibold">
//         {card.name}
//       </div>
//     </motion.div>
//   );
// };

// export default SwipeCards;




// import TinderCard from 'react-tinder-card'

// const db = [
//   { name: 'Arokaya', url: 'https://placehold.co/300x400' },
//   { name: 'MediAssist', url: 'https://placehold.co/300x400?text=Assist' }
// ]

// function SwipeCards() {
//   const swiped = (direction: string, name: string) => {
//     console.log(`Swiped ${direction} on ${name}`)
//   }

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
//       {db.map((item) => (
//         <TinderCard
//           key={item.name}
//           onSwipe={(dir) => swiped(dir, item.name)}
//           preventSwipe={['up', 'down']}
//         >
//           <div
//             style={{
//               backgroundImage: `url(${item.url})`,
//               width: '300px',
//               height: '400px',
//               borderRadius: '10px',
//               backgroundSize: 'cover',
//               display: 'flex',
//               alignItems: 'flex-end',
//               justifyContent: 'center',
//               padding: '20px',
//               color: '#fff',
//               fontWeight: 'bold'
//             }}
//           >
//             {item.name}
//           </div>
//         </TinderCard>
//       ))}
//     </div>
//   )
// }

// export default SwipeCards

// import React, { useState } from 'react';
// import { motion, useMotionValue, useTransform } from 'framer-motion';

// // Define the card data type
// interface CardType {
//   id: number;
//   url: string;
// }

// // Initial data
// const initialCards: CardType[] = [
//   { id: 1, url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3' },
//   { id: 2, url: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=2235&auto=format&fit=crop&ixlib=rb-4.0.3' },
//   { id: 3, url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.0.3' },
//   { id: 4, url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2224&auto=format&fit=crop&ixlib=rb-4.0.3' },
//   { id: 5, url: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3' },
//   { id: 6, url: 'https://images.unsplash.com/photo-1570464197285-9949814674a7?q=80&w=2273&auto=format&fit=crop&ixlib=rb-4.0.3' },
//   { id: 7, url: 'https://images.unsplash.com/photo-1578608712688-36b5be8823dc?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3' },
//   { id: 8, url: 'https://images.unsplash.com/photo-1505784045224-1247b2b29cf3?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3' },
// ];

// // Parent component
// const SwipeCards: React.FC = () => {
//   const [cards, setCards] = useState<CardType[]>(initialCards);

//   return (
//     <div
//       className="grid h-[500px] w-full place-items-center bg-neutral-100"
//       style={{
//         backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
//       }}
//     >
//       {cards.map((card) => (
//         <Card key={card.id} card={card} cards={cards} setCards={setCards} />
//       ))}
//     </div>
//   );
// };

// // Card component props
// interface CardProps {
//   card: CardType;
//   cards: CardType[];
//   setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
// }

// const Card: React.FC<CardProps> = ({ card, cards, setCards }) => {
//   const { id, url } = card;
//   const x = useMotionValue(0);
//   const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
//   const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
//   console.log(rotateRaw, opacity)

//   const isFront = id === cards[cards.length - 1].id;

//   const rotate = useTransform(rotateRaw, (value) => {
//     const offset = isFront ? 0 : id % 2 ? 6 : -6;
//     return `${value + offset}deg`;
//   });

//   const handleDragEnd = () => {
//     if (Math.abs(x.get()) > 100) {
//       setCards((prev) => prev.filter((v) => v.id !== id));
//     }
//   };

//   return (
//     <motion.img
//       src={url}
//       alt="Card image"
//       className="h-96 w-72 origin-bottom rounded-lg bg-white object-cover hover:cursor-grab active:cursor-grabbing"
//       style={{
//         gridRow: 1,
//         gridColumn: 1,
//         x,
//         opacity,
//         rotate,
//         transition: '0.125s transform',
//         boxShadow: isFront
//           ? '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)'
//           : undefined,
//       }}
//       animate={{ scale: isFront ? 1 : 0.98 }}
//       drag={isFront ? 'x' : false}
//       dragConstraints={{ left: 0, right: 0 }}
//       onDragEnd={handleDragEnd}
//     />
//   );
// };

// export default SwipeCards;




// import React, { useState } from "react";
// import {
//   VerticalTimeline,
//   VerticalTimelineElement,
// } from "react-vertical-timeline-component";
// import "react-vertical-timeline-component/style.min.css";

// type TimelineItem = {
//   id: number;
//   date: string;
//   doctorNotes: string;
//   prescription: string;
//   symptoms: string;
//   isEditing?: boolean;
// };

// const WorkIcon: React.FC = () => <></>;

// const Timeline: React.FC = () => {
//   const [items, setItems] = useState<TimelineItem[]>([]);
//   const [newItem, setNewItem] = useState<Omit<TimelineItem, "id">>({
//     date: "",
//     doctorNotes: "",
//     prescription: "",
//     symptoms: "",
//   });

//   const handleAddItem = () => {
//     if (!newItem.date) return;
//     setItems((prev) => [
//       ...prev,
//       { ...newItem, id: Date.now(), isEditing: false },
//     ]);
//     setNewItem({ date: "", doctorNotes: "", prescription: "", symptoms: "" });
//   };

//   const handleUpdateItem = (id: number, key: keyof TimelineItem, value: string) => {
//     setItems((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, [key]: value } : item
//       )
//     );
//   };

//   const toggleEdit = (id: number) => {
//     setItems((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, isEditing: !item.isEditing } : item
//       )
//     );
//   };

//   const generateSummary = () => {
//     const summary = items.map(({ id, isEditing, ...data }) => data);
//     console.log("Summary to send to Gen AI:", summary);
//     // You can now call your GenAI API with `summary`
//   };

//   return (
//     <div className="App">
//       <h1>Doctor Timeline</h1>

//       <div style={{ marginBottom: "2rem" }}>
//         <input
//           type="date"
//           value={newItem.date}
//           onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
//         />
//         <input
//           placeholder="Doctor Notes"
//           value={newItem.doctorNotes}
//           onChange={(e) =>
//             setNewItem({ ...newItem, doctorNotes: e.target.value })
//           }
//         />
//         <input
//           placeholder="Prescription"
//           value={newItem.prescription}
//           onChange={(e) =>
//             setNewItem({ ...newItem, prescription: e.target.value })
//           }
//         />
//         <input
//           placeholder="Symptoms"
//           value={newItem.symptoms}
//           onChange={(e) =>
//             setNewItem({ ...newItem, symptoms: e.target.value })
//           }
//         />
//         <button onClick={handleAddItem}>Add to Timeline</button>
//       </div>

//       <VerticalTimeline>
//         {items.map((item) => (
//           <VerticalTimelineElement
//             key={item.id}
//             date={item.date}
//             iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
//             icon={<WorkIcon />}
//           >
//             {item.isEditing ? (
//               <>
//                 <input
//                   value={item.date}
//                   onChange={(e) =>
//                     handleUpdateItem(item.id, "date", e.target.value)
//                   }
//                 />
//                 <input
//                   value={item.doctorNotes}
//                   onChange={(e) =>
//                     handleUpdateItem(item.id, "doctorNotes", e.target.value)
//                   }
//                 />
//                 <input
//                   value={item.prescription}
//                   onChange={(e) =>
//                     handleUpdateItem(item.id, "prescription", e.target.value)
//                   }
//                 />
//                 <input
//                   value={item.symptoms}
//                   onChange={(e) =>
//                     handleUpdateItem(item.id, "symptoms", e.target.value)
//                   }
//                 />
//                 <button onClick={() => toggleEdit(item.id)}>Save</button>
//               </>
//             ) : (
//               <>
//                 <h3>Doctor Notes: {item.doctorNotes}</h3>
//                 <p>Prescription: {item.prescription}</p>
//                 <p>Symptoms: {item.symptoms}</p>
//                 <button onClick={() => toggleEdit(item.id)}>Edit</button>
//               </>
//             )}
//           </VerticalTimelineElement>
//         ))}
//       </VerticalTimeline>

//       {items.length > 0 && (
//         <button onClick={generateSummary} style={{ marginTop: "2rem" }}>
//           Generate Summary
//         </button>
//       )}
//     </div>
//   );
// };

// export default Timeline;


// import React from "react";
// import {
//   VerticalTimeline,
//   VerticalTimelineElement,
// } from "react-vertical-timeline-component";
// import "react-vertical-timeline-component/style.min.css";

// // You can later replace this with a proper icon
// const WorkIcon: React.FC = () => <></>;

// const Timeline: React.FC = () => {
//   return (
//     <div className="App">
//       <h1>React Vertical Timeline</h1>
//       <VerticalTimeline>
//         <VerticalTimelineElement
//           contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
//           contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
//           date="2011 - present"
//           iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
//           icon={<WorkIcon />}
//         >
//           <h3 className="vertical-timeline-element-title">Creative Director</h3>
//           <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
//           <p>
//             Creative Direction, User Experience, Visual Design, Project
//             Management, Team Leading
//           </p>
//         </VerticalTimelineElement>

//         <VerticalTimelineElement
//           className="vertical-timeline-element--work"
//           date="2010 - 2011"
//           iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
//           icon={<WorkIcon />}
//         >
//           <h3 className="vertical-timeline-element-title">Art Director</h3>
//           <h4 className="vertical-timeline-element-subtitle">
//             San Francisco, CA
//           </h4>
//           <p>
//             Creative Direction, User Experience, Visual Design, SEO, Online
//             Marketing
//           </p>
//         </VerticalTimelineElement>

//         <VerticalTimelineElement
//           className="vertical-timeline-element--work"
//           date="2008 - 2010"
//           iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
//           icon={<WorkIcon />}
//         >
//           <h3 className="vertical-timeline-element-title">Web Designer</h3>
//           <h4 className="vertical-timeline-element-subtitle">
//             Los Angeles, CA
//           </h4>
//           <p>User Experience, Visual Design</p>
//         </VerticalTimelineElement>

//         <VerticalTimelineElement
//           className="vertical-timeline-element--work"
//           date="2006 - 2008"
//           iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
//           icon={<WorkIcon />}
//         >
//           <h3 className="vertical-timeline-element-title">Web Designer</h3>
//           <h4 className="vertical-timeline-element-subtitle">
//             San Francisco, CA
//           </h4>
//           <p>User Experience, Visual Design</p>
//         </VerticalTimelineElement>

//         <VerticalTimelineElement
//           className="vertical-timeline-element--education"
//           date="April 2013"
//           iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
//           icon={<WorkIcon />}
//         >
//           <h3 className="vertical-timeline-element-title">
//             Content Marketing for Web, Mobile and Social Media
//           </h3>
//           <h4 className="vertical-timeline-element-subtitle">Online Course</h4>
//           <p>Strategy, Social Media</p>
//         </VerticalTimelineElement>

//         <VerticalTimelineElement
//           className="vertical-timeline-element--education"
//           date="November 2012"
//           iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
//           icon={<WorkIcon />}
//         >
//           <h3 className="vertical-timeline-element-title">
//             Agile Development Scrum Master
//           </h3>
//           <h4 className="vertical-timeline-element-subtitle">Certification</h4>
//           <p>Creative Direction, User Experience, Visual Design</p>
//         </VerticalTimelineElement>

//         <VerticalTimelineElement
//           className="vertical-timeline-element--education"
//           date="2002 - 2006"
//           iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
//           icon={<WorkIcon />}
//         >
//           <h3 className="vertical-timeline-element-title">
//             Bachelor of Science in Interactive Digital Media Visual Imaging
//           </h3>
//           <h4 className="vertical-timeline-element-subtitle">
//             Bachelor Degree
//           </h4>
//           <p>Creative Direction, Visual Design</p>
//         </VerticalTimelineElement>

//         <VerticalTimelineElement
//           iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
//           icon={<WorkIcon />}
//         />
//       </VerticalTimeline>
//     </div>
//   );
// };

// export default Timeline;


