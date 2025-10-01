import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResultService } from '../../services/result.service';
import { StudentService } from '../../services/student.service';
import { StudentRanking } from '../../models/student.model';
import { ClassAverage } from '../../models/result.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-container">
      <div class="page-header">
        <h1>Performance Reports & Analytics</h1>
      </div>

      <div class="reports-grid">
        <!-- Student Rankings Report -->
        <div class="report-card">
          <h2>Student Rankings</h2>
          <div class="filter-section">
            <select [(ngModel)]="selectedClass" (change)="filterRankings()" class="form-control">
              <option value="">All Classes</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>
          
          <div class="rankings-list">
            <div *ngFor="let student of filteredRankings; let i = index" 
                 class="ranking-item" 
                 [class.top-performer]="student.overall_rank <= 3">
              <div class="rank-badge" [class]="getRankClass(student.overall_rank)">
                {{ student.overall_rank }}
              </div>
              <div class="student-info">
                <h3>{{ student.student_name }}</h3>
                <p>{{ student.class }}-{{ student.section }}</p>
              </div>
              <div class="performance-metrics">
                <div class="metric">
                  <span class="label">Average</span>
                  <span class="value">{{ student.average_marks | number:'1.1-1' }}%</span>
                </div>
                <div class="metric">
                  <span class="label">GPA</span>
                  <span class="value">{{ student.gpa | number:'1.2-2' }}</span>
                </div>
                <div class="metric">
                  <span class="label">Class Rank</span>
                  <span class="value">#{{ student.class_rank }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Subject Performance Report -->
        <div class="report-card">
          <h2>Subject Performance</h2>
          <div class="filter-section">
            <select [(ngModel)]="selectedClassForAverage" (change)="loadClassAverages()" class="form-control">
              <option value="">All Classes</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>

          <div class="subject-performance">
            <div *ngFor="let subject of classAverages" class="subject-item">
              <div class="subject-header">
                <h3>{{ subject.subject_name }}</h3>
                <span class="subject-code">{{ subject.subject_code }}</span>
              </div>
              
              <div class="performance-bar">
                <div class="bar-container">
                  <div class="progress-bar">
                    <div class="progress-fill" 
                         [style.width.%]="subject.average_marks"
                         [class]="getPerformanceClass(subject.average_marks)"></div>
                  </div>
                  <span class="percentage">{{ subject.average_marks | number:'1.1-1' }}%</span>
                </div>
              </div>

              <div class="subject-stats">
                <div class="stat">
                  <span class="stat-label">Students</span>
                  <span class="stat-value">{{ subject.total_students }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Highest</span>
                  <span class="stat-value">{{ subject.highest_marks }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Lowest</span>
                  <span class="stat-value">{{ subject.lowest_marks }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Summary -->
      <div class="summary-section">
        <h2>Performance Summary</h2>
        <div class="summary-cards">
          <div class="summary-card">
            <div class="summary-icon">📊</div>
            <div class="summary-content">
              <h3>{{ overallStats.totalStudents }}</h3>
              <p>Total Students</p>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="summary-icon">🎯</div>
            <div class="summary-content">
              <h3>{{ overallStats.averageGPA | number:'1.2-2' }}</h3>
              <p>Average GPA</p>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="summary-icon">📈</div>
            <div class="summary-content">
              <h3>{{ overallStats.highPerformers }}</h3>
              <p>High Performers (GPA > 3.5)</p>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="summary-icon">📚</div>
            <div class="summary-content">
              <h3>{{ overallStats.totalSubjects }}</h3>
              <p>Total Subjects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      color: #1e40af;
      font-size: 2.5rem;
      margin: 0;
    }

    .reports-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    .report-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .report-card h2 {
      color: #1e40af;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .filter-section {
      margin-bottom: 20px;
    }

    .form-control {
      padding: 8px 12px;
      border: 2px solid #e5e7eb;
      border-radius: 6px;
      font-size: 0.9rem;
      max-width: 200px;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .rankings-list {
      max-height: 500px;
      overflow-y: auto;
    }

    .ranking-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 12px;
      background: #f8fafc;
      transition: all 0.2s ease;
    }

    .ranking-item:hover {
      background: #e2e8f0;
      transform: translateY(-1px);
    }

    .ranking-item.top-performer {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border: 2px solid #f59e0b;
    }

    .rank-badge {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: white;
      font-size: 1.1rem;
    }

    .rank-badge.gold {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
    }

    .rank-badge.silver {
      background: linear-gradient(135deg, #9ca3af, #6b7280);
    }

    .rank-badge.bronze {
      background: linear-gradient(135deg, #cd7c2e, #92400e);
    }

    .rank-badge.regular {
      background: linear-gradient(135deg, #6b7280, #4b5563);
    }

    .student-info {
      flex: 1;
    }

    .student-info h3 {
      margin: 0 0 4px 0;
      color: #1e40af;
      font-size: 1.1rem;
    }

    .student-info p {
      margin: 0;
      color: #6b7280;
      font-size: 0.9rem;
    }

    .performance-metrics {
      display: flex;
      gap: 16px;
    }

    .metric {
      text-align: center;
    }

    .metric .label {
      display: block;
      font-size: 0.8rem;
      color: #6b7280;
      margin-bottom: 2px;
    }

    .metric .value {
      display: block;
      font-weight: 700;
      color: #1e40af;
      font-size: 1rem;
    }

    .subject-performance {
      max-height: 500px;
      overflow-y: auto;
    }

    .subject-item {
      margin-bottom: 24px;
      padding: 16px;
      border-radius: 8px;
      background: #f8fafc;
    }

    .subject-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .subject-header h3 {
      margin: 0;
      color: #1e40af;
      font-size: 1.1rem;
    }

    .subject-code {
      background: #3b82f6;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .performance-bar {
      margin-bottom: 12px;
    }

    .bar-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .progress-bar {
      flex: 1;
      height: 20px;
      background: #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      transition: width 0.5s ease;
    }

    .progress-fill.excellent {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    .progress-fill.good {
      background: linear-gradient(90deg, #3b82f6, #2563eb);
    }

    .progress-fill.average {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }

    .progress-fill.poor {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }

    .percentage {
      font-weight: 700;
      color: #1e40af;
      min-width: 50px;
    }

    .subject-stats {
      display: flex;
      gap: 16px;
    }

    .stat {
      text-align: center;
    }

    .stat-label {
      display: block;
      font-size: 0.8rem;
      color: #6b7280;
      margin-bottom: 2px;
    }

    .stat-value {
      display: block;
      font-weight: 600;
      color: #374151;
    }

    .summary-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .summary-section h2 {
      color: #1e40af;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .summary-card {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: transform 0.2s ease;
    }

    .summary-card:hover {
      transform: translateY(-2px);
    }

    .summary-icon {
      font-size: 2.5rem;
      background: white;
      padding: 12px;
      border-radius: 50%;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .summary-content h3 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e40af;
      margin: 0 0 4px 0;
    }

    .summary-content p {
      color: #6b7280;
      margin: 0;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .reports-grid {
        grid-template-columns: 1fr;
      }

      .performance-metrics {
        flex-direction: column;
        gap: 8px;
      }

      .summary-cards {
        grid-template-columns: 1fr;
      }

      .ranking-item {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      .performance-metrics {
        flex-direction: row;
        justify-content: center;
      }
    }
  `]
})
export class ReportsComponent implements OnInit {
  studentRankings: StudentRanking[] = [];
  filteredRankings: StudentRanking[] = [];
  classAverages: ClassAverage[] = [];
  selectedClass = '';
  selectedClassForAverage = '';

  overallStats = {
    totalStudents: 0,
    averageGPA: 0,
    highPerformers: 0,
    totalSubjects: 0
  };

  constructor(
    private studentService: StudentService,
    private resultService: ResultService
  ) {}

  ngOnInit() {
    this.loadReportsData();
  }

  loadReportsData() {
    this.loadStudentRankings();
    this.loadClassAverages();
  }

  loadStudentRankings() {
    this.studentService.getStudentRankings().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.studentRankings = response.data;
          this.filteredRankings = [...this.studentRankings];
          this.calculateOverallStats();
        }
      },
      error: (error) => console.error('Error loading rankings:', error)
    });
  }

  loadClassAverages() {
    const className = this.selectedClassForAverage || undefined;
    this.resultService.getClassAverage(className).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.classAverages = response.data;
          this.overallStats.totalSubjects = this.classAverages.length;
        }
      },
      error: (error) => console.error('Error loading class averages:', error)
    });
  }

  filterRankings() {
    if (!this.selectedClass) {
      this.filteredRankings = [...this.studentRankings];
    } else {
      this.filteredRankings = this.studentRankings.filter(
        student => student.class === this.selectedClass
      );
    }
  }

  calculateOverallStats() {
    this.overallStats.totalStudents = this.studentRankings.length;
    
    if (this.studentRankings.length > 0) {
      this.overallStats.averageGPA = this.studentRankings.reduce(
        (sum, student) => sum + student.gpa, 0
      ) / this.studentRankings.length;
      
      this.overallStats.highPerformers = this.studentRankings.filter(
        student => student.gpa > 3.5
      ).length;
    }
  }

  getRankClass(rank: number): string {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return 'regular';
  }

  getPerformanceClass(average: number): string {
    if (average >= 85) return 'excellent';
    if (average >= 70) return 'good';
    if (average >= 50) return 'average';
    return 'poor';
  }
}