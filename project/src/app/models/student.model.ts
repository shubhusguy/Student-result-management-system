export interface Student {
  student_id: number;
  student_name: string;
  class: string;
  section: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudentRanking extends Student {
  average_marks: number;
  gpa: number;
  class_rank: number;
  overall_rank: number;
}

export interface CreateStudentRequest {
  student_name: string;
  class: string;
  section: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
}