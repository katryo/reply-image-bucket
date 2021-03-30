import {useRouter} from 'next/router';
import {useEffect} from 'react';

const SignIn = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, []);

  return <div>Signed out</div>;
};

export default SignIn;
