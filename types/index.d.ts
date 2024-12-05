interface ServerActionError {
  message: string;
  data?: any;
}

interface ServerActionResponse<T> {
  data?: T;
  error?: ServerActionError;
}
