export interface ApiError {
    detail: Array<{
      loc: Array<string | number>;
      msg: string;
      type: string;
    }>;
  }