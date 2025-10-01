import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';
import { Result, ReportCard, ClassAverage, AddResultRequest } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  constructor(private apiService: ApiService) {}

  getAllResults(): Observable<ApiResponse<Result[]>> {
    return this.apiService.get<Result[]>('/results');
  }

  addResult(result: AddResultRequest): Observable<ApiResponse<any>> {
    return this.apiService.post<any>('/results/add', result);
  }

  generateReportCard(studentId: number): Observable<ApiResponse<ReportCard[]>> {
    return this.apiService.get<ReportCard[]>(`/results/report-card/${studentId}`);
  }

  getClassAverage(className?: string): Observable<ApiResponse<ClassAverage[]>> {
    const endpoint = className ? `/results/class-average/${className}` : '/results/class-average';
    return this.apiService.get<ClassAverage[]>(endpoint);
  }

  getStudentResults(studentId: number): Observable<ApiResponse<Result[]>> {
    return this.apiService.get<Result[]>(`/results/student/${studentId}`);
  }
}