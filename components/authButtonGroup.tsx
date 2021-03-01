import { signIn, signOut, useSession } from "next-auth/client";
import { Button, ButtonGroup } from "@chakra-ui/react";

export const AuthButtonGroup = () => {
  const [session, loading] = useSession();
  return (
    <ButtonGroup>
      {!session && (
        <Button
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
          isLoading={loading}
        >
          signin
        </Button>
      )}
      {session && (
        <div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            signout
          </Button>
        </div>
      )}
    </ButtonGroup>
  );
};
