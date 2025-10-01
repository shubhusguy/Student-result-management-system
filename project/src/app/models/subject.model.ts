export interface Subject {
  subject_id: number;
  subject_name: string;
  subject_code: string;
  max_marks: number;
  created_at?: string;
}

export interface CreateSubjectRequest {
  subject_name: string;
  subject_code: string;
  max_marks?: number;
}