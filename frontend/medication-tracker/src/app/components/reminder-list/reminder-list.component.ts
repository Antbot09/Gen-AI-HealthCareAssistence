import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { Reminder } from '../../models';
import { ReminderService } from '../../services/reminder.service';

@Component({
  selector: 'app-reminder-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatChipsModule
  ],
  templateUrl: './reminder-list.component.html',
  styleUrl: './reminder-list.component.scss'
})
export class ReminderListComponent implements OnInit {
  displayedColumns: string[] = ['medicationName', 'dosage', 'nextDueTime', 'status', 'actions'];
  dataSource: MatTableDataSource<Reminder>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private reminderService: ReminderService) {
    this.dataSource = new MatTableDataSource<Reminder>([]);
  }

  ngOnInit() {
    this.loadReminders();
  }

  loadReminders() {
    this.reminderService.getAllReminders().subscribe({
      next: (reminders) => {
        console.log('Received reminders in list:', reminders);
        this.dataSource = new MatTableDataSource(reminders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Error fetching reminders:', error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  markAsTaken(reminder: Reminder) {
    if (reminder.id === undefined) {
      console.error('Cannot mark reminder as taken: reminder ID is undefined');
      return;
    }
    this.reminderService.markReminderAsTaken(reminder.id).subscribe(() => {
      this.loadReminders();
    });
  }

  editReminder(reminder: Reminder) {
    // TODO: Implement edit functionality
  }

  deleteReminder(reminder: Reminder) {
    if (reminder.id === undefined) {
      console.error('Cannot delete reminder: reminder ID is undefined');
      return;
    }
    if (confirm('Are you sure you want to delete this reminder?')) {
      this.reminderService.deleteReminder(reminder.id).subscribe(() => {
        this.loadReminders();
      });
    }
  }
}
