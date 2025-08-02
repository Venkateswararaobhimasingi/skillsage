// client/src/pages/About.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Users, ArrowRight, Sun, Moon } from 'lucide-react'; // Added Sun, Moon for ThemeToggle
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { ParticlesBackground } from '@/components/three/ParticlesBackground'; // Assuming StarsCanvas is the correct component name
import { Link } from 'react-router-dom';

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

const coreValues = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Leveraging cutting-edge AI to redefine career development.',
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    description: 'Empowering individuals to achieve their full professional potential.',
  },
  {
    icon: Users,
    title: 'Accessibility',
    description: 'Making advanced tools available to every aspiring professional.',
  },
];

export function About() {
 // Use theme hook


  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticlesBackground /> {/* Assuming StarsCanvas is the correct component name */}
      </div>


      {/* Main Content */}
      <div className="relative z-10 flex justify-center px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          className="w-full max-w-5xl text-center mx-auto" // CORRECTED: Replaced ml-0 md:ml-4 lg:ml-1 with mx-auto
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Heading */}
          <motion.section variants={itemVariants} className="mb-16 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
              About <span className="gradient-text">SkillSageAI</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Revolutionizing career development with intelligent AI solutions.
            </p>
          </motion.section>

          {/* Mission */}
          <motion.section variants={itemVariants} className="mb-20">
            <Card className="mx-auto max-w-3xl bg-card/90 backdrop-blur-md shadow-xl border border-border/50 p-6 sm:p-8">
              <CardHeader className="text-center mb-6">
                <CardTitle className="text-2xl sm:text-3xl font-bold">
                  Our Mission
                </CardTitle>
                <CardDescription className="text-base sm:text-lg text-muted-foreground">
                  Empowering every student and professional to achieve their career aspirations.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center text-base sm:text-lg text-foreground leading-relaxed">
                At SkillSageAI, we believe that everyone deserves the opportunity to excel.
                We use AI to provide personalized, actionable insights for interviews, resumes,
                and continuous learning. We aim to be your trusted career companion.
              </CardContent>
            </Card>
          </motion.section>

          {/* Core Values */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-center mb-12"
            >
              Our <span className="gradient-text">Core Values</span>
            </motion.h2>

            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {coreValues.map((value, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full text-center bg-card/90 backdrop-blur-sm border border-border/50 shadow-md p-6">
                    <CardHeader className="mb-4">
                      <div className="flex justify-center mb-4">
                        {/* Corrected gradient classes to use accent-blue/green from tailwind.config.js */}
                        <div className="p-4 rounded-full bg-gradient-to-r from-accent-blue-500 to-accent-green-500">
                          <value.icon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-semibold">
                        {value.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section variants={itemVariants} className="text-center">
            <h2 className="mb-6 text-2xl sm:text-3xl font-bold">
              Ready to start your journey?
            </h2>
            <Link to="/register">
              <Button
                size="lg"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full shadow-lg
                         bg-gradient-to-r from-accent-blue-500 to-accent-green-500 text-white {/* Corrected gradient colors */}
                         hover:from-accent-blue-600 hover:to-accent-green-600 transition-all duration-300"
              >
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
