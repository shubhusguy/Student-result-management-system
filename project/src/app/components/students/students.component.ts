import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student, CreateStudentRequest } from '../../models/student.model';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="students-container">
      <div class="page-header">
        <h1>Student Management</h1>
        <button class="btn btn-primary" (click)="toggleForm()">
          {{ showForm ? 'Cancel' : 'Add New Student' }}
        </button>
      </div>

      <div class="student-form" *ngIf="showForm">
        <h2>{{ editingStudent ? 'Edit Student' : 'Add New Student' }}</h2>
        <form (ngSubmit)="onSubmit()" #studentForm="ngForm">
          <div class="form-grid">
            <div class="form-group">
              <label for="student_name">Student Name *</label>
              <input
                type="text"
                id="student_name"
                name="student_name"
                [(ngModel)]="formData.student_name"
                required
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="class">Class *</label>
              <select
                id="class"
                name="class"
                [(ngModel)]="formData.class"
                required
                class="form-control"
              >
                <option value="">Select Class</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            <div class="form-group">
              <label for="section">Section *</label>
              <select
                id="section"
                name="section"
                [(ngModel)]="formData.section"
                required
                class="form-control"
              >
                <option value="">Select Section</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="formData.email"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                [(ngModel)]="formData.phone"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="date_of_birth">Date of Birth</label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                [(ngModel)]="formData.date_of_birth"
                class="form-control"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="!studentForm.form.valid">
              {{ editingStudent ? 'Update Student' : 'Add Student' }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="resetForm()">
              Reset
            </button>
          </div>
        </form>
      </div>

      <div class="students-list">
        <h2>Students List</h2>
        <div class="search-section">
          <input
            type="text"
            placeholder="Search students..."
            [(ngModel)]="searchTerm"
            (input)="filterStudents()"
            class="search-input"
          />
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let student of filteredStudents">
                <td>{{ student.student_id }}</td>
                <td>{{ student.student_name }}</td>
                <td>{{ student.class }}</td>
                <td>{{ student.section }}</td>
                <td>{{ student.email || 'N/A' }}</td>
                <td>{{ student.phone || 'N/A' }}</td>
                <td class="actions">
                  <button class="btn btn-edit" (click)="editStudent(student)">
                    Edit
                  </button>
                  <button class="btn btn-delete" (click)="deleteStudent(student.student_id)">
                    Delete
                  </button>
                </td>
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
    .students-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      color: #1e40af;
      font-size: 2rem;
      margin: 0;
    }

    .student-form {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .student-form h2 {
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

    .form-actions {
      display: flex;
      gap: 12px;
    }

    .students-list {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .students-list h2 {
      color: #1e40af;
      margin-bottom: 20px;
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

    .actions {
      display: flex;
      gap: 8px;
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

    .btn-edit {
      background: #10b981;
      color: white;
      font-size: 0.9rem;
      padding: 6px 12px;
    }

    .btn-edit:hover {
      background: #059669;
    }

    .btn-delete {
      background: #ef4444;
      color: white;
      font-size: 0.9rem;
      padding: 6px 12px;
    }

    .btn-delete:hover {
      background: #dc2626;
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
        gap: 16px;
        align-items: stretch;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  showForm = false;
  editingStudent: Student | null = null;
  searchTerm = '';
  message = '';
  messageType = '';

  formData: CreateStudentRequest = {
    student_name: '',
    class: '',
    section: '',
    email: '',
    phone: '',
    date_of_birth: ''
  };

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getAllStudents().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.students = response.data;
          this.filteredStudents = [...this.students];
        }
      },
      error: (error) => {
        this.showMessage('Error loading students: ' + error.message, 'error');
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.formData = {
      student_name: '',
      class: '',
      section: '',
      email: '',
      phone: '',
      date_of_birth: ''
    };
    this.editingStudent = null;
    this.message = '';
  }

  onSubmit() {
    if (this.editingStudent) {
      this.updateStudent();
    } else {
      this.addStudent();
    }
  }

  addStudent() {
    this.studentService.createStudent(this.formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage('Student added successfully!', 'success');
          this.loadStudents();
          this.resetForm();
          this.showForm = false;
        }
      },
      error: (error) => {
        this.showMessage('Error adding student: ' + error.message, 'error');
      }
    });
  }

  updateStudent() {
    if (this.editingStudent) {
      this.studentService.updateStudent(this.editingStudent.student_id, this.formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.showMessage('Student updated successfully!', 'success');
            this.loadStudents();
            this.resetForm();
            this.showForm = false;
          }
        },
        error: (error) => {
          this.showMessage('Error updating student: ' + error.message, 'error');
        }
      });
    }
  }

  editStudent(student: Student) {
    this.editingStudent = student;
    this.formData = {
      student_name: student.student_name,
      class: student.class,
      section: student.section,
      email: student.email || '',
      phone: student.phone || '',
      date_of_birth: student.date_of_birth ? student.date_of_birth.split('T')[0] : ''
    };
    this.showForm = true;
  }

  deleteStudent(studentId: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(studentId).subscribe({
        next: (response) => {
          if (response.success) {
            this.showMessage('Student deleted successfully!', 'success');
            this.loadStudents();
          }
        },
        error: (error) => {
          this.showMessage('Error deleting student: ' + error.message, 'error');
        }
      });
    }
  }

  filterStudents() {
    if (!this.searchTerm) {
      this.filteredStudents = [...this.students];
    } else {
      this.filteredStudents = this.students.filter(student =>
        student.student_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.section.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (student.email && student.email.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }

  showMessage(text: string, type: string) {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}