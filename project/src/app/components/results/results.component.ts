import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResultService } from '../../services/result.service';
import { StudentService } from '../../services/student.service';
import { SubjectService } from '../../services/subject.service';
import { Student } from '../../models/student.model';
import { Subject } from '../../models/subject.model';
import { Result, AddResultRequest, ReportCard } from '../../models/result.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="results-container">
      <div class="page-header">
        <h1>Result Management</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="toggleAddForm()">
            {{ showAddForm ? 'Cancel' : 'Add Result' }}
          </button>
          <button class="btn btn-secondary" (click)="toggleReportCard()">
            {{ showReportCard ? 'Hide Report' : 'Generate Report' }}
          </button>
        </div>
      </div>

      <!-- Add Result Form -->
      <div class="result-form" *ngIf="showAddForm">
        <h2>Add New Result</h2>
        <form (ngSubmit)="onSubmit()" #resultForm="ngForm">
          <div class="form-grid">
            <div class="form-group">
              <label for="student_id">Student *</label>
              <select
                id="student_id"
                name="student_id"
                [(ngModel)]="formData.student_id"
                required
                class="form-control"
              >
                <option value="">Select Student</option>
                <option *ngFor="let student of students" [value]="student.student_id">
                  {{ student.student_name }} ({{ student.class }}-{{ student.section }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="subject_code">Subject *</label>
              <select
                id="subject_code"
                name="subject_code"
                [(ngModel)]="formData.subject_code"
                required
                class="form-control"
              >
                <option value="">Select Subject</option>
                <option *ngFor="let subject of subjects" [value]="subject.subject_code">
                  {{ subject.subject_name }} ({{ subject.subject_code }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="marks">Marks *</label>
              <input
                type="number"
                id="marks"
                name="marks"
                [(ngModel)]="formData.marks"
                required
                min="0"
                max="100"
                class="form-control"
                placeholder="Enter marks (0-100)"
              />
              <div class="grade-preview" *ngIf="formData.marks">
                Grade: <span class="grade-badge" [class]="getGradeClass(calculateGrade(formData.marks))">
                  {{ calculateGrade(formData.marks) }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="exam_date">Exam Date</label>
              <input
                type="date"
                id="exam_date"
                name="exam_date"
                [(ngModel)]="formData.exam_date"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="exam_type">Exam Type</label>
              <select
                id="exam_type"
                name="exam_type"
                [(ngModel)]="formData.exam_type"
                class="form-control"
              >
                <option value="Regular">Regular</option>
                <option value="Mid-term">Mid-term</option>
                <option value="Final">Final</option>
                <option value="Quiz">Quiz</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="!resultForm.form.valid">
              Add Result
            </button>
            <button type="button" class="btn btn-secondary" (click)="resetForm()">
              Reset
            </button>
          </div>
        </form>
      </div>

      <!-- Report Card Section -->
      <div class="report-card-section" *ngIf="showReportCard">
        <h2>Generate Report Card</h2>
        <div class="report-form">
          <div class="form-group">
            <label for="report_student">Select Student:</label>
            <select
              id="report_student"
              [(ngModel)]="selectedStudentId"
              (change)="generateReportCard()"
              class="form-control"
            >
              <option value="">Choose a student</option>
              <option *ngFor="let student of students" [value]="student.student_id">
                {{ student.student_name }} ({{ student.class }}-{{ student.section }})
              </option>
            </select>
          </div>
        </div>

        <div class="report-card" *ngIf="reportCardData.length > 0">
          <div class="report-header">
            <h3>Report Card</h3>
            <div class="student-info">
              <p><strong>Student:</strong> {{ reportCardData[0]?.student_name }}</p>
              <p><strong>Class:</strong> {{ reportCardData[0]?.class }}-{{ reportCardData[0]?.section }}</p>
              <p><strong>GPA:</strong> {{ reportCardData[0]?.gpa | number:'1.2-2' }}</p>
            </div>
          </div>

          <div class="subjects-grid">
            <div *ngFor="let result of reportCardData" class="subject-card">
              <div class="subject-header">
                <h4>{{ result.subject_name }}</h4>
                <span class="subject-code">{{ result.subject_code }}</span>
              </div>
              <div class="marks-section">
                <div class="marks">{{ result.marks }}/{{ result.max_marks }}</div>
                <div class="grade-badge" [class]="getGradeClass(result.grade)">
                  {{ result.grade }}
                </div>
              </div>
              <div class="result-details">
                <small>{{ result.exam_type }} • {{ result.exam_date | date:'mediumDate' }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results List -->
      <div class="results-list">
        <h2>All Results</h2>
        <div class="search-section">
          <input
            type="text"
            placeholder="Search results..."
            [(ngModel)]="searchTerm"
            (input)="filterResults()"
            class="search-input"
          />
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Code</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let result of filteredResults">
                <td>{{ result.student_name }}</td>
                <td>{{ result.class }}-{{ result.section }}</td>
                <td>{{ result.subject_name }}</td>
                <td>{{ result.subject_code }}</td>
                <td>{{ result.marks }}</td>
                <td>
                  <span class="grade-badge" [class]="getGradeClass(result.grade)">
                    {{ result.grade }}
                  </span>
                </td>
                <td>{{ result.exam_date | date:'shortDate' }}</td>
                <td>{{ result.exam_type }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="message" *ngIf="message" [class]="messageType">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-header h1 {
      color: #1e40af;
      font-size: 2rem;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .result-form,
    .report-card-section,
    .results-list {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .result-form h2,
    .report-card-section h2,
    .results-list h2 {
      color: #1e40af;
      margin-bottom: 20px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }

    .form-control {
      padding: 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .grade-preview {
      margin-top: 8px;
      font-weight: 600;
      color: #374151;
    }

    .grade-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .grade-badge.grade-a-plus,
    .grade-badge.grade-a {
      background: #10b981;
      color: white;
    }

    .grade-badge.grade-b-plus,
    .grade-badge.grade-b {
      background: #3b82f6;
      color: white;
    }

    .grade-badge.grade-c-plus,
    .grade-badge.grade-c {
      background: #f59e0b;
      color: white;
    }

    .grade-badge.grade-d {
      background: #ef4444;
      color: white;
    }

    .grade-badge.grade-f {
      background: #991b1b;
      color: white;
    }

    .form-actions {
      display: flex;
      gap: 12px;
    }

    .report-form {
      margin-bottom: 24px;
    }

    .report-card {
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      background: #f8fafc;
    }

    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e5e7eb;
    }

    .report-header h3 {
      color: #1e40af;
      margin: 0;
    }

    .student-info p {
      margin: 4px 0;
      color: #374151;
    }

    .subjects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }

    .subject-card {
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .subject-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .subject-header h4 {
      margin: 0;
      color: #1e40af;
      font-size: 1.1rem;
    }

    .subject-code {
      background: #e5e7eb;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #6b7280;
    }

    .marks-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .marks {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e40af;
    }

    .result-details {
      color: #6b7280;
      font-size: 0.9rem;
    }

    .search-section {
      margin-bottom: 20px;
    }

    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th,
    .data-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    .data-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .message {
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 20px;
      font-weight: 500;
    }

    .message.success {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }

    .message.error {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }

      .header-actions {
        justify-content: stretch;
      }

      .header-actions .btn {
        flex: 1;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .report-header {
        flex-direction: column;
        gap: 16px;
      }

      .subjects-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ResultsComponent implements OnInit {
  students: Student[] = [];
  subjects: Subject[] = [];
  results: any[] = [];
  filteredResults: any[] = [];
  reportCardData: ReportCard[] = [];
  
  showAddForm = false;
  showReportCard = false;
  searchTerm = '';
  selectedStudentId = '';
  message = '';
  messageType = '';

  formData: AddResultRequest = {
    student_id: 0,
    subject_code: '',
    marks: 0,
    exam_date: '',
    exam_type: 'Regular'
  };

  constructor(
    private resultService: ResultService,
    private studentService: StudentService,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadStudents();
    this.loadSubjects();
    this.loadResults();
  }

  loadStudents() {
    this.studentService.getAllStudents().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.students = response.data;
        }
      },
      error: (error) => console.error('Error loading students:', error)
    });
  }

  loadSubjects() {
    this.subjectService.getAllSubjects().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.subjects = response.data;
        }
      },
      error: (error) => console.error('Error loading subjects:', error)
    });
  }

  loadResults() {
    this.resultService.getAllResults().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.results = response.data;
          this.filteredResults = [...this.results];
        }
      },
      error: (error) => console.error('Error loading results:', error)
    });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  toggleReportCard() {
    this.showReportCard = !this.showReportCard;
    if (!this.showReportCard) {
      this.reportCardData = [];
      this.selectedStudentId = '';
    }
  }

  resetForm() {
    this.formData = {
      student_id: 0,
      subject_code: '',
      marks: 0,
      exam_date: '',
      exam_type: 'Regular'
    };
    this.message = '';
  }

  onSubmit() {
    this.resultService.addResult(this.formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage('Result added successfully!', 'success');
          this.loadResults();
          this.resetForm();
          this.showAddForm = false;
        }
      },
      error: (error) => {
        this.showMessage('Error adding result: ' + error.message, 'error');
      }
    });
  }

  generateReportCard() {
    if (this.selectedStudentId) {
      this.resultService.generateReportCard(parseInt(this.selectedStudentId)).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.reportCardData = response.data;
          }
        },
        error: (error) => {
          this.showMessage('Error generating report card: ' + error.message, 'error');
        }
      });
    }
  }

  filterResults() {
    if (!this.searchTerm) {
      this.filteredResults = [...this.results];
    } else {
      this.filteredResults = this.results.filter(result =>
        result.student_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        result.subject_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        result.subject_code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        result.class.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  calculateGrade(marks: number): string {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C+';
    if (marks >= 40) return 'C';
    if (marks >= 33) return 'D';
    return 'F';
  }

  getGradeClass(grade: string): string {
    const gradeClass = grade.toLowerCase().replace('+', '-plus');
    return `grade-${gradeClass}`;
  }

  showMessage(text: string, type: string) {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}