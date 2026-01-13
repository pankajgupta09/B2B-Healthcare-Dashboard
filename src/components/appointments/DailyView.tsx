import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Appointment } from '@/features/appointments/appointmentsSlice';
import { AppointmentCard } from './AppointmentCard';
import { cn } from '@/lib/utils';

interface DailyViewProps {
  appointments: Appointment[];
  selectedDate: string;
  onAppointmentClick?: (appointment: Appointment) => void;
}

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export function DailyView({ appointments, selectedDate, onAppointmentClick }: DailyViewProps) {
  const dayAppointments = useMemo(() => {
    return appointments.filter(apt => apt.date === selectedDate);
  }, [appointments, selectedDate]);

  const getAppointmentsForSlot = (slot: string) => {
    const slotHour = parseInt(slot.split(':')[0]);
    return dayAppointments.filter(apt => {
      const aptHour = parseInt(apt.time.split(':')[0]);
      return aptHour === slotHour;
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-lg">
          {format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''} scheduled
        </p>
      </div>

      <div className="divide-y divide-border">
        {timeSlots.map((slot, index) => {
          const slotAppointments = getAppointmentsForSlot(slot);
          
          return (
            <motion.div
              key={slot}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex"
            >
              <div className="w-20 shrink-0 p-4 border-r border-border bg-muted/20">
                <span className="text-sm font-medium text-muted-foreground">{slot}</span>
              </div>
              <div className={cn(
                'flex-1 p-3 min-h-[100px]',
                slotAppointments.length === 0 && 'bg-muted/5'
              )}>
                {slotAppointments.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {slotAppointments.map((apt) => (
                      <AppointmentCard
                        key={apt.id}
                        appointment={apt}
                        onClick={() => onAppointmentClick?.(apt)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-xs text-muted-foreground/50">No appointments</span>
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
