import { useState, ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { useAppSelector } from '@/app/hooks';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useAppSelector((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className={isMobile ? '' : undefined}>
        <Header sidebarOpen={!isMobile && sidebarOpen} />
        
        <motion.main
          className="p-6"
          style={{
            marginLeft: isMobile ? 0 : sidebarOpen ? 260 : 72,
            transition: 'margin-left 0.2s ease-in-out',
          }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
