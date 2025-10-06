import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Register }from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import Interview from '@/pages/Interview'; // Assuming this is your topic selection page
import { Resume } from '@/pages/Resume';
import { Learning } from '@/pages/Learning';
import { Profile } from '@/pages/Profile';
import { ForgotPassword } from './pages/ForgotPassword';
import VoiceApp from "./pages/VoiceApp";
import StartInterview from "./pages/StartInterview";
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import PrivateRoute from './pages/PrivateRoute';
import GoogleAuth from './pages/GoogleAuth';
import AIInterviewSession from './pages/AIInterviewSession';
import CurrentUser from './pages/CurrentUser';
import VoiceRecorder from "./pages/VoiceRecorder";
import Logout from "./pages/Logout";
import { FrontendCourseView } from './pages/fullstack/Frontend'; 
import { CSSMasteryView } from './pages/fullstack/CSSMastery';
import { CoreJSView } from './pages/fullstack/CoreJSView';
import { PythonEssentialsView } from './pages/fullstack/PythonEssentialsView';
import { SqlEssentialsView } from './pages/fullstack/SqlEssentialsView';
import BrowserAPIsView from './pages/fullstack/BrowserAPIsView';
import ReactFundamentalsView from './pages/fullstack/ReactFundamentalsView';
import AdvancedReactView from './pages/fullstack/AdvancedReactView';

import InterviewRoom from './pages/InterviewRoom'; // Correct default import

function App() {
  const navigate = useNavigate();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="skillsage-theme">
    
       
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={ <PrivateRoute> <Dashboard /> </PrivateRoute> } />      
            <Route path="/voicew" element={<VoiceRecorder />} />
            <Route path="/me" element={<CurrentUser />} />
            <Route path="/google-auth" element={<GoogleAuth />} />
            <Route path="/ai" element={<AIInterviewSession />} />
            <Route path="/logout" element={<Logout />} /> 
            <Route path="/voice" element={<VoiceApp />} /> 
            <Route path="interview" element={<PrivateRoute><Interview /></PrivateRoute>} />
            <Route path="startinterview" element={<PrivateRoute><StartInterview /></PrivateRoute>} />
            {/* CORRECTED: Changed :roomId to :topic to match InterviewRoom's useParams */}
            <Route path="interview-room/:topic" element={<PrivateRoute><InterviewRoom /></PrivateRoute>} />
            {/* This route redirects if interview-room is accessed without a topic */}
            <Route path="interview-room" element={<Navigate to="/dashboard" />} />

            <Route path="resume" element={<PrivateRoute><Resume /></PrivateRoute>} />
            <Route path="learning" element={<PrivateRoute><Learning /></PrivateRoute>} />
            <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

             <Route path="/modules/f-101" element={<FrontendCourseView onBack={() => navigate('/learning')} planTitle="Frontend Development" />} />
          <Route path="/modules/f-102" element={<CSSMasteryView onBack={() => navigate('/modules/f-101')} planTitle="Frontend Development" />} />
          <Route path="/modules/f-103" element={<CoreJSView onBack={() => navigate('/modules/f-102')} planTitle="Frontend Development" />} />
          <Route path="/modules/b-101" element={<PythonEssentialsView onBack={() => navigate('/modules/f-103')} planTitle="Frontend Development" />} />
          <Route path="/modules/b-102" element={<SqlEssentialsView onBack={() => navigate('/modules/b-101')} planTitle="Frontend Development" />} />
          <Route path="/modules/b-103" element={<BrowserAPIsView onBack={() => navigate('/modules/b-102')} planTitle="Frontend Development" />} />
          <Route path="/modules/f-201" element={<ReactFundamentalsView onBack={() => navigate('/learning')} planTitle="Frontend Development" />} />
          <Route path="/modules/f-202" element={<AdvancedReactView onBack={() => navigate('/learning')} planTitle="Frontend Development" />} />
          </Route>
        </Routes>
     
    </ThemeProvider>
  );
}

export default () => (
  <Router>
    <App />
  </Router>
);
