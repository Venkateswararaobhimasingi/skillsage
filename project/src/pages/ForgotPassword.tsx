import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { ParticlesBackground } from '@/components/three/ParticlesBackground';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setMessage('');
  setError('');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('Please enter a valid email address.');
    setIsSubmitting(false);
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/password-reset/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('If an account with that email exists, a reset link has been sent.');
      setEmail('');
    } else {
      setError(data?.detail || 'Failed to send reset link.');
    }
  } catch (apiError) {
    setError('An unexpected error occurred. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />

      <div className="relative z-10 flex items-center justify-center h-full px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-black/60 border border-border/50 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
              <CardDescription>
                Enter your email address below and we’ll send you a reset link.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className={`pl-10 ${error ? 'border-destructive' : ''}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                  {message && <p className="text-green-500 text-sm mt-1">{message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  variant="gradient"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
