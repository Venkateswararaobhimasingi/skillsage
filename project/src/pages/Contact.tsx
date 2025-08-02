// client/src/pages/Contact.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setIsError(false);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitMessage('Please fill in all fields.');
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSubmitMessage('Please enter a valid email address.');
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitMessage('Your message has been sent successfully!');
      setIsError(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitMessage('Something went wrong. Please try again.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground overflow-hidden flex flex-col">
      {/* Background and overlay - rendered first so it stays behind via layout order */}
      <div className="w-full h-full fixed top-0 left-0">
        <ParticlesBackground />
        <div className="w-full h-full bg-transparent pointer-events-none" />

      </div>

      {/* Main content */}
      <main className="relative flex-grow flex flex-col items-center justify-center px-4 py-20">
        <motion.div
          className="w-full max-w-6xl space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions, feedback, or just want to say hello? We'd love to hear from you.
            </p>
          </motion.div>

          {/* Contact form and info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Form */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-xl border border-border/40 bg-background/70 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you shortly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Jane Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Regarding..."
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Type your message here..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {submitMessage && (
                      <p
                        className={`text-sm ${
                          isError ? 'text-red-500' : 'text-green-500'
                        }`}
                      >
                        {submitMessage}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:opacity-90 transition-all"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Info */}
            <motion.div variants={itemVariants}>
              <Card className="h-full shadow-xl border border-border/40 bg-background/70 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Contact Information</CardTitle>
                  <CardDescription>
                    We’re available via the following methods:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-base">
                  <div className="flex items-center gap-3">
                    <Mail className="text-primary" />
                    <span>support@skillsageai.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-primary" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary mt-1" />
                    <span>
                      SkillSageAI Headquarters<br />
                      123 AI Boulevard, Suite 400<br />
                      Innovation City, TX 78701
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
