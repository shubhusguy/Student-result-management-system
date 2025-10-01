import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';
import { Subject, CreateSubjectRequest } from '../models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  constructor(private apiService: ApiService) {}

  getAllSubjects(): Observable<ApiResponse<Subject[]>> {
    return this.apiService.get<Subject[]>('/subjects');
  }

  getSubjectById(id: number): Observable<ApiResponse<Subject>> {
    return this.apiService.get<Subject>(`/subjects/${id}`);
  }

  createSubject(subject: CreateSubjectRequest): Observable<ApiResponse<{subject_id: number}>> {
    return this.apiService.post<{subject_id: number}>('/subjects', subject);
  }

  updateSubject(id: number, subject: CreateSubjectRequest): Observable<ApiResponse<any>> {
    return this.apiService.put<any>(`/subjects/${id}`, subject);
  }

  deleteSubject(id: number): Observable<ApiResponse<any>> {
    return this.apiService.delete<any>(`/subjects/${id}`);
  }
}