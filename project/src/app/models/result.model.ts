export interface Result {
  result_id?: number;
  student_id: number;
  subject_id?: number;
  subject_code: string;
  subject_name?: string;
  marks: number;
  grade?: string;
  exam_date?: string;
  exam_type?: string;
  max_marks?: number;
}

export interface ReportCard {
  student_name: string;
  class: string;
  section: string;
  subject_name: string;
  subject_code: string;
  marks: number;
  grade: string;
  max_marks: number;
  exam_date: string;
  exam_type: string;
  gpa: number;
}

export interface ClassAverage {
  subject_name: string;
  subject_code: string;
  average_marks: number;
  total_students: number;
  highest_marks: number;
  lowest_marks: number;
}

export interface AddResultRequest {
  student_id: number;
  subject_code: string;
  marks: number;
  exam_date?: string;
  exam_type?: string;
}