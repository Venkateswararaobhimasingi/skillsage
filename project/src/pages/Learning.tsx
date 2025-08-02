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
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Resource {
  id: number
  type: 'video' | 'article' | 'course' | 'practice'
  title: string
  description: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  completed: boolean
  thumbnail?: string
  rating: number
  category: string
  url?: string
}

interface LearningPlan {
  id: number
  title: string
  description: string
  progress: number
  totalItems: number
  completedItems: number
  estimatedTime: string
  category: string
}

export function Learning() {
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('all')
  
  const resources: Resource[] = [
    {
      id: 1,
      type: 'video',
      title: 'Advanced React Patterns',
      description: 'Learn render props, higher-order components, and compound components',
      duration: '45 min',
      difficulty: 'Advanced',
      completed: false,
      rating: 4.8,
      category: 'Frontend',
      thumbnail: 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      type: 'article',
      title: 'Node.js Best Practices 2024',
      description: 'Comprehensive guide to building scalable Node.js applications',
      duration: '15 min read',
      difficulty: 'Intermediate',
      completed: true,
      rating: 4.6,
      category: 'Backend'
    },
    {
      id: 3,
      type: 'course',
      title: 'System Design Fundamentals',
      description: 'Master the basics of distributed systems and scalability',
      duration: '3.5 hours',
      difficulty: 'Intermediate',
      completed: false,
      rating: 4.9,
      category: 'System Design'
    },
    {
      id: 4,
      type: 'practice',
      title: 'LeetCode Array Problems',
      description: '20 carefully selected array manipulation problems',
      duration: '2 hours',
      difficulty: 'Beginner',
      completed: false,
      rating: 4.4,
      category: 'Algorithms'
    },
    {
      id: 5,
      type: 'video',
      title: 'Docker for Developers',
      description: 'Containerization basics and best practices',
      duration: '1.2 hours',
      difficulty: 'Beginner',
      completed: false,
      rating: 4.7,
      category: 'DevOps'
    },
    {
      id: 6,
      type: 'article',
      title: 'TypeScript Advanced Types',
      description: 'Utility types, conditional types, and template literal types',
      duration: '20 min read',
      difficulty: 'Advanced',
      completed: true,
      rating: 4.8,
      category: 'Frontend'
    }
  ]

  const learningPlans: LearningPlan[] = [
    {
      id: 1,
      title: 'Full Stack Developer Path',
      description: 'Complete path from frontend to backend development',
      progress: 65,
      totalItems: 12,
      completedItems: 8,
      estimatedTime: '8 weeks',
      category: 'Full Stack'
    },
    {
      id: 2,
      title: 'System Design Mastery',
      description: 'Learn to design scalable and reliable systems',
      progress: 30,
      totalItems: 10,
      completedItems: 3,
      estimatedTime: '6 weeks',
      category: 'System Design'
    },
    {
      id: 3,
      title: 'Algorithm Interview Prep',
      description: 'Master data structures and algorithms for interviews',
      progress: 80,
      totalItems: 15,
      completedItems: 12,
      estimatedTime: '4 weeks',
      category: 'Algorithms'
    }
  ]

  const categories = ['all', 'Frontend', 'Backend', 'DevOps', 'System Design', 'Algorithms']
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced']

  const filteredResources = resources.filter(resource => {
    const categoryMatch = selectedCategory === 'all' || resource.category === selectedCategory
    const difficultyMatch = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video
      case 'article': return FileText
      case 'course': return BookOpen
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

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Smart Learning Assistant</h1>
            <p className="text-muted-foreground text-lg">
              Personalized learning recommendations based on your goals and progress
            </p>
          </div>
          
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

        {/* Learning Plans */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Learning Plans</h2>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              View Schedule
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{plan.title}</CardTitle>
                      <div className="text-2xl font-bold text-primary">{plan.progress}%</div>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={plan.progress} className="h-2" />
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{plan.completedItems} of {plan.totalItems} completed</span>
                      <span>{plan.estimatedTime} remaining</span>
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recommended Resources */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recommended Resources</h2>
            <div className="text-sm text-muted-foreground">
              Showing {filteredResources.length} resources
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => {
              const Icon = getTypeIcon(resource.type)
              
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                    {/* Thumbnail for videos */}
                    {resource.thumbnail && (
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img 
                          src={resource.thumbnail} 
                          alt={resource.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                        <div className="absolute top-2 left-2">
                          <div className="p-1.5 bg-black/50 rounded-md">
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        {resource.completed && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <CardHeader className={resource.thumbnail ? 'pb-2' : ''}>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                        {!resource.thumbnail && (
                          <div className="flex items-center space-x-2">
                            <Icon className="h-5 w-5 text-primary" />
                            {resource.completed && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{resource.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${getDifficultyColor(resource.difficulty)}`}>
                          {resource.difficulty}
                        </span>
                        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
                          {resource.category}
                        </span>
                      </div>
                      
                      <Button className="w-full" variant={resource.completed ? "outline" : "default"}>
                        {resource.completed ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Start Learning
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Today's Goals */}
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
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <Progress value={100} className="h-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Complete 5 Problems</span>
                  <span className="text-sm text-muted-foreground">3/5</span>
                </div>
                <Progress value={60} className="h-2" />
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