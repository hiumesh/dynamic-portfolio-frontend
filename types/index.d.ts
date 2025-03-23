interface ServerActionError {
  message: string;
  data?: any;
}

interface ServerActionResponse<T> {
  data?: T;
  error?: ServerActionError;
}

type MarginValue = `${number}${"px" | "%"}`;
type MarginType =
  | MarginValue
  | `${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;
