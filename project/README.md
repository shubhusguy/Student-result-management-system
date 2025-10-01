# Student Result Management System

A comprehensive Student Result Management System built with Angular, Express.js, and MySQL featuring advanced database operations including stored procedures, functions, and views.

## Features

### Core Functionality
- **Complete Student Management**: CRUD operations for student records
- **Subject Management**: Add, edit, and manage academic subjects
- **Result Entry System**: Automated grade calculation with stored procedures
- **Report Card Generation**: Comprehensive student performance reports
- **Performance Analytics**: Class averages, rankings, and statistical analysis

### Advanced Database Features
- **Stored Procedures**: 
  - `sp_AddResult()` - Adds results with automatic grade calculation
  - `sp_GenerateReportCard()` - Creates detailed student reports
  - `sp_GetClassAveragePerSubject()` - Calculates class performance metrics
- **Functions**:
  - `fn_CalculateGrade()` - Converts marks to letter grades
  - `fn_CalculateGPA()` - Computes student GPA
- **Views**:
  - `v_student_rankings` - Student ranking using RANK() function

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Interactive Dashboard**: Real-time performance metrics and visualizations
- **Modern UI**: Clean, professional design with smooth animations
- **Search & Filter**: Easy data discovery and management

## Technology Stack

- **Frontend**: Angular 20 with TypeScript
- **Backend**: Express.js with Node.js
- **Database**: MySQL with advanced SQL features
- **Styling**: Pure CSS with modern design principles

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Angular CLI

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd student-result-management-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up MySQL Database**:
   - Create a MySQL database named `student_results_db`
   - Import the SQL migration file from `supabase/migrations/20250724082455_polished_tree.sql`
   - Update database credentials in `.env` file

4. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Start the application**:
   ```bash
   npm run dev
   ```

This will start both the Express server (port 3001) and Angular development server (port 4200).

## Database Schema

### Tables
- **students**: Student information and demographics
- **subjects**: Academic subjects with grading criteria
- **results**: Student exam results and grades

### Key Database Features
- **Automatic Grade Calculation**: Grades are computed using SQL functions
- **GPA Calculation**: Real-time GPA computation with stored functions
- **Student Rankings**: Dynamic ranking using MySQL RANK() window function
- **Performance Analytics**: Class averages and statistical analysis

## API Endpoints

### Students
- `GET /api/students` - List all students
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/rankings/all` - Get student rankings

### Results
- `POST /api/results/add` - Add result using stored procedure
- `GET /api/results/report-card/:id` - Generate report card
- `GET /api/results/class-average/:class?` - Get class averages

### Subjects
- `GET /api/subjects` - List all subjects
- `POST /api/subjects` - Create new subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

## Usage

1. **Dashboard**: View overall system statistics and performance metrics
2. **Students**: Manage student records and view rankings
3. **Subjects**: Configure academic subjects and grading criteria
4. **Results**: Enter exam results with automatic grade calculation
5. **Reports**: Generate detailed performance reports and analytics

## Advanced Features

### Stored Procedures Usage
```sql
-- Add a result
CALL sp_AddResult(1, 'MATH101', 85, '2024-01-15', 'Regular');

-- Generate report card
CALL sp_GenerateReportCard(1);

-- Get class averages
CALL sp_GetClassAveragePerSubject('10');
```

### Grade Calculation
The system automatically calculates grades based on marks:
- A+: 90-100
- A: 80-89
- B+: 70-79
- B: 60-69
- C+: 50-59
- C: 40-49
- D: 33-39
- F: Below 33

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.