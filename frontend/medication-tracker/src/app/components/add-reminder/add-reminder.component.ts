import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ReminderService } from '../../services/reminder.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Reminder } from '../../models';

@Component({
  selector: 'app-add-reminder',
  templateUrl: './add-reminder.component.html',
  styleUrl: './add-reminder.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ]
})
export class AddReminderComponent implements OnInit {
  reminderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reminderService: ReminderService,
    private router: Router
  ) {
    this.reminderForm = this.fb.group({
      medicationName: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [null],
      nextDueTime: [null],
      instructions: [''],
      taken: [false],
      lastTakenTime: [null],
      notes: [''],
      email: ['', [Validators.required, Validators.email]],
      intervalHours: [null, [Validators.min(0)]],
      intervalMinutes: [null, [Validators.min(0), Validators.max(59)]]
    });
  }

  ngOnInit(): void {}

  private calculateNextDueTime(
    startDate: string, 
    frequency: string, 
    intervalHours: number | null,
    intervalMinutes: number | null
  ): string {
    const date = new Date(startDate);
    
    switch (frequency) {
      case 'TWICE_DAILY':
        date.setHours(date.getHours() + 12);
        break;
      case 'DAILY':
        date.setHours(date.getHours() + 24);
        break;
      case 'WEEKLY':
        date.setDate(date.getDate() + 7);
        break;
      case 'MONTHLY':
        date.setMonth(date.getMonth() + 1);
        break;
      default:
        if (intervalHours) {
          date.setHours(date.getHours() + intervalHours);
        }
        if (intervalMinutes) {
          date.setMinutes(date.getMinutes() + intervalMinutes);
        }
    }
    
    return date.toISOString();
  }

  onSubmit(): void {
    if (this.reminderForm.valid) {
      console.log('Submitting form with values:', this.reminderForm.value);
      
      const formValue = this.reminderForm.value;
      const nextDueTime = this.calculateNextDueTime(
        formValue.startDate,
        formValue.frequency,
        formValue.intervalHours,
        formValue.intervalMinutes
      );

      const reminder: Reminder = {
        ...formValue,
        nextDueTime,
        taken: false,
        lastTakenTime: null
      };
      
      console.log('Submitting reminder:', reminder);
      
      this.reminderService.createReminder(reminder).subscribe({
        next: (response: Reminder) => {
          console.log('Reminder created successfully:', response);
          this.reminderForm.reset();
          this.router.navigate(['/reminders']);
        },
        error: (error: unknown) => {
          console.error('Error creating reminder:', error);
        }
      });
    }
  }
}
