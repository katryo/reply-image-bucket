import Head from 'next/head';
import NextLink from 'next/link';
import React, {useEffect, useContext} from 'react';
import {
  Heading,
  Button,
  Box,
  Center,
  Flex,
  Link as ChakraLink,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import {Auth} from 'aws-amplify';
import {CognitoHostedUIIdentityProvider} from '@aws-amplify/auth';
import {isUserInfo} from '../lib/user';
import {UserContext} from '../pages/_app';

const SignInModalWithTerms = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Sign in</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Do you want to sign in?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            If you use our services, you agree to abide by the{' '}
            <NextLink href="/terms" passHref>
              <ChakraLink color="blue">terms.</ChakraLink>
            </NextLink>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              isFullWidth
              onClick={() =>
                Auth.federatedSignIn({
                  provider: CognitoHostedUIIdentityProvider.Google,
                })
              }
            >
              Sign in with google
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const Layout = ({children}: {children: React.ReactChild}) => {
  const {userInfo, setUserInfo} = useContext(UserContext);
  useEffect(() => {
    (async () => {
      const userData = await Auth.currentAuthenticatedUser();
      const userInfo = isUserInfo(userData) ? userData : undefined;
      if (userInfo) {
        setUserInfo(userInfo);
      }
    })();
  }, []);
  return (
    <div>
      <Head>
        <title>Forget Meme Not</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Flex m={5}>
          <Heading as="h1" size="lg">
            <NextLink href="/">Forget Meme Not</NextLink>
          </Heading>
          <Flex ml={5}>
            <Center>
              {userInfo ? (
                <Button onClick={() => Auth.signOut()}>Sign Out</Button>
              ) : (
                <SignInModalWithTerms />
              )}
            </Center>
          </Flex>
        </Flex>
        {children}
      </Box>
    </div>
  );
};

export {Layout};
