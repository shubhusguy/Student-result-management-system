import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubjectService } from '../../services/subject.service';
import { Subject, CreateSubjectRequest } from '../../models/subject.model';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="subjects-container">
      <div class="page-header">
        <h1>Subject Management</h1>
        <button class="btn btn-primary" (click)="toggleForm()">
          {{ showForm ? 'Cancel' : 'Add New Subject' }}
        </button>
      </div>

      <div class="subject-form" *ngIf="showForm">
        <h2>{{ editingSubject ? 'Edit Subject' : 'Add New Subject' }}</h2>
        <form (ngSubmit)="onSubmit()" #subjectForm="ngForm">
          <div class="form-grid">
            <div class="form-group">
              <label for="subject_name">Subject Name *</label>
              <input
                type="text"
                id="subject_name"
                name="subject_name"
                [(ngModel)]="formData.subject_name"
                required
                class="form-control"
                placeholder="e.g., Mathematics"
              />
            </div>

            <div class="form-group">
              <label for="subject_code">Subject Code *</label>
              <input
                type="text"
                id="subject_code"
                name="subject_code"
                [(ngModel)]="formData.subject_code"
                required
                class="form-control"
                placeholder="e.g., MATH101"
                maxlength="10"
              />
            </div>

            <div class="form-group">
              <label for="max_marks">Maximum Marks</label>
              <input
                type="number"
                id="max_marks"
                name="max_marks"
                [(ngModel)]="formData.max_marks"
                class="form-control"
                placeholder="100"
                min="1"
                max="500"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="!subjectForm.form.valid">
              {{ editingSubject ? 'Update Subject' : 'Add Subject' }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="resetForm()">
              Reset
            </button>
          </div>
        </form>
      </div>

      <div class="subjects-list">
        <h2>Subjects List</h2>
        <div class="search-section">
          <input
            type="text"
            placeholder="Search subjects..."
            [(ngModel)]="searchTerm"
            (input)="filterSubjects()"
            class="search-input"
          />
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject Name</th>
                <th>Subject Code</th>
                <th>Max Marks</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let subject of filteredSubjects">
                <td>{{ subject.subject_id }}</td>
                <td>{{ subject.subject_name }}</td>
                <td>
                  <span class="subject-code-badge">{{ subject.subject_code }}</span>
                </td>
                <td>{{ subject.max_marks }}</td>
                <td>{{ subject.created_at | date:'shortDate' }}</td>
                <td class="actions">
                  <button class="btn btn-edit" (click)="editSubject(subject)">
                    Edit
                  </button>
                  <button class="btn btn-delete" (click)="deleteSubject(subject.subject_id)">
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
    .subjects-container {
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

    .subject-form {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .subject-form h2 {
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

    .subjects-list {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .subjects-list h2 {
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

    .subject-code-badge {
      background: #3b82f6;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 600;
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
export class SubjectsComponent implements OnInit {
  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  showForm = false;
  editingSubject: Subject | null = null;
  searchTerm = '';
  message = '';
  messageType = '';

  formData: CreateSubjectRequest = {
    subject_name: '',
    subject_code: '',
    max_marks: 100
  };

  constructor(private subjectService: SubjectService) {}

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects() {
    this.subjectService.getAllSubjects().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.subjects = response.data;
          this.filteredSubjects = [...this.subjects];
        }
      },
      error: (error) => {
        this.showMessage('Error loading subjects: ' + error.message, 'error');
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
      subject_name: '',
      subject_code: '',
      max_marks: 100
    };
    this.editingSubject = null;
    this.message = '';
  }

  onSubmit() {
    if (this.editingSubject) {
      this.updateSubject();
    } else {
      this.addSubject();
    }
  }

  addSubject() {
    this.subjectService.createSubject(this.formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage('Subject added successfully!', 'success');
          this.loadSubjects();
          this.resetForm();
          this.showForm = false;
        }
      },
      error: (error) => {
        this.showMessage('Error adding subject: ' + error.message, 'error');
      }
    });
  }

  updateSubject() {
    if (this.editingSubject) {
      this.subjectService.updateSubject(this.editingSubject.subject_id, this.formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.showMessage('Subject updated successfully!', 'success');
            this.loadSubjects();
            this.resetForm();
            this.showForm = false;
          }
        },
        error: (error) => {
          this.showMessage('Error updating subject: ' + error.message, 'error');
        }
      });
    }
  }

  editSubject(subject: Subject) {
    this.editingSubject = subject;
    this.formData = {
      subject_name: subject.subject_name,
      subject_code: subject.subject_code,
      max_marks: subject.max_marks
    };
    this.showForm = true;
  }

  deleteSubject(subjectId: number) {
    if (confirm('Are you sure you want to delete this subject?')) {
      this.subjectService.deleteSubject(subjectId).subscribe({
        next: (response) => {
          if (response.success) {
            this.showMessage('Subject deleted successfully!', 'success');
            this.loadSubjects();
          }
        },
        error: (error) => {
          this.showMessage('Error deleting subject: ' + error.message, 'error');
        }
      });
    }
  }

  filterSubjects() {
    if (!this.searchTerm) {
      this.filteredSubjects = [...this.subjects];
    } else {
      this.filteredSubjects = this.subjects.filter(subject =>
        subject.subject_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        subject.subject_code.toLowerCase().includes(this.searchTerm.toLowerCase())
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