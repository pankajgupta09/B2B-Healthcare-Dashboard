import { useState, ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { useAppSelector } from '@/app/hooks';
import { ChatWidget } from '@/components/chat/ChatWidget';

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
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile
      if (mobile) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={isMobile} />

      <div>
        <Header
          sidebarOpen={!isMobile && sidebarOpen}
          onMenuClick={handleMenuClick}
          isMobile={isMobile}
        />

        <motion.main
          className="p-3 md:p-6 pb-20 md:pb-6"
          style={{
            marginLeft: isMobile ? 0 : sidebarOpen ? 260 : 72,
            transition: 'margin-left 0.2s ease-in-out',
          }}
        >
          {children}
        </motion.main>
      </div>

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}
