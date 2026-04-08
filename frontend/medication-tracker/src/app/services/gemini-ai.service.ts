import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiAIService {
  private apiUrl = 'http://localhost:8080/api/ai';

  constructor(private http: HttpClient) { }

  getMedicationInfo(medicationName: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/medication-info/${medicationName}`);
  }

  checkDrugInteractions(medications: string[]): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/check-interactions`, medications);
  }

  getMedicationSchedule(medicationName: string, schedule: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/medication-schedule`, {
      params: { medicationName, schedule }
    });
  }
}