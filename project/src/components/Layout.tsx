import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Brain,
  User,
  FileText,
  MessageSquare,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Interview', href: '/interview', icon: MessageSquare },
    { name: 'Resume', href: '/resume', icon: FileText },
    { name: 'Learning', href: '/learning', icon: GraduationCap },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isMinimalPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  const isTopNavPage = ['/', '/about', '/contact'].includes(location.pathname);
  
  // This is the core logic: check if the path starts with '/interview-room'
  // The sidebar will be hidden on this specific page.
  const isInterviewRoomPage = location.pathname.startsWith('/interview-room');

  if (isMinimalPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-card">
        <Outlet />
      </div>
    );
  }

  if (isTopNavPage) {
    return (
      <>
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-4">
                <Brain className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold gradient-text">SkillSageAI</span>
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="gradient">Get Started</Button>
                </Link>
              </div>

              <div className="md:hidden flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>

          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-card border-t border-border"
            >
              <div className="px-4 py-2 space-y-2">
                <Link to="/about" className="block py-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
                <Link to="/contact" className="block py-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                <Link to="/login" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/register" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="gradient" className="w-full">Get Started</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </nav>

        <div className="h-16" />
        <Outlet />
      </>
    );
  }
  
  // The main layout for authenticated users
  return (
    <div className="min-h-screen bg-background flex text-white">
      {/* Desktop Sidebar - Conditionally hidden on the interview room page */}
      {!isInterviewRoomPage && (
        <nav className="fixed left-0 top-0 h-screen w-20 bg-black border-r shadow-sm hidden lg:flex flex-col justify-between items-center py-4 z-40">
          <div className="p-2 rounded-lg border border-gray-800">
            {/* Using a placeholder image for the logo. Replace with your actual icon.png if available. */}
            <img src="icon.png" alt="Logo" className="h-6 w-6" />
          </div>
          <ul className="flex flex-col items-center gap-6 mt-8 flex-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex flex-col items-center text-xs px-3 py-2 rounded-xl ${
                      isActive
                        ? 'text-white bg-gray-700'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-[11px] mt-1">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mb-2 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden" />
        </nav>
      )}

      {/* Main content area, with dynamic left margin */}
      <div className={`flex-1 pb-16 lg:pb-0 ${isInterviewRoomPage ? 'lg:ml-0' : 'lg:ml-20'}`}>
        {/* Mobile Top Bar (hidden on desktop, also hidden if it's the interview room page) */}
        {!isInterviewRoomPage && (
          <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border">
            <Link to="/" className="flex items-center space-x-3">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold gradient-text">SkillSageAI</span>
            </Link>
          </div>
        )}

        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Improved Mobile Bottom Nav (hidden on desktop, also hidden if it's the interview room page) */}
      {!isInterviewRoomPage && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
          <div className="flex justify-between items-center">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-1 flex-col items-center space-y-1 py-2 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
