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
  role: UserType;
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
  specialties?: string[];
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
  availableAt: string; // <--- ADICIONADO: Data e hora de disponibilidade da oferta (formato ISO string)
  caregiver?: CaregiverProfile; // Cuidador associado à oferta
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
  seniorId: number; // user.id do paciente/responsável
  patientName: string; // Nome do idoso/paciente no agendamento
  patientAge: number;  // Idade do idoso/paciente no agendamento
  address: string;     // Endereço do agendamento

  date: string; // Data do agendamento (YYYY-MM-DD)
  time: string; // Hora do agendamento (HH:mm)
  status: 'agendado' | 'concluido' | 'cancelado';
  notes?: string;
  createdAt?: string;

  serviceOfferId?: number; // <--- NOVO: ID da oferta de serviço que gerou o agendamento

  // Campos da ServiceOffer quando JOIN for feito nas queries de listagem do backend:
  serviceTitle?: string;
  serviceDescription?: string;
  serviceHourlyRate?: number;
  serviceLocation?: string;
  serviceAvailableAt?: string; // <--- NOVO: Data e hora original da oferta de serviço

  caregiver?: CaregiverProfile; // Perfil do cuidador
  senior?: User; // Perfil do usuário paciente/responsável
}