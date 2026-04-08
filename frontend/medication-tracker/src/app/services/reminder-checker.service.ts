import { Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ReminderService } from './reminder.service';
import { NotificationService } from './notification.service';
import { Reminder } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReminderCheckerService implements OnDestroy {
  private checkInterval: Subscription | null = null;
  private notifiedReminders: Set<number> = new Set();
  private isInitialized = false;

  constructor(
    private reminderService: ReminderService,
    private notificationService: NotificationService
  ) {}

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    console.log('Initializing ReminderChecker service...');
    const permissionGranted = await this.notificationService.requestPermission();
    console.log('Notification permission granted:', permissionGranted);

    if (!permissionGranted) {
      console.log('Notifications not permitted, reminder checker will not start');
      return;
    }

    // Start checking immediately
    this.checkDueReminders();

    // Then set up the interval for regular checks every minute
    this.checkInterval = interval(60000).subscribe(() => {
      console.log('Checking for due reminders (interval)...');
      this.checkDueReminders();
    });

    this.isInitialized = true;
  }

  private checkDueReminders() {
    console.log('Performing reminder check...');
    this.reminderService.getDueReminders().subscribe({
      next: (reminders) => {
        console.log('Received due reminders:', reminders);
        reminders.forEach(reminder => {
          console.log('Processing reminder:', reminder);
          if (!this.notifiedReminders.has(reminder.id!)) {
            console.log('Showing notification for reminder:', reminder.id);
            this.showReminderNotification(reminder);
            this.notifiedReminders.add(reminder.id!);
          } else {
            console.log('Reminder already notified:', reminder.id);
          }
        });
      },
      error: (error) => console.error('Error checking due reminders:', error)
    });
  }

  private showReminderNotification(reminder: Reminder) {
    const title = `Time to take ${reminder.medicationName}`;
    const options: NotificationOptions = {
      body: `Dosage: ${reminder.dosage}\n${reminder.instructions || ''}`,
      requireInteraction: true,
      silent: false,
      tag: `reminder-${reminder.id}` // Prevents duplicate notifications
    };
    
    this.notificationService.showNotification(title, options);
  }

  ngOnDestroy() {
    if (this.checkInterval) {
      this.checkInterval.unsubscribe();
    }
  }
}