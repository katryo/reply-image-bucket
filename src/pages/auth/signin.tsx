import {Auth, Hub} from 'aws-amplify';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';

const SignIn = () => {
  const [IsSignInSuccess, setIsSignInSuccess] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    Hub.listen('auth', ({payload: {event, data}}) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then();
          break;
        case 'signOut':
          break;
        case 'signIn_failure':
          setIsSignInSuccess(false);
          break;
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => {
        router.push('/');
        return userData;
      })
      .catch(e => {
        setIsSignInSuccess(false);
        console.log(e);
      });
  }
  return (
    <div>
      {IsSignInSuccess ? 'Sign in success. Redirecting...' : 'Sign in failure'}
    </div>
  );
};

export default SignIn;
