-- Student Result Management System Database Schema

CREATE DATABASE IF NOT EXISTS student_results_db;
USE student_results_db;

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    student_name VARCHAR(100) NOT NULL,
    class VARCHAR(20) NOT NULL,
    section VARCHAR(5) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(10) UNIQUE NOT NULL,
    max_marks INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Results Table
CREATE TABLE IF NOT EXISTS results (
    result_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    marks INT NOT NULL,
    grade VARCHAR(2),
    exam_date DATE,
    exam_type VARCHAR(50) DEFAULT 'Regular',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_subject (student_id, subject_id, exam_type)
);

-- Sample Data
INSERT INTO students (student_name, class, section, email, phone, date_of_birth) VALUES
('John Smith', '10', 'A', 'john.smith@email.com', '123-456-7890', '2008-05-15'),
('Emma Johnson', '10', 'A', 'emma.johnson@email.com', '123-456-7891', '2008-03-22'),
('Michael Brown', '10', 'A', 'michael.brown@email.com', '123-456-7892', '2008-07-10'),
('Sarah Davis', '10', 'B', 'sarah.davis@email.com', '123-456-7893', '2008-01-18'),
('David Wilson', '10', 'B', 'david.wilson@email.com', '123-456-7894', '2008-09-25');

INSERT INTO subjects (subject_name, subject_code, max_marks) VALUES
('Mathematics', 'MATH101', 100),
('English', 'ENG101', 100),
('Science', 'SCI101', 100),
('History', 'HIST101', 100),
('Geography', 'GEO101', 100);

