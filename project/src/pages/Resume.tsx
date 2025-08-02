import React from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ResumeAnalysis {
  overallScore: number
  sections: {
    name: string
    score: number
    feedback: string
    suggestions: string[]
  }[]
  strengths: string[]
  improvements: string[]
  keywords: {
    found: string[]
    missing: string[]
  }
}

export function Resume() {
  const [file, setFile] = React.useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [analysis, setAnalysis] = React.useState<ResumeAnalysis | null>(null)
  const [dragActive, setDragActive] = React.useState(false)

  // Mock analysis data
  const mockAnalysis: ResumeAnalysis = {
    overallScore: 82,
    sections: [
      {
        name: "Contact Information",
        score: 95,
        feedback: "Complete and professional contact details",
        suggestions: ["Consider adding LinkedIn profile", "Add portfolio website"]
      },
      {
        name: "Professional Summary",
        score: 78,
        feedback: "Good overview but could be more specific",
        suggestions: ["Add quantifiable achievements", "Include specific technologies", "Mention years of experience"]
      },
      {
        name: "Work Experience",
        score: 85,
        feedback: "Strong experience section with good detail",
        suggestions: ["Use more action verbs", "Quantify more achievements", "Add recent projects"]
      },
      {
        name: "Education",
        score: 90,
        feedback: "Well-formatted education section",
        suggestions: ["Add relevant coursework", "Include GPA if strong"]
      },
      {
        name: "Skills",
        score: 75,
        feedback: "Good technical skills but missing soft skills",
        suggestions: ["Organize by proficiency level", "Add soft skills", "Include years of experience per skill"]
      }
    ],
    strengths: [
      "Strong technical background",
      "Consistent work history",
      "Good formatting and layout",
      "Relevant project experience",
      "Professional presentation"
    ],
    improvements: [
      "Add more quantifiable achievements",
      "Include keywords for ATS optimization",
      "Strengthen the professional summary",
      "Add soft skills section",
      "Update with recent certifications"
    ],
    keywords: {
      found: ["React", "JavaScript", "Node.js", "Git", "Agile"],
      missing: ["TypeScript", "AWS", "Docker", "Testing", "CI/CD"]
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type === 'application/pdf' || file.type.includes('word')) {
      setFile(file)
      analyzeResume(file)
    } else {
      alert('Please upload a PDF or Word document')
    }
  }

  const analyzeResume = async (file: File) => {
    setIsAnalyzing(true)
    // Simulate API call
    setTimeout(() => {
      setAnalysis(mockAnalysis)
      setIsAnalyzing(false)
    }, 3000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent'
    if (score >= 70) return 'Good'
    return 'Needs Improvement'
  }

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Resume Screener</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get AI-powered analysis and improvement suggestions for your resume. 
            Upload your resume to receive detailed feedback and optimization tips.
          </p>
        </div>

        {/* Upload Section */}
        {!analysis && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload Your Resume
              </CardTitle>
              <CardDescription>
                Upload a PDF or Word document to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                  dragActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {isAnalyzing ? (
                  <div className="space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                    <div>
                      <p className="text-lg font-medium">Analyzing your resume...</p>
                      <p className="text-muted-foreground">This may take a few moments</p>
                    </div>
                    <Progress value={33} className="w-full max-w-xs mx-auto" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        {file ? file.name : 'Drag and drop your resume here'}
                      </p>
                      <p className="text-muted-foreground">
                        or click to browse files
                      </p>
                    </div>
                    <input
                      type="file"
                      id="resume-upload"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleChange}
                      accept=".pdf,.doc,.docx"
                    />
                    <Button variant="outline" className="pointer-events-none">
                      Choose File
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: PDF, DOC, DOCX (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Overall Resume Score
                  </span>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}
                    </div>
                    <p className="text-muted-foreground">out of 100</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <span>Resume Quality</span>
                      <span className={`font-medium ${getScoreColor(analysis.overallScore)}`}>
                        {getScoreLabel(analysis.overallScore)}
                      </span>
                    </div>
                    <Progress value={analysis.overallScore} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      Your resume is performing well with room for improvement in key areas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Analysis */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Section Analysis</CardTitle>
                  <CardDescription>Detailed breakdown by resume section</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.sections.map((section, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{section.name}</h4>
                        <span className={`text-sm font-bold ${getScoreColor(section.score)}`}>
                          {section.score}%
                        </span>
                      </div>
                      <Progress value={section.score} className="h-2" />
                      <p className="text-sm text-muted-foreground">{section.feedback}</p>
                      {section.suggestions.length > 0 && (
                        <ul className="text-xs space-y-1">
                          {section.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <AlertCircle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-6">
                {/* Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Improvements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-yellow-600">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Keywords Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>ATS Keyword Analysis</CardTitle>
                <CardDescription>
                  Keywords help your resume pass Applicant Tracking Systems (ATS)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-600 mb-3 flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Found Keywords ({analysis.keywords.found.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.found.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-600 mb-3 flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Suggested Keywords ({analysis.keywords.missing.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.missing.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="gradient">
                    <Download className="mr-2 h-4 w-4" />
                    Download Detailed Report
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => {
                    setAnalysis(null)
                    setFile(null)
                  }}>
                    <Upload className="mr-2 h-4 w-4" />
                    Analyze Another Resume
                  </Button>
                  <Button size="lg" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Optimized Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}