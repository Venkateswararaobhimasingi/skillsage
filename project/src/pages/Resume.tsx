import React from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Award,
  Zap,
  CornerUpLeft,
  MessageSquare,
  Activity,
  Wrench,
  Type,
  Loader2,
  XCircle,
  Users, // Icon for Role
  Briefcase, // Icon for Experience
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// --- Interfaces for Backend Integration ---

interface GeminiAnalysis {
  summary: string | null;
  strengths: string[] | null; 
  weaknesses: string[] | null;
  missing_skills: string[] | null;
  formatting_suggestions: string[] | null;
  interview_focus_areas: string[] | null;
  skill_gaps: string[] | null;
  ats_issues: string[] | null;
  template_recommendations: string[] | null;
  analysis_error?: string;
  raw_analysis_text_fallback?: string;
  score: number | null; 
}

interface AnalysisResponse {
  status: 'success' | 'analysis_failed' | 'error';
  job_details: {
    role: string;
    experience_level: string;
  };
  extracted_resume_data?: any; 
  gemini_analysis: GeminiAnalysis;
}

// Map the keys from the backend response to a display name and icon
const analysisKeyMap: { key: keyof GeminiAnalysis, title: string, icon: React.ElementType }[] = [
  { key: 'summary', title: 'Candidate Profile Summary', icon: MessageSquare },
  { key: 'strengths', title: 'Key Strengths', icon: CheckCircle },
  { key: 'weaknesses', title: 'Weaknesses / Negatives', icon: AlertCircle },
  { key: 'missing_skills', title: 'Missing Skills/Technologies', icon: Wrench },
  { key: 'formatting_suggestions', title: 'Formatting Suggestions', icon: Type },
  { key: 'interview_focus_areas', title: 'Interviewer Focus Areas', icon: Activity },
  { key: 'skill_gaps', title: 'Skill Gaps to Work On', icon: TrendingUp },
  { key: 'ats_issues', title: 'ATS Compliance Issues', icon: Zap },
  { key: 'template_recommendations', title: 'Template & Layout Recommendations', icon: CornerUpLeft },
]

// Common Job Roles for the dropdown
const commonRoles = [
  'Software Engineer',
  'Data Scientist',
  'Product Manager',
  'UX/UI Designer',
  'DevOps Engineer',
  'Other (Specify Below)',
];

// --- Utility Functions ---

/**
 * Determines the color class based on the overall score.
 * New logic: >= 66 (Good - Green), 46-65 (Average - Yellow), <= 45 (Poor - Red)
 */
const getScoreColor = (score: number) => {
  if (score >= 66) return 'text-green-400' // Good
  if (score >= 46) return 'text-yellow-400' // Average
  return 'text-red-400' // Poor
}

/**
 * Determines the performance label based on the overall score.
 * New logic: >= 66 (Good), 46-65 (Average), <= 45 (Poor)
 */
const getScoreLabel = (score: number) => {
  if (score >= 66) return 'Good'
  if (score >= 46) return 'Average'
  return 'Poor'
}

// --- Custom Loader Component ---

