import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'reminders', loadComponent: () => import('./components/reminder-list/reminder-list.component').then(m => m.ReminderListComponent) },
  { path: 'add-reminder', loadComponent: () => import('./components/add-reminder/add-reminder.component').then(m => m.AddReminderComponent) },
  { path: 'medication-info/:name', loadComponent: () => import('./components/medication-info/medication-info.component').then(m => m.MedicationInfoComponent) }
];
