// src/pages/Register.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Robot } from '@/components/three/Robot';
import "@/components/three/SplineStyles.css";
export const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loginForm, setLoginForm] = React.useState({ email: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = React.useState(false);
  const [isLogin, setIsLogin] = React.useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', formData);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', loginForm);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left - Spline */}
      <div className="w-full md:w-1/2 h-[300px] md:h-auto relative">
        <Robot />
        <div className="md:hidden text-center mt-4 text-sm text-muted-foreground">
          Scroll down to {isLogin ? 'log in' : 'sign up'} ↓
        </div>
      </div>

      {/* Right - Forms */}
      <div className="w-full md:w-1/2 flex items-start justify-center md:items-center p-4 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl"
        >
          <Card className="backdrop-blur-sm bg-card/95 border border-border/50 shadow-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-green">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </CardTitle>
              <CardDescription>
                {isLogin
                  ? 'Sign in to your SkillSageAI account'
                  : 'Join SkillSageAI and transform your career'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Form */}
              {isLogin ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <FormInput
                    label="Email"
                    id="email"
                    icon={<Mail />}
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                  <FormPassword
                    label="Password"
                    id="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    show={showLoginPassword}
                    toggle={() => setShowLoginPassword(!showLoginPassword)}
                  />
                  <Button type="submit" className="w-full" size="lg" variant="gradient">
                    Sign In
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <FormInput
                    label="Full Name"
                    id="name"
                    icon={<User />}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <FormInput
                    label="Email"
                    id="email"
                    icon={<Mail />}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <FormPassword
                    label="Password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    show={showPassword}
                    toggle={() => setShowPassword(!showPassword)}
                  />
                  <FormPassword
                    label="Confirm Password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    show={showConfirmPassword}
                    toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                  <Button type="submit" className="w-full" size="lg" variant="gradient">
                    Create Account
                  </Button>
                </form>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Google Button */}
              <Button variant="outline" className="w-full" size="lg">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              {/* Switch mode */}
              <div className="text-center text-sm text-muted-foreground">
                {isLogin ? (
                  <>
                    Don't have an account?{' '}
                    <button onClick={() => setIsLogin(false)} className="text-primary font-medium hover:underline">
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button onClick={() => setIsLogin(true)} className="text-primary font-medium hover:underline">
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// Reusable Input
const FormInput = ({ label, id, icon, value, onChange }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">{icon}</div>
      <Input id={id} type="text" placeholder={label} className="pl-10" value={value} onChange={onChange} required />
    </div>
  </div>
);

// Reusable Password Input
const FormPassword = ({ label, id, value, onChange, show, toggle }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={label}
        className="pl-10 pr-10"
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </div>
);
