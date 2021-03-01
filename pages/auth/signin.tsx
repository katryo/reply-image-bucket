import Router from "next/router";
import { Auth, Hub } from "aws-amplify";
import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";

const SignIn = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
        case "cognitoHostedUI":
          getUser().then((userData) => setUser(userData));
          break;
        case "signOut":
          setUser(undefined);
          break;
        case "signIn_failure":
        case "cognitoHostedUI_failure":
          console.log("Sign in failure", data);
          break;
      }
    });

    getUser().then((userData) => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then((userData) => {
        console.log({ userData });
        return userData;
      })
      .catch(() => console.log("Not signed in"));
  }
  return (
    <div>
      <button onClick={getUser}>buttttton</button>Sign in
    </div>
  );
};

export default SignIn;
