import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  X,
  Activity,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile?: boolean;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/directory', label: 'Directory', icon: Users },
  { path: '/appointments', label: 'Appointments', icon: CalendarDays },
];

export function AppSidebar({ isOpen, setIsOpen, isMobile: propIsMobile }: SidebarProps) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(propIsMobile ?? false);

  useEffect(() => {
    if (propIsMobile !== undefined) {
      setIsMobile(propIsMobile);
      return;
    }
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsOpen, propIsMobile]);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobile ? (isOpen ? 0 : -280) : 0,
          width: isMobile ? 280 : (isOpen ? 260 : 72)
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border',
          'flex flex-col overflow-hidden'
        )}
      >
        {/* Logo */}
        <div className="flex h-14 md:h-16 items-center justify-between px-3 md:px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 md:gap-3" onClick={() => isMobile && setIsOpen(false)}>
            <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
            </div>
            <AnimatePresence>
              {(isOpen || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-semibold text-foreground whitespace-nowrap overflow-hidden text-sm md:text-base"
                >
                  Healthcare Admin
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="h-8 w-8 shrink-0"
            >
              <ChevronLeft className={cn('h-4 w-4 transition-transform', !isOpen && 'rotate-180')} />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 md:p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsOpen(false)}
                className={cn(
                  'flex items-center gap-2 md:gap-3 px-2.5 md:px-3 py-2 md:py-2.5 rounded-lg transition-all duration-200',
                  'hover:bg-sidebar-accent',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground'
                )}
              >
                <item.icon className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                <AnimatePresence>
                  {(isOpen || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap overflow-hidden text-sm md:text-base"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}
