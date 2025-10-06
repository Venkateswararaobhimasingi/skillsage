// Learning.tsx

import React from 'react'
import { motion } from 'framer-motion'
import { 
    BookOpen, 
    Video, 
    FileText, 
    CheckCircle, 
    Clock, 
    Star,
    Play,
    ExternalLink,
    Calendar,
    Target,
    Trophy,
    Filter,
    ArrowLeft, 
    Share2, 
    Edit, 
    MoreVertical 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { FrontendCourseView } from './fullstack/Frontend'; 
import {SystemDesignIntroView} from './systemDesign/SystemDesignIntroView';
import {DSAIntroView} from './systemDesign/DSAIntroView';
import {DockerIntroView} from './doc/DockerIntroView';

// --- Interfaces ---

interface Resource {
    id: number
    type: 'video' | 'article' | 'practice'
    title: string
    description: string
    duration: string // e.g., '15 min read', '1.2 hours'
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    completed: boolean
    thumbnail?: string
    rating: number
    category: string
    url?: string
}

interface LearningPlan {
    id: number
    type: 'path'
    title: string
    description: string
    progress: number
    totalItems: number
    completedItems: number
    estimatedTime: string // e.g., '8 weeks', '6 weeks'
    category: string
    // Added for type unification
    duration: string 
    difficulty: 'All' | 'Beginner' | 'Intermediate' | 'Advanced'
    completed: boolean
    rating: number // Using a placeholder for consistency
}

// Combine types for the single list
type LearningItem = Resource | LearningPlan

// --- Utility Functions ---

const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video
      case 'article': return FileText
      case 'path': return BookOpen // Represents the whole course/path
      case 'practice': return Target
      default: return BookOpen
    }
}

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-500'
      case 'Intermediate': return 'text-yellow-500'
      case 'Advanced': return 'text-red-500'
      default: return 'text-gray-500'
    }
}

// --- Main Learning Component ---

