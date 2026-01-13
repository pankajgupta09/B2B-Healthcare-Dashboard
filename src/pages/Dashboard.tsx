import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Stethoscope, Calendar, Building2, TrendingUp, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchDashboard } from '@/features/dashboard/dashboardSlice';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/stat-card';
import { StatCardSkeleton } from '@/components/ui/skeleton-loader';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { stats, recentActivity, isLoading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const statCards = [
    { title: 'Total Patients', value: stats.patients, icon: Users, color: 'primary' as const },
    { title: 'Total Doctors', value: stats.doctors, icon: Stethoscope, color: 'success' as const },
    { title: 'Total Appointments', value: stats.appointments, icon: Calendar, color: 'warning' as const },
    { title: 'Active Clinics', value: stats.clinics, icon: Building2, color: 'info' as const },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return Calendar;
      case 'patient':
        return Users;
      case 'doctor':
        return Stethoscope;
      case 'clinic':
        return Building2;
      default:
        return TrendingUp;
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => <StatCardSkeleton key={i} />)
            : statCards.map((stat, index) => (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  delay={index * 0.1}
                />
              ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl border border-border shadow-card"
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-1/4 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              recentActivity.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                      <Icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-xl border border-border p-6 shadow-card"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-4">This Week</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">New Patients</span>
                <span className="text-sm font-semibold text-success flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +12%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '68%' }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-card rounded-xl border border-border p-6 shadow-card"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Appointments Today</h3>
            <div className="flex items-end gap-4">
              <span className="text-4xl font-bold text-foreground">24</span>
              <span className="text-sm text-muted-foreground mb-1">of 30 scheduled</span>
            </div>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '80%' }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="h-full bg-success rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
