

export type TypePerson = {
  id: number;
  name: string;
  lastname: string;
  email: string;
  document_number: number;
  password: string;
  created_at: Date;
};

export type TypeCourse = {
  id: number;
  student_id: number;
  subject_id: number;
  grade: number;
  Student?: TypeStudent[];
}

export type TypeSubject = {
  id: number;
  topic: string;
  description: string;
  monthly_cost: number | string;
  period: string;
  teacher_id?: number | string;
};

export enum PeriodEnum {
  first_semester,
  second_semester,
  annually
}

export type TypeTeacher = TypePerson & {
  
  Subject: Array<TypeSubject>;
};


export type TypeStudent = TypePerson & {
  Subjects: Array<TypeSubject>;
};

export type TypeAdmin = TypePerson;


type TypeItemProfile = {
  id: number;
  label: string;
};

export type TypeCardProfile = {
  imageSeed: string;
  title: string;
  subtitle?: string;
  description?: string;
  items?: Array<TypeItemProfile> | [];
};

export type TypePayment = {
  id: number;
  student_id: number;
  subject_id: number;
  price: number;
  created_at: string;
  Student?: TypeStudent;
  Subject?: TypeSubject;
}

export type TypeCardDashboard = {
  colorA: string;
  colorB: string;
  title: string;
  description?: string;
  url?: string;
  price?: string;
  topDetail?: string;
};