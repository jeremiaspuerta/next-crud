export type TypeSubject = {
  id: number;
  topic: string;
  description: string;
  cost: number;
  teacher_id: number;
};

export type TypePerson = {
  id: number;
  name: string;
  lastname: string;
  email: string;
  document_number: number;
  password: string;
  created_at: Date;
};

export type TypeTeacher = TypePerson & {
  Subject: Array<TypeSubject>;
};

export type TypeStudent = TypePerson;