-- Function to Calculate Grade
DELIMITER //
CREATE FUNCTION IF NOT EXISTS fn_CalculateGrade(marks INT) 
RETURNS VARCHAR(2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE grade VARCHAR(2);
    
    IF marks >= 90 THEN
        SET grade = 'A+';
    ELSEIF marks >= 80 THEN
        SET grade = 'A';
    ELSEIF marks >= 70 THEN
        SET grade = 'B+';
    ELSEIF marks >= 60 THEN
        SET grade = 'B';
    ELSEIF marks >= 50 THEN
        SET grade = 'C+';
    ELSEIF marks >= 40 THEN
        SET grade = 'C';
    ELSEIF marks >= 33 THEN
        SET grade = 'D';
    ELSE
        SET grade = 'F';
    END IF;
    
    RETURN grade;
END//
DELIMITER ;

-- Function to Calculate GPA
DELIMITER //
CREATE FUNCTION IF NOT EXISTS fn_CalculateGPA(student_id_param INT) 
RETURNS DECIMAL(3,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total_points DECIMAL(10,2) DEFAULT 0;
    DECLARE total_subjects INT DEFAULT 0;
    DECLARE gpa DECIMAL(3,2) DEFAULT 0;
    
    SELECT 
        SUM(
            CASE 
                WHEN marks >= 90 THEN 4.0
                WHEN marks >= 80 THEN 3.7
                WHEN marks >= 70 THEN 3.3
                WHEN marks >= 60 THEN 3.0
                WHEN marks >= 50 THEN 2.7
                WHEN marks >= 40 THEN 2.3
                WHEN marks >= 33 THEN 2.0
                ELSE 0.0
            END
        ),
        COUNT(*)
    INTO total_points, total_subjects
    FROM results 
    WHERE student_id = student_id_param;
    
    IF total_subjects > 0 THEN
        SET gpa = total_points / total_subjects;
    END IF;
    
    RETURN gpa;
END//
DELIMITER ;

-- Stored Procedure to Add Result
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_AddResult(
    IN p_student_id INT,
    IN p_subject_code VARCHAR(10),
    IN p_marks INT,
    IN p_exam_date DATE,
    IN p_exam_type VARCHAR(50)
)
BEGIN
    DECLARE v_subject_id INT;
    DECLARE v_grade VARCHAR(2);
    
    -- Get subject ID
    SELECT subject_id INTO v_subject_id 
    FROM subjects 
    WHERE subject_code = p_subject_code;
    
    -- Calculate grade
    SET v_grade = fn_CalculateGrade(p_marks);
    
    -- Insert or update result
    INSERT INTO results (student_id, subject_id, marks, grade, exam_date, exam_type)
    VALUES (p_student_id, v_subject_id, p_marks, v_grade, p_exam_date, p_exam_type)
    ON DUPLICATE KEY UPDATE 
        marks = p_marks,
        grade = v_grade,
        exam_date = p_exam_date,
        updated_at = CURRENT_TIMESTAMP;
        
    SELECT 'Result added/updated successfully' AS message;
END//
DELIMITER ;

-- Stored Procedure to Generate Report Card
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_GenerateReportCard(IN p_student_id INT)
BEGIN
    SELECT 
        s.student_name,
        s.class,
        s.section,
        sub.subject_name,
        sub.subject_code,
        r.marks,
        r.grade,
        sub.max_marks,
        r.exam_date,
        r.exam_type,
        fn_CalculateGPA(p_student_id) as gpa
    FROM students s
    JOIN results r ON s.student_id = r.student_id
    JOIN subjects sub ON r.subject_id = sub.subject_id
    WHERE s.student_id = p_student_id
    ORDER BY sub.subject_name;
END//
DELIMITER ;

-- Stored Procedure to Calculate Class Average per Subject
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_GetClassAveragePerSubject(IN p_class VARCHAR(20))
BEGIN
    SELECT 
        sub.subject_name,
        sub.subject_code,
        ROUND(AVG(r.marks), 2) as average_marks,
        COUNT(r.student_id) as total_students,
        MAX(r.marks) as highest_marks,
        MIN(r.marks) as lowest_marks
    FROM subjects sub
    LEFT JOIN results r ON sub.subject_id = r.subject_id
    LEFT JOIN students s ON r.student_id = s.student_id
    WHERE s.class = p_class OR p_class IS NULL
    GROUP BY sub.subject_id, sub.subject_name, sub.subject_code
    ORDER BY sub.subject_name;
END//
DELIMITER ;

-- View for Student Rankings
CREATE OR REPLACE VIEW v_student_rankings AS
SELECT 
    s.student_id,
    s.student_name,
    s.class,
    s.section,
    ROUND(AVG(r.marks), 2) as average_marks,
    fn_CalculateGPA(s.student_id) as gpa,
    RANK() OVER (PARTITION BY s.class ORDER BY AVG(r.marks) DESC) as class_rank,
    RANK() OVER (ORDER BY AVG(r.marks) DESC) as overall_rank
FROM students s
LEFT JOIN results r ON s.student_id = r.student_id
GROUP BY s.student_id, s.student_name, s.class, s.section;

-- Sample Results Data
INSERT INTO results (student_id, subject_id, marks, grade, exam_date, exam_type) VALUES
(1, 1, 85, fn_CalculateGrade(85), '2024-01-15', 'Regular'),
(1, 2, 92, fn_CalculateGrade(92), '2024-01-16', 'Regular'),
(1, 3, 78, fn_CalculateGrade(78), '2024-01-17', 'Regular'),
(1, 4, 88, fn_CalculateGrade(88), '2024-01-18', 'Regular'),
(1, 5, 91, fn_CalculateGrade(91), '2024-01-19', 'Regular'),

(2, 1, 76, fn_CalculateGrade(76), '2024-01-15', 'Regular'),
(2, 2, 84, fn_CalculateGrade(84), '2024-01-16', 'Regular'),
(2, 3, 89, fn_CalculateGrade(89), '2024-01-17', 'Regular'),
(2, 4, 82, fn_CalculateGrade(82), '2024-01-18', 'Regular'),
(2, 5, 87, fn_CalculateGrade(87), '2024-01-19', 'Regular'),

(3, 1, 94, fn_CalculateGrade(94), '2024-01-15', 'Regular'),
(3, 2, 88, fn_CalculateGrade(88), '2024-01-16', 'Regular'),
(3, 3, 91, fn_CalculateGrade(91), '2024-01-17', 'Regular'),
(3, 4, 85, fn_CalculateGrade(85), '2024-01-18', 'Regular'),
(3, 5, 93, fn_CalculateGrade(93), '2024-01-19', 'Regular');