import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="app-container">
      <nav class="sidebar">
        <div class="logo">
          <h2>📊 SRMS</h2>
          <p>Student Result Management</p>
        </div>
        
        <ul class="nav-menu">
          <li>
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">🏠</span>
              Dashboard
            </a>
          </li>
          <li>
            <a routerLink="/students" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">👥</span>
              Students
            </a>
          </li>
          <li>
            <a routerLink="/subjects" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">📚</span>
              Subjects
            </a>
          </li>
          <li>
            <a routerLink="/results" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">📝</span>
              Results
            </a>
          </li>
          <li>
            <a routerLink="/reports" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">📊</span>
              Reports
            </a>
          </li>
        </ul>
      </nav>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
      background: #f1f5f9;
    }

    .sidebar {
      width: 250px;
      background: linear-gradient(180deg, #1e40af, #1d4ed8);
      color: white;
      padding: 24px 0;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
    }

    .logo {
      padding: 0 24px 32px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      text-align: center;
    }

    .logo h2 {
      margin: 0 0 8px 0;
      font-size: 1.8rem;
      font-weight: 700;
    }

    .logo p {
      margin: 0;
      font-size: 0.85rem;
      opacity: 0.9;
    }

    .nav-menu {
      list-style: none;
      padding: 24px 0 0 0;
      margin: 0;
    }

    .nav-menu li {
      margin-bottom: 4px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      transition: all 0.2s ease;
      border-right: 3px solid transparent;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-link.active {
      background: rgba(255, 255, 255, 0.15);
      border-right-color: #fbbf24;
      color: white;
    }

    .nav-icon {
      font-size: 1.2rem;
      width: 24px;
      text-align: center;
    }

    .main-content {
      flex: 1;
      margin-left: 250px;
      min-height: 100vh;
      overflow-x: auto;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
      
      .main-content {
        margin-left: 0;
      }
      
      .sidebar.open {
        transform: translateX(0);
      }
    }
  `]
})
export class AppComponent {
  title = 'Student Result Management System';
}