export function Learning() {
  // UPDATED STATE: Manages which view the user is seeing (Added 'docker')
  const [currentView, setCurrentView] = React.useState<'dashboard' | 'frontendCourse' | 'systemDesignCourse'|'dsaAlgorithm'|'docker'>('dashboard');

  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('all')

  // NEW STATE: Tracks which plans the user has clicked on (started).
  const [startedPlans, setStartedPlans] = React.useState<number[]>([]);
  
  // --- Static Data (Progress Reset to 0/False) ---
  const resources: Resource[] = [

    // { id: 101, type: 'article', title: 'Node.js Best Practices 2024', description: 'Comprehensive guide to building scalable Node.js applications', duration: '15 min read', difficulty: 'Intermediate', completed: false, rating: 4.6, category: 'Backend' },

    // { id: 102, type: 'practice', title: 'LeetCode Array Problems', description: '20 carefully selected array manipulation problems', duration: '2 hours', difficulty: 'Beginner', completed: false, rating: 4.4, category: 'Algorithms' },
    // Removed the individual Docker video (id: 103) as a path is being added instead,
    // but leaving it for now to avoid breaking the resources list.
    // { id: 103, type: 'video', title: 'Containerization Basics with Podman', description: 'Containerization basics and best practices using Podman', duration: '1.2 hours', difficulty: 'Beginner', completed: false, rating: 4.7, category: 'DevOps' },
    // { id: 104, type: 'article', title: 'TypeScript Advanced Types', description: 'Utility types, conditional types, and template literal types', duration: '20 min read', difficulty: 'Advanced', completed: false, rating: 4.8, category: 'Frontend' }
  ]

  const learningPlans: LearningPlan[] = [
    { 
        id: 1, type: 'path', title: 'Full Stack Developer Path', description: 'Complete path from frontend to backend development', progress: 0, totalItems: 12, completedItems: 0, estimatedTime: '8 weeks', category: 'Full Stack', 
        duration: '8 weeks', difficulty: 'Beginner', completed: false, rating: 4.8 
    },
    { 
        id: 2, type: 'path', title: 'System Design Mastery', description: 'Learn to design scalable and reliable systems', progress: 0, totalItems: 10, completedItems: 0, estimatedTime: '6 weeks', category: 'System Design', 
        duration: '6 weeks', difficulty: 'Intermediate', completed: false, rating: 4.7
    },
    { 
        id: 3, type: 'path', title: 'Algorithm Interview Prep', description: 'Master data structures and algorithms for interviews', progress: 0, totalItems: 15, completedItems: 0, estimatedTime: '4 weeks', category: 'Algorithms', 
        duration: '4 weeks', difficulty: 'Intermediate', completed: false, rating: 4.9
    },
    // NEW: Docker Learning Path
    { 
        id: 4, type: 'path', title: 'Docker and Kubernetes Deep Dive', description: 'From Dockerfile to production-ready Kubernetes deployments.', progress: 0, totalItems: 8, completedItems: 0, estimatedTime: '5 weeks', category: 'DevOps', 
        duration: '5 weeks', difficulty: 'Intermediate', completed: false, rating: 4.7
    },
  ]
  // --- End Static Data ---

  // Combine plans and resources into one list
  const allLearningItems: LearningItem[] = [...learningPlans, ...resources];

  const categories = ['all', 'Full Stack', 'Frontend', 'Backend', 'DevOps', 'System Design', 'Algorithms']
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced']

  // Combined Filter Logic
  const filteredItems = allLearningItems.filter(item => {
    // Category filter applies to all items
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    
    // Difficulty filter only applies to items that have a difficulty property that is not 'All'
    // This effectively filters resources and paths whose difficulty is explicitly set.
    const difficultyMatch = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty || item.difficulty === 'All';

    return categoryMatch && difficultyMatch;
  });
  
  // --- Navigation Handlers ---
  const handleViewCourse = (planId: number) => {
    // CRITICAL CHANGE: Mark the plan as started when the button is clicked
    if (!startedPlans.includes(planId)) {
        setStartedPlans(prev => [...prev, planId]);
    }

    if (planId === 1) { // Link the Full Stack Developer Path
      setCurrentView('frontendCourse');
    } else if (planId === 2) { // Link the System Design Mastery Path
      setCurrentView('systemDesignCourse');
    }
    else if(planId===3){ // Link the DSA Algorithm Prep Path
        setCurrentView('dsaAlgorithm');
    }
    else if(planId===4){ // NEW: Link the Docker Path
        setCurrentView('docker');
    }
  } // <-- FIXED: Added missing closing brace

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  }

  // --- Conditional Rendering: Find current plans for view passing ---
  const fullStackPlan = learningPlans.find(p => p.id === 1);
  const systemDesignPlan = learningPlans.find(p => p.id === 2);
  const dsaAlgoPlan = learningPlans.find(p => p.id === 3);
  const dockerPlan = learningPlans.find(p => p.id === 4); // Find the new Docker plan

  if (currentView === 'frontendCourse' && fullStackPlan) {
    // RENDER Full Stack Course (FrontendCourseView)
    return <FrontendCourseView onBack={handleBackToDashboard} planTitle={fullStackPlan.title} />;
  }

  if (currentView === 'systemDesignCourse' && systemDesignPlan) {
    // RENDER System Design Course (SystemDesignIntroView)
    return <SystemDesignIntroView onBack={handleBackToDashboard} planTitle={systemDesignPlan.title} />;
  }

    if (currentView === 'dsaAlgorithm' && dsaAlgoPlan) {
    // RENDER DSA Course (DSAIntroView)
    return <DSAIntroView onBack={handleBackToDashboard} planTitle={dsaAlgoPlan.title} />;
  }

  if(currentView==='docker' && dockerPlan){
    // NEW RENDER BLOCK: RENDER Docker Course (DockerIntroView)
    return <DockerIntroView onBack={handleBackToDashboard} planTitle={dockerPlan.title} />;
  }


  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header and Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Smart Learning Assistant</h1>
            <p className="text-muted-foreground text-lg">
              Personalized learning paths and recommended resources
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Combined Learning Paths & Resources Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Learning Paths & Resources</h2>
            <div className="text-sm text-muted-foreground">
              Showing {filteredItems.length} items
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const isPath = item.type === 'path';
              const Icon = getTypeIcon(item.type);
              
              const isStarted = isPath ? startedPlans.includes(item.id) : false;
              const pathButtonText = isStarted ? 'Continue Learning' : 'Start Learning Path';
              const resourceButtonText = 'Start Learning';
              const buttonVariant = isPath && isStarted ? 'default' : (isPath ? 'outline' : 'default');

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                    
                    {/* Thumbnail for video resources only */}
                    {item.type === 'video' && (item as Resource).thumbnail && (
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img 
                          src={(item as Resource).thumbnail} 
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                         <div className="absolute top-2 left-2">
                            <div className="p-1.5 bg-black/50 rounded-md">
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          {item.completed && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                          )}
                      </div>
                    )}
                    
                    <CardHeader className={item.type === 'video' && (item as Resource).thumbnail ? 'pb-2' : ''}>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                        
                        {/* Icon and Completed check for non-thumbnail items */}
                        {!(item.type === 'video' && (item as Resource).thumbnail) && (
                          <div className="flex items-center space-x-2">
                            <Icon className={`h-5 w-5 ${isPath ? 'text-blue-500' : 'text-primary'}`} />
                            {item.completed && ( 
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        {isPath && (
                            <>
                                {/* Path-specific progress UI */}
                                <div className="flex justify-between items-start">
                                    <div className="text-2xl font-bold text-primary">{item.progress}%</div> 
                                    <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{item.category}</span>
                                </div>
                                <Progress value={item.progress} className="h-2" /> 
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{item.completedItems} of {item.totalItems} completed</span> 
                                    <span><Clock className="inline h-4 w-4 mr-1 mb-0.5" />{item.estimatedTime}</span>
                                </div>
                            </>
                        )}

                        {!isPath && (
                            <>
                                {/* Resource-specific metadata UI */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>{(item as Resource).duration}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        <span>{(item as Resource).rating}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm font-medium ${getDifficultyColor(item.difficulty)}`}>
                                        {item.difficulty}
                                    </span>
                                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                        {item.category}
                                    </span>
                                </div>
                            </>
                        )}
                      
                      {/* Unified Action Button */}
                      <Button 
                        className="w-full" 
                        variant={buttonVariant} 
                        onClick={() => isPath ? handleViewCourse(item.id) : (item as Resource).url && window.open((item as Resource).url, '_blank')}
                      >
                        <>
                          {isPath ? <BookOpen className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                          {isPath ? pathButtonText : resourceButtonText}
                        </>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Today's Goals (Progress Reset to 0) */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Today's Goals</h2>
              <p className="text-muted-foreground">Stay consistent with your learning journey</p>
            </div>
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Watch 1 Video</span>
                  {/* Goal set to 0/1 */}
                  <span className="text-sm text-muted-foreground">0/1</span> 
                </div>
                {/* Progress set to 0 */}
                <Progress value={0} className="h-2" /> 
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Complete 5 Problems</span>
                  {/* Goal set to 0/5 */}
                  <span className="text-sm text-muted-foreground">0/5</span> 
                </div>
                {/* Progress set to 0 */}
                <Progress value={0} className="h-2" /> 
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Read 1 Article</span>
                  <span className="text-sm text-muted-foreground">0/1</span>
                </div>
                <Progress value={0} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </section>
      </motion.div>
    </div>
  )
}