export interface RegisterUser {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    institution?: string;
    identity_proof: File;
  }