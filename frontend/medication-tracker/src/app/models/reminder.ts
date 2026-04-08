export interface Reminder {
  id?: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  nextDueTime: string | null;
  instructions: string | null;
  taken: boolean;
  lastTakenTime: string | null;
  notes: string | null;
  startDate: string;
  endDate: string | null;
  intervalHours: number | null;
  intervalMinutes: number | null;
  email?: string;
}