import { motion } from 'framer-motion';
import { Clock, User, Stethoscope, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment } from '@/features/appointments/appointmentsSlice';
import { Badge } from '@/components/ui/badge';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: () => void;
}

const statusStyles = {
  confirmed: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

const typeStyles = {
  Consultation: 'bg-primary/10 text-primary',
  'Follow-up': 'bg-info/10 text-info',
  'Check-up': 'bg-accent text-accent-foreground',
  Surgery: 'bg-destructive/10 text-destructive',
};

export function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={cn(
        'p-4 rounded-xl border bg-card cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:border-primary/30',
        appointment.status === 'cancelled' && 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {appointment.time}
          </div>
          <Badge variant="outline" className={cn('text-xs', statusStyles[appointment.status])}>
            {appointment.status}
          </Badge>
        </div>
        <Badge className={cn('text-xs', typeStyles[appointment.type])}>
          {appointment.type}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{appointment.patientName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{appointment.doctorName}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{appointment.clinic}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">
          Duration: {appointment.duration} mins
        </span>
      </div>
    </motion.div>
  );
}