const InnovativeLoader = ({ role, progress }: { role: string, progress: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center p-8 space-y-6"
  >
    {/* Pulse Animation Container */}
    <div className="relative h-20 w-20">
      {/* Outer Pulse */}
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-blue-500"
      />
      {/* Inner Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 flex items-center justify-center rounded-full border-4 border-t-4 border-blue-500 border-opacity-20"
      >
        <Loader2 className="h-8 w-8 text-blue-400" />
      </motion.div>
    </div>

    {/* Text and Progress */}
    <div className="text-center space-y-2 w-full max-w-xs">
      <p className="text-xl font-medium text-white">
        Analyzing for **{role}**...
      </p>
      <p className="text-sm text-gray-400">
        AI is deeply reviewing content and relevance.
      </p>
      <Progress 
        value={progress} 
        className="w-full h-3 bg-gray-700 mt-4" 
        indicatorClassName="bg-blue-500" 
      />
      <p className="text-xs text-gray-500">{progress.toFixed(0)}% Complete</p>
    </div>
  </motion.div>
);

// --- Main Component ---

export function Resume() {
  const [file, setFile] = React.useState<File | null>(null)
  const [dragActive, setDragActive] = React.useState(false)
  
  // State for user input
  const [role, setRole] = React.useState('Software Engineer')
  const [customRole, setCustomRole] = React.useState('')
  const [experience, setExperience] = React.useState('entry')
  
  // State for analysis
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResponse | null>(null)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const [progress, setProgress] = React.useState(0)
  const progressIntervalRef = React.useRef<number | undefined>(undefined);

  // Determine the effective role for analysis
  const effectiveRole = role === 'Other (Specify Below)' ? customRole : role;

  // --- File Handling Logic ---

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

  const handleFile = (uploadedFile: File) => {
    setUploadError(null)
    setAnalysisResult(null)

    if (uploadedFile.type === 'application/pdf' || uploadedFile.type.includes('word')) {
      if (effectiveRole && experience) {
        setFile(uploadedFile)
        analyzeResume(uploadedFile, effectiveRole, experience) 
      } else {
        setUploadError("Please enter the Target Job Role and Experience Level before uploading.")
      }
    } else {
      setUploadError('Please upload a PDF or Word document (.pdf, .doc, .docx).')
      setFile(null)
    }
  }

  // --- Progress & API Logic (Simplified) ---

  const startProgressSimulation = () => {
    setProgress(0);
    const step = 5;
    let currentProgress = 0;
    
    if (progressIntervalRef.current !== undefined) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = window.setInterval(() => {
      currentProgress += step;
      if (currentProgress < 95) { // Increased cap for more time
        setProgress(currentProgress);
      } else {
        setProgress(95);
      }
    }, 400) as unknown as number; // Slightly faster interval
  }
  
  const stopProgressSimulation = () => {
    if (progressIntervalRef.current !== undefined) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = undefined;
    }
    setProgress(100);
  }

  const analyzeResume = async (
    uploadedFile: File, 
    jobRole: string, 
    expLevel: string
  ) => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    setUploadError(null)
    startProgressSimulation()

    const formData = new FormData()
    formData.append('resume', uploadedFile)
    formData.append('role', jobRole)
    formData.append('experience', expLevel)
    
    const API_URL = 'http://127.0.0.1:8000/resume_analysis/'
    const accessToken = localStorage.getItem("access_token");

    const headers: HeadersInit = {
        'Authorization': `Bearer ${accessToken}`, 
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            // Headers cannot include 'Content-Type': 'multipart/form-data' when using FormData, 
            // as the browser sets it automatically with the necessary boundary.
            headers: headers, 
            body: formData,
        })

        const data: AnalysisResponse = await response.json()
        stopProgressSimulation()

        if (response.ok) {
            setAnalysisResult(data)
        } else {
            const errorMessage = data.gemini_analysis.analysis_error 
                ? `AI Analysis failed: ${data.gemini_analysis.analysis_error}` 
                : data.extracted_resume_data?.error || "An unknown error occurred during analysis."
            setUploadError(errorMessage)
        }

    } catch (error) {
        console.error("API Call Error:", error)
        stopProgressSimulation()
        setUploadError("Could not connect to the analysis server. Check your network or API endpoint.")
    } finally {
        setIsAnalyzing(false)
    }
  }
  
  // --- UI Handlers ---

  const overallScore = analysisResult?.gemini_analysis.score ?? 0; 

  const handleReanalyze = () => {
    setAnalysisResult(null);
    setFile(null);
    setUploadError(null);
    setProgress(0);
    stopProgressSimulation();
    setCustomRole('');
    // Optionally reset role/experience to defaults
    setRole('Software Engineer');
    setExperience('entry');
  }

  // --- Component Render ---

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white"> 
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-10" // Increased space for better vertical separation
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-3 text-white tracking-tight">
            AI Resume Screener 
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get AI-powered analysis and improvement suggestions for your resume.
          </p>
        </div>

        {/* Input & Upload Section */}
        {!analysisResult && (
          <Card className="max-w-3xl mx-auto shadow-2xl bg-gray-800 border-gray-700 rounded-xl">
            <CardHeader className='border-b border-gray-700/50'>
              <CardTitle className="flex items-center text-xl text-white">
                <Zap className="mr-2 h-6 w-6 text-blue-400" />
                Analyze Your Resume
              </CardTitle>
              <CardDescription className="text-gray-400">
                Provide job context and upload your document for an in-depth report.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Context Input */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Role Select */}
                <div className="space-y-2 col-span-2">
                  <label htmlFor="job-role-select" className="text-sm font-medium text-gray-300 flex items-center">
                    <Users className="h-4 w-4 mr-1 text-blue-500" /> Target Job Role
                  </label>
                  <Select 
                    onValueChange={setRole} 
                    value={role}
                    disabled={isAnalyzing}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white hover:border-blue-500 transition">
                      <SelectValue placeholder="Select a common role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      {commonRoles.map(r => (
                        <SelectItem key={r} value={r} className='hover:bg-gray-700'>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Experience Select */}
                <div className="space-y-2">
                  <label htmlFor="experience-level" className="text-sm font-medium text-gray-300 flex items-center">
                    <Briefcase className="h-4 w-4 mr-1 text-blue-500" /> Experience
                  </label>
                  <Select 
                    onValueChange={setExperience} 
                    value={experience}
                    disabled={isAnalyzing}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white hover:border-blue-500 transition">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      <SelectItem value="entry">Entry (0-2 yr)</SelectItem>
                      <SelectItem value="mid">Mid (3-7 yr)</SelectItem>
                      <SelectItem value="senior">Senior (8+ yr)</SelectItem>
                     
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Conditional Custom Role Input */}
              {role === 'Other (Specify Below)' && (
                 <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                 >
                    <label htmlFor="custom-role" className="text-sm font-medium text-gray-300">
                        Specify Custom Role
                    </label>
                    <Input 
                        id="custom-role"
                        placeholder="e.g., Aerospace Robotics Engineer"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        disabled={isAnalyzing}
                        className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    />
                 </motion.div>
              )}
              
              {/* Upload Dropzone */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-gray-600 hover:border-blue-500/50 bg-gray-700/30'
                } ${isAnalyzing && 'pointer-events-none opacity-70'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {isAnalyzing ? (
                  // Custom Innovative Loader
                  <InnovativeLoader role={effectiveRole} progress={progress} />
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 rounded-full bg-blue-900/30 w-fit mx-auto">
                      <FileText className="h-8 w-8 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xl font-medium text-white">
                        {file ? file.name : 'Drag & Drop Your Resume'}
                      </p>
                      <p className="text-gray-400">
                        or click to browse file pdf
                      </p>
                    </div>
                    <input
                      type="file"
                      id="resume-upload"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleChange}
                      accept=".pdf"
                      disabled={isAnalyzing}
                    />
                    <Button variant="outline" className="pointer-events-none bg-gray-700 border-gray-600 hover:bg-gray-600 text-white">
                      {file ? 'Replace File' : 'Choose File'}
                    </Button>
                    <p className="text-xs text-gray-500">
                      File will be processed automatically upon selection.
                    </p>
                  </div>
                )}
              </div>
              
              {uploadError && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-lg flex items-center"
                >
                  <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p className="text-sm font-medium">{uploadError}</p>
                </motion.div>
              )}
              
            </CardContent>
          </Card>
        )}

        {/* Analysis Results Display */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-10"
          >
            {/* Overall Score / Summary Block (Cleaned UI) */}
            <Card className="shadow-2xl bg-gray-800 border-gray-700 rounded-xl">
              <CardHeader className='border-b border-gray-700/50'>
                {/* Removed Download button from header */}
                <CardTitle className="flex items-center justify-between text-2xl text-white">
                  <span className="flex items-center">
                    <Award className="mr-3 h-6 w-6 text-yellow-500" />
                    AI Resume Analysis Report
                  </span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Target Role: {analysisResult.job_details.role}  ({analysisResult.job_details.experience_level})
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className="grid md:grid-cols-4 gap-6 items-center">
                  {/* Score Display (Modified to only show label) */}
                  <div className="text-center p-4 bg-gray-700 rounded-lg shadow-md md:col-span-1">
                    <p className="text-lg font-semibold text-gray-300 mb-1">Resume Performance</p>
                    <div className={`text-5xl font-extrabold ${getScoreColor(overallScore)}`}>
                      {getScoreLabel(overallScore)}
                    </div>
                    {/* The numerical score is intentionally removed here */}
                    <p className="text-gray-400 text-sm mt-1">
                      Based on relevance & quality.
                    </p>
                  </div>
                  
                  <div className="md:col-span-3 space-y-3">
                    {/* Quality Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-white font-semibold">Quality Progress</span>
                        {/* We keep the label display here as it is the new requirement */}
                        <span className={`font-bold ${getScoreColor(overallScore)}`}>
                          {getScoreLabel(overallScore)} 
                        </span>
                      </div>
                      <Progress 
                        value={overallScore} 
                        className="h-3 bg-gray-700" 
                        indicatorClassName="bg-blue-500" 
                      />
                    </div>
                    
                    {/* Summary */}
                    <h3 className="text-lg font-semibold pt-2 text-white border-t border-gray-700/50">Candidate Summary</h3>
                    <p className="text-sm text-gray-300 italic p-3 rounded-lg bg-gray-700/50 border-l-4 border-yellow-500">
                      {analysisResult.gemini_analysis.summary || "AI summary not provided or unavailable."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Gemini Analysis Cards */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {analysisKeyMap.map(({ key, title, icon: Icon }, index) => {
                const content = analysisResult.gemini_analysis[key as keyof GeminiAnalysis]
                
                if (key === 'summary') return null; // Skip summary card

                if (content && (typeof content === 'string' && content.length > 0 || Array.isArray(content) && content.length > 0)) {
                  const isList = Array.isArray(content)
                  
                  let titleColor;
                  if (key === 'strengths') {
                      titleColor = 'text-green-400';
                  } else if (key === 'weaknesses' || key === 'missing_skills' || key === 'ats_issues' || key === 'skill_gaps') {
                      titleColor = 'text-red-400';
                  } else {
                      titleColor = 'text-blue-400';
                  }

                  return (
                    <Card key={key} className="shadow-lg bg-gray-800 border-gray-700 rounded-lg">
                      <CardHeader className="pb-3 border-b border-gray-700/50">
                        <CardTitle className={`flex items-center text-lg font-semibold ${titleColor}`}>
                          <Icon className="mr-2 h-5 w-5" />
                          {title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='pt-4'>
                        {isList ? (
                          <ul className="space-y-3"> {/* Increased space-y for better readability */}
                            {(content as string[]).map((item, idx) => {
                              // Determine list item icon based on category
                              const ItemIcon = key === 'strengths' ? CheckCircle : 
                                               (key === 'weaknesses' || key === 'missing_skills' || key === 'ats_issues' || key === 'skill_gaps') ? XCircle : MessageSquare;
                              const itemIconColor = key === 'strengths' ? 'text-green-500' : 'text-red-500';

                              return (
                                <li key={idx} className="flex items-start space-x-2">
                                  <motion.div
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.05 * idx }}
                                    className='flex-shrink-0 pt-0.5'
                                  >
                                    <ItemIcon className={`h-4 w-4 ${itemIconColor}`} />
                                  </motion.div>
                                  <span className="text-sm text-gray-300 leading-relaxed">{item}</span> {/* Added leading-relaxed */}
                                </li>
                              )
                            })}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-300">{content as string}</p>
                        )}
                      </CardContent>
                    </Card>
                  )
                }
                return null
              })}
            </div>

            {/* Actions (Simplified) */}
            <Card className="shadow-2xl bg-gray-800 border-gray-700 rounded-xl">
              <CardContent className="pt-6 pb-6">
                <div className="flex justify-center">
                  <Button size="lg" variant="outline" onClick={handleReanalyze} className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white transition-all">
                    <CornerUpLeft className="mr-2 h-5 w-5" />
                    Analyze Another Resume
                  </Button>
                  {/* Download Detailed Report and Preview Optimized Resume removed as requested */}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}