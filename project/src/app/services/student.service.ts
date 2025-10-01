import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';
import { Student, StudentRanking, CreateStudentRequest } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private apiService: ApiService) {}

  getAllStudents(): Observable<ApiResponse<Student[]>> {
    return this.apiService.get<Student[]>('/students');
  }

  getStudentById(id: number): Observable<ApiResponse<Student>> {
    return this.apiService.get<Student>(`/students/${id}`);
  }

  createStudent(student: CreateStudentRequest): Observable<ApiResponse<{student_id: number}>> {
    return this.apiService.post<{student_id: number}>('/students', student);
  }

  updateStudent(id: number, student: CreateStudentRequest): Observable<ApiResponse<any>> {
    return this.apiService.put<any>(`/students/${id}`, student);
  }

  deleteStudent(id: number): Observable<ApiResponse<any>> {
    return this.apiService.delete<any>(`/students/${id}`);
  }

  getStudentRankings(): Observable<ApiResponse<StudentRanking[]>> {
    return this.apiService.get<StudentRanking[]>('/students/rankings/all');
  }
}