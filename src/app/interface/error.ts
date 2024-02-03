// Update the TErrorSources type
export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TGenericErrorResponse = {
  success: boolean;
  statusCode: number;
  message: string;

  errorSources: TErrorSources;
  errorDetails: {
    name: string;
    message: string;
  };
  stack: string | null; // Include stack in the type
};
