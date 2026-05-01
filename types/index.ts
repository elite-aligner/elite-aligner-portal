export interface Case {
  id: string;
  patient_name: string;
  patient_age: number;
  case_type: string;
  description: string;
  treatment_duration: string;
  before_image_url: string | null;
  after_image_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  created_by: string;
  doctor_name: string;
}

export interface CaseFormData {
  patient_name: string;
  patient_age: number;
  case_type: string;
  description: string;
  treatment_duration: string;
  before_image: File | null;
  after_image: File | null;
}

export interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    role?: string;
  };
}
