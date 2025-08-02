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
import RocketCursor from './components/ui/RocketCursor';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import InterviewRoom from './pages/InterviewRoom'; // Correct default import

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="skillsage-theme">
      <Router>
        <RocketCursor />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="interview" element={<Interview />} />
            {/* CORRECTED: Changed :roomId to :topic to match InterviewRoom's useParams */}
            <Route path="interview-room/:topic" element={<InterviewRoom />} />
            {/* This route redirects if interview-room is accessed without a topic */}
            <Route path="interview-room" element={<Navigate to="/dashboard" />} />

            <Route path="resume" element={<Resume />} />
            <Route path="learning" element={<Learning />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
