import { useEffect, useState } from 'react';
import { format, parseISO, addDays, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarIcon, Plus, ChevronLeft, ChevronRight, Calendar as CalendarViewIcon, List } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchAppointmentsStart,
  fetchAppointmentsSuccess,
  setSelectedDate,
  setViewMode,
  Appointment,
} from '@/features/appointments/appointmentsSlice';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { DailyView } from '@/components/appointments/DailyView';
import { WeeklyView } from '@/components/appointments/WeeklyView';
import { BookingDialog } from '@/components/appointments/BookingDialog';
import { AppointmentDetails } from '@/components/appointments/AppointmentDetails';

export default function Appointments() {
  const dispatch = useAppDispatch();
  const { appointments, selectedDate, viewMode, loading } = useAppSelector(
    (state) => state.appointments
  );

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAppointmentsStart());
    // Simulate API call
    const timer = setTimeout(() => {
      dispatch(fetchAppointmentsSuccess());
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      dispatch(setSelectedDate(format(date, 'yyyy-MM-dd')));
    }
  };

  const handlePrevDay = () => {
    const newDate = subDays(parseISO(selectedDate), viewMode === 'daily' ? 1 : 7);
    dispatch(setSelectedDate(format(newDate, 'yyyy-MM-dd')));
  };

  const handleNextDay = () => {
    const newDate = addDays(parseISO(selectedDate), viewMode === 'daily' ? 1 : 7);
    dispatch(setSelectedDate(format(newDate, 'yyyy-MM-dd')));
  };

  const handleToday = () => {
    dispatch(setSelectedDate(format(new Date(), 'yyyy-MM-dd')));
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailsOpen(true);
  };

  const handleDayClick = (date: Date) => {
    dispatch(setSelectedDate(format(date, 'yyyy-MM-dd')));
    dispatch(setViewMode('daily'));
  };

  // Stats
  const todayAppointments = appointments.filter(
    (apt) => apt.date === format(new Date(), 'yyyy-MM-dd')
  );
  const confirmedCount = todayAppointments.filter((apt) => apt.status === 'confirmed').length;
  const pendingCount = todayAppointments.filter((apt) => apt.status === 'pending').length;

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground mt-1">
              Manage and schedule patient appointments
            </p>
          </div>

          <Button onClick={() => setBookingOpen(true)} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Today's Total</p>
            <p className="text-2xl font-bold mt-1">{todayAppointments.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-success/10 border border-success/20">
            <p className="text-sm text-success">Confirmed</p>
            <p className="text-2xl font-bold mt-1 text-success">{confirmedCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
            <p className="text-sm text-warning">Pending</p>
            <p className="text-2xl font-bold mt-1 text-warning">{pendingCount}</p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[200px]">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {format(parseISO(selectedDate), 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseISO(selectedDate)}
                  onSelect={handleDateChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="icon" onClick={handleNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={handleToday}>
              Today
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => dispatch(setViewMode('daily'))}
            >
              <List className="h-4 w-4 mr-2" />
              Daily
            </Button>
            <Button
              variant={viewMode === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => dispatch(setViewMode('weekly'))}
            >
              <CalendarViewIcon className="h-4 w-4 mr-2" />
              Weekly
            </Button>
          </div>
        </motion.div>

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="bg-card rounded-xl border border-border p-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-20 w-20" />
                    <Skeleton className="h-20 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          ) : viewMode === 'daily' ? (
            <DailyView
              appointments={appointments}
              selectedDate={selectedDate}
              onAppointmentClick={handleAppointmentClick}
            />
          ) : (
            <WeeklyView
              appointments={appointments}
              selectedDate={selectedDate}
              onAppointmentClick={handleAppointmentClick}
              onDayClick={handleDayClick}
            />
          )}
        </motion.div>

        {/* Dialogs */}
        <BookingDialog
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          selectedDate={parseISO(selectedDate)}
        />
        <AppointmentDetails
          appointment={selectedAppointment}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      </div>
    </AppShell>
  );
}
