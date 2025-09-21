import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InterviewSession from './InterviewSession.tsx';
import { useNavigate, useLocation } from 'react-router-dom';

const interviewTopics = [
  { value: 'frontend', label: 'Frontend Development', description: 'HTML, CSS, JavaScript, React, etc.', imageUrl: 'https://placehold.co/600x400/1a1a1a/FFFFFF/png?text=Frontend' },
  { value: 'backend', label: 'Backend Development', description: 'Node.js, Python, Java, Databases, etc.', imageUrl: 'https://placehold.co/600x400/1a1a1a/FFFFFF/png?text=Backend' },
  { value: 'fullstack', label: 'Full Stack Development', description: 'Combines frontend and backend skills.', imageUrl: 'https://placehold.co/600x400/1a1a1a/FFFFFF/png?text=Fullstack' },
  { value: 'data-science', label: 'Data Science', description: 'Machine Learning, Statistics, Data Analysis.', imageUrl: 'https://placehold.co/600x400/1a1a1a/FFFFFF/png?text=Data+Science' },
  { value: 'devops', label: 'DevOps Engineering', description: 'CI/CD, Cloud, Automation, Infrastructure.', imageUrl: 'https://placehold.co/600x400/1a1a1a/FFFFFF/png?text=DevOps' },
  { value: 'mobile', label: 'Mobile Development', description: 'iOS, Android, React Native, Flutter.', imageUrl: 'https://placehold.co/600x400/1a1a1a/FFFFFF/png?text=Mobile' },
  { value: 'product-management', label: 'Product Management', description: 'Strategy, Roadmapping, User Stories.', imageUrl: 'https://placehold.co/600x400/1a1a1a/FFFFFF/png?text=Product+Mgmt' },
  { value: 'design', label: 'UX/UI Design', description: 'User Research, Wireframing, Prototyping.', imageUrl: 'https://placehold.co/600x400/1a1a1a/FFFFFF/png?text=UX/UI+Design' },
  { value: 'hr', label: 'HR Interview', description: 'Behavioral questions, soft skills, culture fit.', imageUrl: 'https://placehold.co/600x400/1a1a1a/FFFFFF/png?text=HR+Interview' },
  { value: 'system-design', label: 'System Design', description: 'Scalability, Architecture, Distributed Systems.', imageUrl: 'https://placehold.co/600x400/1a1a1a/FFFFFF/png?text=System+Design' },
];

export default function Interview() {
  const navigate = useNavigate();
  const location = useLocation();

  const [view, setView] = useState<'selection' | 'difficulty' | 'interview'>(() => {
    const params = new URLSearchParams(location.search);
    return params.get('session') === 'true' ? 'interview' : 'selection';
  });

  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (view === 'interview') {
      params.set('session', 'true');
    } else {
      params.delete('session');
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [view, navigate, location.pathname, location.search]);

  const handleSelectInterview = (topicValue: string) => {
    setSelectedTopic(topicValue);
    setView('difficulty'); // Show difficulty selection first
  };

  const handleSelectDifficulty = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setView('interview'); // Navigate to interview session
  };

  const handleGoBackToSelection = () => {
    setSelectedTopic('');
    setSelectedDifficulty('');
    setView('selection');
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter antialiased">
      {view === 'selection' && (
        <motion.div
          className="container mx-auto px-4 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-center mb-4 text-white">Choose Your Interview</h1>
          <p className="text-xl text-center text-gray-300 mb-10">
            Select a topic to start your AI-powered mock interview session.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {interviewTopics.map((topic) => (
              <motion.div
                key={topic.value}
                whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3),0 4px 6px -2px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => handleSelectInterview(topic.value)}
              >
                <Card className="h-full flex flex-col justify-between rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out bg-gray-800 border border-gray-700 text-white overflow-hidden">
                  <img
                    src={topic.imageUrl}
                    alt={topic.label}
                    className="w-full h-40 object-cover rounded-t-xl"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/333333/FFFFFF?text=Image+Error'; }}
                  />
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-semibold text-white">{topic.label} Interview</CardTitle>
                    <CardDescription className="text-gray-400 mt-1">{topic.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      className="w-full mt-4 rounded-lg text-white font-semibold py-2 px-4 transition-all duration-300 ease-in-out"
                      variant="gradient"
                    >
                      Start Practice
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {view === 'difficulty' && (
        <motion.div
          className="flex flex-col items-center justify-center min-h-screen px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Choose Difficulty Level</h2>
          <div className="flex space-x-4">
            {['Easy', 'Medium', 'Hard'].map((level) => (
              <Button
                key={level}
                className="px-6 py-3 text-lg font-semibold"
                variant="outline"
                onClick={() => handleSelectDifficulty(level.toLowerCase())}
              >
                {level}
              </Button>
            ))}
          </div>
          <Button className="mt-6" variant="ghost" onClick={handleGoBackToSelection}>
            Back
          </Button>
        </motion.div>
      )}

      {view === 'interview' && (
        <InterviewSession
          selectedTopic={selectedTopic}
          selectedDifficulty={selectedDifficulty}
          onGoBack={handleGoBackToSelection}
        />
      )}
    </div>
  );
}
