export interface APISuccessResponse<Type = any> {
  statusCode: number;
  method: string;
  message: string;
  data: Type;
}

export interface APIErrorResponse<Type = any> {
  statusCode: number;
  method: string;
  message: string;
  data: Type;
}

export interface APIServiceHandler<SuccessDataType = any, ErrorDataType = any> {
  data: APISuccessResponse<SuccessDataType> | null;
  error: APIErrorResponse<ErrorDataType> | null;
}
