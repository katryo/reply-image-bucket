import '../../styles/globals.css';
import React, {createContext, useState} from 'react';
import type {AppProps} from 'next/app';
import {ChakraProvider} from '@chakra-ui/react';
import Amplify from 'aws-amplify';
import {UserInfo} from '../lib/user';

interface UserInfoContextType {
  userInfo: UserInfo;
  setUserInfo: (val: UserInfo) => void;
}

export const UserContext = createContext<UserInfoContextType | undefined>(
  undefined
);

const AWS_CONFIG = process.env.NEXT_PUBLIC_AWS_CONFIG;
const awsConfigStr = Buffer.from(AWS_CONFIG, 'base64').toString('utf8');
const awsConfig = JSON.parse(awsConfigStr);

const isLocalhost =
  'browser' in process
    ? Boolean(
        window.location.hostname === 'localhost' ||
          // [::1] is the IPv6 localhost address.
          window.location.hostname === '[::1]' ||
          // 127.0.0.1/8 is considered localhost for IPv4.
          window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
          )
      )
    : false;

const [
  localRedirectSignIn,
  productionRedirectSignIn,
] = awsConfig.oauth.redirectSignIn.split(',');

const [
  localRedirectSignOut,
  productionRedirectSignOut,
] = awsConfig.oauth.redirectSignOut.split(',');

const updatedAwsConfig = {
  ...awsConfig,
  oauth: {
    ...awsConfig.oauth,
    redirectSignIn: isLocalhost
      ? localRedirectSignIn
      : productionRedirectSignIn,
    redirectSignOut: isLocalhost
      ? localRedirectSignOut
      : productionRedirectSignOut,
  },
  ssr: true,
};

Amplify.configure(updatedAwsConfig);

function MyApp({Component, pageProps}: AppProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>(undefined);
  return (
    <UserContext.Provider value={{userInfo, setUserInfo}}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </UserContext.Provider>
  );
}

export default MyApp;
