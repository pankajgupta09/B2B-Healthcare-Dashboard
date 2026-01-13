import { format, parseISO } from 'date-fns';
import { Calendar, Clock, User, Stethoscope, MapPin, Timer, AlertCircle } from 'lucide-react';
import { Appointment, cancelAppointment } from '@/features/appointments/appointmentsSlice';
import { useAppDispatch } from '@/app/hooks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AppointmentDetailsProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function AppointmentDetails({ appointment, open, onOpenChange }: AppointmentDetailsProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  if (!appointment) return null;

  const handleCancel = () => {
    dispatch(cancelAppointment(appointment.id));
    toast({
      title: 'Appointment Cancelled',
      description: 'The appointment has been cancelled successfully.',
      variant: 'destructive',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Appointment Details</DialogTitle>
            <Badge variant="outline" className={cn(statusStyles[appointment.status])}>
              {appointment.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Type Badge */}
          <div className="flex items-center gap-2">
            <Badge className={cn('text-sm', typeStyles[appointment.type])}>
              {appointment.type}
            </Badge>
            <span className="text-sm text-muted-foreground">#{appointment.id}</span>
          </div>

          <Separator />

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">{format(parseISO(appointment.date), 'PPP')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-medium">{appointment.time}</p>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent">
              <Timer className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-medium">{appointment.duration} minutes</p>
            </div>
          </div>

          <Separator />

          {/* Patient */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <User className="h-4 w-4 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Patient</p>
              <p className="font-medium">{appointment.patientName}</p>
              <p className="text-xs text-muted-foreground">ID: {appointment.patientId}</p>
            </div>
          </div>

          {/* Doctor */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Stethoscope className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Doctor</p>
              <p className="font-medium">{appointment.doctorName}</p>
              <p className="text-xs text-muted-foreground">ID: {appointment.doctorId}</p>
            </div>
          </div>

          {/* Clinic */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <MapPin className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Clinic</p>
              <p className="font-medium">{appointment.clinic}</p>
            </div>
          </div>

          {/* Actions */}
          {appointment.status !== 'cancelled' && (
            <>
              <Separator />
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button variant="destructive" onClick={handleCancel}>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Cancel Appointment
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
