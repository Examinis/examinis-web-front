export interface ExamCreate {
  title: string;
  instructions: string;
  // it is using snake case to match the API (otherwise, a 422 error will be thrown)
  subject_id: number;
  amount: number;
}
