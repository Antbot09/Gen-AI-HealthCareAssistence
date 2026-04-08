import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReminderService } from './reminder.service';
import { Reminder } from '../models';

describe('ReminderService', () => {
  let service: ReminderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReminderService]
    });
    service = TestBed.inject(ReminderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all reminders', () => {
    const testReminders: Reminder[] = [
      {
        id: 1,
        medicationName: 'Test Med',
        dosage: '10mg',
        frequency: 'DAILY',
        nextDueTime: new Date().toISOString(),
        instructions: 'Test instructions',
        taken: false,
        lastTakenTime: null,
        notes: 'Test notes',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        intervalHours: 24,
        intervalMinutes: null,
        email: undefined
      }
    ];

    service.getAllReminders().subscribe(reminders => {
      expect(reminders).toEqual(testReminders);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/reminders');
    expect(req.request.method).toBe('GET');
    req.flush(testReminders);
  });

  it('should create a reminder', () => {
    const newReminder: Reminder = {
      medicationName: 'Test Med',
      dosage: '10mg',
      frequency: 'DAILY',
      nextDueTime: new Date().toISOString(),
      instructions: 'Test instructions',
      taken: false,
      lastTakenTime: null,
      notes: 'Test notes',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      intervalHours: 24,
      intervalMinutes: null
    };

    service.createReminder(newReminder).subscribe(reminder => {
      expect(reminder).toEqual({ ...newReminder, id: 1 });
    });

    const req = httpMock.expectOne('http://localhost:8080/api/reminders');
    expect(req.request.method).toBe('POST');
    req.flush({ ...newReminder, id: 1 });
  });

  it('should mark reminder as taken', () => {
    service.markReminderAsTaken(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/reminders/1/take');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should get due reminders', () => {
    const dueReminders: Reminder[] = [
      {
        id: 1,
        medicationName: 'Test Med',
        dosage: '10mg',
        frequency: 'DAILY',
        nextDueTime: new Date().toISOString(),
        instructions: 'Test instructions',
        taken: false,
        lastTakenTime: null,
        notes: 'Test notes',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        intervalHours: 24,
        intervalMinutes: null
      }
    ];

    service.getDueReminders().subscribe(reminders => {
      expect(reminders).toEqual(dueReminders);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/reminders/due');
    expect(req.request.method).toBe('GET');
    req.flush(dueReminders);
  });

  it('should update a reminder', () => {
    const updateReminder: Reminder = {
      id: 1,
      medicationName: 'Updated Med',
      dosage: '20mg',
      frequency: 'DAILY',
      nextDueTime: new Date().toISOString(),
      instructions: 'Updated instructions',
      taken: false,
      lastTakenTime: null,
      notes: 'Updated notes',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      intervalHours: 24,
      intervalMinutes: null
    };

    service.updateReminder(1, updateReminder).subscribe(reminder => {
      expect(reminder).toEqual(updateReminder);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/reminders/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updateReminder);
  });

  it('should delete a reminder', () => {
    service.deleteReminder(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/reminders/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle error when API request fails', () => {
    const errorMessage = 'Server error';

    service.getAllReminders().subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/reminders');
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });
});