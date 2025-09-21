import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import PrivateRoute from './pages/PrivateRoute';
import GoogleAuth from './pages/GoogleAuth';
import CurrentUser from './pages/CurrentUser';
import Logout from "./pages/Logout";

import InterviewRoom from './pages/InterviewRoom'; // Correct default import

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="skillsage-theme">
      <Router>
       
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={ <PrivateRoute> <Dashboard /> </PrivateRoute> } />      
            
            <Route path="/me" element={<CurrentUser />} />
            <Route path="/google-auth" element={<GoogleAuth />} />
            
            <Route path="/logout" element={<Logout />} /> 
            <Route path="/voice" element={<VoiceApp />} /> 
            <Route path="interview" element={<PrivateRoute><Interview /></PrivateRoute>} />
            {/* CORRECTED: Changed :roomId to :topic to match InterviewRoom's useParams */}
            <Route path="interview-room/:topic" element={<PrivateRoute><InterviewRoom /></PrivateRoute>} />
            {/* This route redirects if interview-room is accessed without a topic */}
            <Route path="interview-room" element={<Navigate to="/dashboard" />} />

            <Route path="resume" element={<PrivateRoute><Resume /></PrivateRoute>} />
            <Route path="learning" element={<PrivateRoute><Learning /></PrivateRoute>} />
            <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
