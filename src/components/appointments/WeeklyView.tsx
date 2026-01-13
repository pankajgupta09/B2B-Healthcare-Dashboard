import { useMemo } from 'react';
import { format, parseISO, startOfWeek, addDays, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Appointment } from '@/features/appointments/appointmentsSlice';
import { AppointmentCard } from './AppointmentCard';
import { cn } from '@/lib/utils';

interface WeeklyViewProps {
  appointments: Appointment[];
  selectedDate: string;
  onAppointmentClick?: (appointment: Appointment) => void;
  onDayClick?: (date: Date) => void;
}

export function WeeklyView({ appointments, selectedDate, onAppointmentClick, onDayClick }: WeeklyViewProps) {
  const weekDays = useMemo(() => {
    const start = startOfWeek(parseISO(selectedDate), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === dateStr);
  };

  const today = new Date();

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-lg">
          Week of {format(weekDays[0], 'MMMM d')} - {format(weekDays[6], 'd, yyyy')}
        </h3>
      </div>

      <div className="grid grid-cols-7 divide-x divide-border">
        {weekDays.map((day, index) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isToday = isSameDay(day, today);
          const isSelected = format(day, 'yyyy-MM-dd') === selectedDate;

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="min-h-[400px] flex flex-col"
            >
              {/* Day header */}
              <button
                onClick={() => onDayClick?.(day)}
                className={cn(
                  'p-3 border-b border-border text-center transition-colors hover:bg-muted/50',
                  isToday && 'bg-primary/10',
                  isSelected && 'bg-primary/20'
                )}
              >
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  {format(day, 'EEE')}
                </p>
                <p className={cn(
                  'text-2xl font-semibold mt-1',
                  isToday && 'text-primary'
                )}>
                  {format(day, 'd')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {dayAppointments.length} apt{dayAppointments.length !== 1 ? 's' : ''}
                </p>
              </button>

              {/* Appointments */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[350px]">
                {dayAppointments.length > 0 ? (
                  dayAppointments.map((apt) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        'p-2 rounded-lg text-xs cursor-pointer transition-all',
                        'hover:ring-2 hover:ring-primary/50',
                        apt.status === 'confirmed' && 'bg-success/10 border-l-2 border-success',
                        apt.status === 'pending' && 'bg-warning/10 border-l-2 border-warning',
                        apt.status === 'cancelled' && 'bg-destructive/10 border-l-2 border-destructive opacity-60'
                      )}
                      onClick={() => onAppointmentClick?.(apt)}
                    >
                      <p className="font-medium truncate">{apt.time}</p>
                      <p className="truncate text-muted-foreground">{apt.patientName}</p>
                      <p className="truncate text-muted-foreground/70">{apt.doctorName}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-xs text-muted-foreground/40">No appointments</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
