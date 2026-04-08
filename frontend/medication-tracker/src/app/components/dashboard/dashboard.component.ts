import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReminderService } from '../../services/reminder.service';
import { ReminderCheckerService } from '../../services/reminder-checker.service';
import { Reminder } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  activeMedications: number = 0;
  dueToday: number = 0;
  takenToday: number = 0;
  upcomingReminders: Reminder[] = [];

  constructor(
    private reminderService: ReminderService,
    private reminderChecker: ReminderCheckerService
  ) {}

  async ngOnInit() {
    console.log('Dashboard initializing...');
    
    // Initialize the reminder checker service
    await this.reminderChecker.initialize();
    
    // Load initial dashboard data
    this.loadDashboardData();
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() && 
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  loadDashboardData() {
    // Get all reminders
    this.reminderService.getAllReminders().subscribe({
      next: (reminders) => {
        console.log('Received reminders:', reminders);
        this.activeMedications = reminders.length;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
      
        // Calculate due today
        this.dueToday = reminders.filter(reminder => {
          if (!reminder.nextDueTime || reminder.taken) {
            return false;
          }
          const dueDate = new Date(reminder.nextDueTime);
          return this.isSameDay(dueDate, today);
        }).length;

        // Calculate taken today
        this.takenToday = reminders.filter(reminder => {
          if (!reminder.lastTakenTime) {
            return false;
          }
          const takenDate = new Date(reminder.lastTakenTime);
          return this.isSameDay(takenDate, today);
        }).length;

        // Get upcoming reminders
        const validReminders = reminders.filter(r => !r.taken && r.nextDueTime);
        this.upcomingReminders = validReminders
          .sort((a, b) => {
            const dateA = new Date(a.nextDueTime!).getTime();
            const dateB = new Date(b.nextDueTime!).getTime();
            return dateA - dateB;
          })
          .slice(0, 5);
      },
      error: (error) => {
        console.error('Error fetching reminders:', error);
      }
    });
  }

  markAsTaken(id: number | undefined) {
    if (id === undefined) {
      console.error('Cannot mark reminder as taken: reminder ID is undefined');
      return;
    }
    this.reminderService.markReminderAsTaken(id).subscribe(() => {
      this.loadDashboardData();
    });
  }
}
