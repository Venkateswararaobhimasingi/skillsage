// client/src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, GraduationCap, ArrowRight} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillSageGlobe } from '@/components/three/SkillSageGlobe';
import { useTheme } from 'next-themes';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const features = [
  {
    icon: MessageSquare,
    title: "Virtual Interview",
    description: "Practice with AI-powered mock interviews tailored to your field and experience level.",
  },
  {
    icon: FileText,
    title: "Resume Screener",
    description: "Get detailed AI analysis and improvement suggestions for your resume.",
  },
  {
    icon: GraduationCap,
    title: "Smart Learning Assistant",
    description: "Personalized learning paths with curated resources to boost your skills.",
  }
];

// Stats section was commented out in your original code, keeping it that way.
// const stats = [
//   { label: "Interview Sessions", value: "10K+" },
//   { label: "Resumes Analyzed", value: "25K+" },
//   { label: "Success Rate", value: "94%" },
//   { label: "Active Users", value: "5K+" }
// ];

export function Home() {
  const { theme, setTheme } = useTheme();

  // Helper to toggle theme using setTheme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden"> {/* Changed overflow-hidden to overflow-x-hidden to allow vertical scroll */}
      {/* Fixed 3D Background - Moved outside sections */}
      <div className="fixed inset-0 z-0"> {/* Added fixed and z-0 */}
        {/* Dynamic Background Gradient (behind the Spline iframe) */}
        <div className="absolute inset-0
          bg-gray-100 {/* Light mode background */}
          dark:bg-black {/* Dark mode background: solid black */}
        " />
        <SkillSageGlobe /> {/* Directly render the SplineGlobe component */}
      </div>

      {/* Hero Section - Content Overlay */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center overflow-hidden z-10" /* Added z-10 */
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants}>
            <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight">
              <span className="gradient-text">Skill</span>
              <span className="text-accent-blue-500">Sage</span> {/* Fixed color for contrast */}
              <span className="gradient-text">AI</span>
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Master your career journey with AI-powered interview practice, resume optimization,
            and personalized learning assistance.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link to="/register">
              <Button
                size="xl"
                className="group px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300
                           bg-gradient-to-r from-accent-blue-500 to-accent-green-500 text-white
                           hover:from-accent-blue-600 hover:to-accent-green-600"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="xl"
                variant="outline"
                className="
                  bg-white border-gray-300 text-gray-800 hover:bg-gray-50 {/* Added bg-white and changed hover */}
                  dark:border-dark-border dark:text-dark-text dark:hover:bg-dark-surface
                "
              >
                Already have an account?
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          {/* Uncomment if you want to use the stats section
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
          */}
        </div>
      </motion.section>

      {/* Features Section */}
     <motion.section
        className="py-24
          bg-black text-white {/* Changed to bg-black and text-white for light mode */}
          dark:bg-dark-surface dark:text-dark-text relative z-10" /* Adjusted dark mode background/text */
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-white/80 dark:text-muted-foreground max-w-3xl mx-auto"> {/* Adjusted text color for light mode on black background */}
              Our comprehensive platform combines cutting-edge AI with proven career development strategies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="relative group h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border
                  bg-white/10 border-gray-700 text-white {/* Adjusted card background for light mode on black */}
                  dark:bg-card dark:border-border dark:text-foreground
                  backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    {/* Dynamic gradient for feature icons */}
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r
                      ${index === 0 ? 'from-accent-blue-500 to-accent-blue-700' : ''}
                      ${index === 1 ? 'from-accent-green-500 to-accent-green-700' : ''}
                      ${index === 2 ? 'from-purple-500 to-pink-500' : ''}
                      mb-4 w-fit`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/70 dark:text-muted-foreground text-base leading-relaxed"> {/* Adjusted CardDescription text color */}
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                  {/* Hover effect with accent gradient */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent-blue-500/10 to-accent-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-24 relative overflow-hidden
          bg-accent-blue-500 text-white
          dark:bg-gradient-to-r dark:from-primary dark:to-accent relative z-10" /* Added relative z-10 */
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="absolute inset-0">
          {/* Dynamic SVG background pattern opacity based on theme */}
          <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]
            ${theme === 'dark' ? 'opacity-30' : 'opacity-10'}
          `} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to transform your career?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Join thousands of professionals who have accelerated their career growth with SkillSageAI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="xl" className="bg-white text-primary hover:bg-white/90">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/about">
                <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Theme Toggle Button (placed at the top right, fixed position) */}
      {/* <div className="fixed top-4 right-4 z-50">
        <Button onClick={toggleTheme} className="
          bg-gray-800 text-white shadow-lg
          dark:bg-gray-200 dark:text-gray-800
          rounded-full p-2"
        >
          {theme === 'dark' ? (
            <Sun className="h-6 w-6" />
          ) : (
            <Moon className="h-6 w-6" />
          )}
        </Button>
      </div> */}
    </div>
  );
}
