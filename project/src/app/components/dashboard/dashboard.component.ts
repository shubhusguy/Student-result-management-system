import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { ResultService } from '../../services/result.service';
import { Student, StudentRanking } from '../../models/student.model';
import { ClassAverage } from '../../models/result.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Student Result Management System</h1>
        <p>Comprehensive academic performance tracking and analysis</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ totalStudents }}</h3>
            <p>Total Students</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>{{ averageGPA | number:'1.2-2' }}</h3>
            <p>Average GPA</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <h3>{{ topPerformer?.student_name || 'N/A' }}</h3>
            <p>Top Performer</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>{{ classAverages.length }}</h3>
            <p>Subjects</p>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="rankings-section">
          <h2>Student Rankings</h2>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Average</th>
                  <th>GPA</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let student of topStudents" 
                    [class.top-rank]="student.overall_rank <= 3">
                  <td>
                    <span class="rank-badge" [class]="getRankClass(student.overall_rank)">
                      {{ student.overall_rank }}
                    </span>
                  </td>
                  <td>{{ student.student_name }}</td>
                  <td>{{ student.class }}-{{ student.section }}</td>
                  <td>{{ student.average_marks | number:'1.1-1' }}%</td>
                  <td>{{ student.gpa | number:'1.2-2' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="averages-section">
          <h2>Subject Performance</h2>
          <div class="chart-container">
            <div *ngFor="let subject of classAverages" class="subject-bar">
              <div class="subject-info">
                <span class="subject-name">{{ subject.subject_name }}</span>
                <span class="subject-average">{{ subject.average_marks | number:'1.1-1' }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" 
                     [style.width.%]="subject.average_marks"></div>
              </div>
              <div class="subject-details">
                <small>{{ subject.total_students }} students • High: {{ subject.highest_marks }} • Low: {{ subject.lowest_marks }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-section">
        <h2>Quick Actions</h2>
        <div class="action-cards">
          <a routerLink="/students" class="action-card">
            <div class="action-icon">👥</div>
            <h3>Manage Students</h3>
            <p>Add, edit, or view student information</p>
          </a>
          
          <a routerLink="/results" class="action-card">
            <div class="action-icon">📝</div>
            <h3>Add Results</h3>
            <p>Enter exam scores and generate grades</p>
          </a>
          
          <a routerLink="/reports" class="action-card">
            <div class="action-icon">📊</div>
            <h3>Generate Reports</h3>
            <p>Create detailed performance reports</p>
          </a>
          
          <a routerLink="/subjects" class="action-card">
            <div class="action-icon">📚</div>
            <h3>Manage Subjects</h3>
            <p>Configure subjects and grading</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 8px;
    }

    .dashboard-header p {
      color: #6b7280;
      font-size: 1.1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 16px;
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-icon {
      font-size: 2rem;
      background: #eff6ff;
      padding: 12px;
      border-radius: 50%;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-content h3 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #1e40af;
      margin: 0;
    }

    .stat-content p {
      color: #6b7280;
      margin: 4px 0 0 0;
      font-size: 0.9rem;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    .rankings-section,
    .averages-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .rankings-section h2,
    .averages-section h2 {
      color: #1e40af;
      margin-bottom: 20px;
      font-size: 1.5rem;
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
      padding: 12px 8px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    .data-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
    }

    .data-table tr.top-rank {
      background: #fef3c7;
    }

    .rank-badge {
      display: inline-block;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      text-align: center;
      line-height: 28px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .rank-badge.gold {
      background: #fbbf24;
      color: white;
    }

    .rank-badge.silver {
      background: #9ca3af;
      color: white;
    }

    .rank-badge.bronze {
      background: #cd7c2e;
      color: white;
    }

    .rank-badge.regular {
      background: #e5e7eb;
      color: #374151;
    }

    .chart-container {
      space-y: 16px;
    }

    .subject-bar {
      margin-bottom: 20px;
    }

    .subject-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .subject-name {
      font-weight: 600;
      color: #374151;
    }

    .subject-average {
      font-weight: 600;
      color: #1e40af;
    }

    .progress-bar {
      height: 12px;
      background: #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 4px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      transition: width 0.5s ease;
    }

    .subject-details {
      color: #6b7280;
      font-size: 0.8rem;
    }

    .actions-section h2 {
      color: #1e40af;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .action-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .action-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      text-decoration: none;
      transition: all 0.2s ease;
      border: 2px solid transparent;
      text-align: center;
    }

    .action-card:hover {
      transform: translateY(-4px);
      border-color: #3b82f6;
      box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .action-icon {
      font-size: 2.5rem;
      margin-bottom: 16px;
    }

    .action-card h3 {
      color: #1e40af;
      margin-bottom: 8px;
      font-size: 1.2rem;
    }

    .action-card p {
      color: #6b7280;
      margin: 0;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .action-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalStudents = 0;
  averageGPA = 0;
  topPerformer: StudentRanking | null = null;
  topStudents: StudentRanking[] = [];
  classAverages: ClassAverage[] = [];

  constructor(
    private studentService: StudentService,
    private resultService: ResultService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load student rankings
    this.studentService.getStudentRankings().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.topStudents = response.data.slice(0, 10);
          this.totalStudents = response.data.length;
          this.topPerformer = response.data[0];
          this.averageGPA = response.data.reduce((sum, student) => sum + student.gpa, 0) / response.data.length;
        }
      },
      error: (error) => console.error('Error loading rankings:', error)
    });

    // Load class averages
    this.resultService.getClassAverage().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.classAverages = response.data;
        }
      },
      error: (error) => console.error('Error loading class averages:', error)
    });
  }

  getRankClass(rank: number): string {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return 'regular';
  }
}