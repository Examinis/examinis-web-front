export interface ExamCreate {
  title: string;
  instructions: string;
  // it is using snake case to match the API (otherwise, a 422 error will be thrown)
  subject_id: number;
  amount: number;
  // a list of question ids
  questions: number[];
}

export type ExamAutomaticCreate = Omit<ExamCreate, 'questions'>;

export type ExamManualCreate = Omit<ExamCreate, 'amount'>;
