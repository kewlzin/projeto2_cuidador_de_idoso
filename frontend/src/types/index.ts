export enum UserType {
  SENIOR = 'idoso',
  CAREGIVER = 'cuidador',
  DOCTOR = 'medico'
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  type: UserType;
  createdAt: string;
}

export interface CaregiverProfile {
  id: number;
  userId: number;
  bio?: string;
  experienceYears?: number;
  certifications?: string[];
  verified: boolean;
  createdAt: string;
  user?: User;
  hourlyRate?: number;
  location?: string;
  specialties?: string[];
  availability?: string[];
}

export interface DoctorProfile {
  id: number;
  userId: number;
  crm: string;
  specialty?: string;
  institution?: string;
  documents?: string[];
  verified: boolean;
  createdAt: string;
  user?: User;
}

export interface ServiceOffer {
  id: number;
  caregiverId: number;
  title: string;
  description?: string;
  hourlyRate?: number;
  location?: string;
  active: boolean;
  createdAt: string;
  caregiver?: CaregiverProfile;
}

export interface ServiceRequest {
  id: number;
  serviceId: number;
  seniorId: number;
  requestDate: string;
  status: 'pendente' | 'aceito' | 'recusado' | 'concluido';
  service?: ServiceOffer;
  senior?: User;
}

export interface Address {
  id: number;
  userId: number;
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface MedicalNote {
  id: number;
  doctorId: number;
  seniorId: number;
  note: string;
  createdAt: string;
  doctor?: User;
  senior?: User;
}

export interface Appointment {
  id: number;
  caregiverId: number;
  seniorId: number;
  date: string;
  time: string;
  status: 'agendado' | 'concluido' | 'cancelado';
  notes?: string;
  caregiver?: CaregiverProfile;
  senior?: User;
}
