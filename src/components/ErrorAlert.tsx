import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
export const ErrorAlert = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>{errorMessage}</AlertTitle>
    </Alert>
  );
};
