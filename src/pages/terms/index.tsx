import * as React from 'react';
import {Box, Heading, Text} from '@chakra-ui/react';
import {Layout} from '../../components/Layout';

const Terms = () => {
  return (
    <Layout>
      <Box m={5}>
        <Box maxWidth={['25em', '30em', '40em']} ml="auto" mr="auto">
          <Heading as="h2">Terms of Use</Heading>
          <Text>Last updated: April 4, 2021</Text>

          <Text mt={5}>
            Please read these Terms of Use ("Terms", "Terms of Use") carefully
            before using the Forget Meme Not (the "Service") operated by Ryo
            Kato ("us", "we", or "our").
          </Text>
          <Text mt={5}>
            Your access to and use of the Service is conditioned on your
            acceptance of and compliance with these Terms. These Terms apply to
            all visitors, users and others who access or use the Service.
          </Text>
          <Text mt={5}>
            By accessing or using the Service you agree to be bound by these
            Terms. If you disagree with any part of the terms then you may not
            access the Service.
          </Text>
          <Text mt={5}>
            We may terminate or suspend access to our Service immediately,
            without prior notice or liability, for any reason whatsoever,
            including without limitation if you breach the Terms.
          </Text>
          <Text mt={5}>
            All provisions of the Terms which by their nature should survive
            termination shall survive termination, including, without
            limitation, ownership provisions, warranty disclaimers, indemnity
            and limitations of liability.
          </Text>

          <Text mt={5}>
            Content Our Service allows you to post images and keywords
            ("Content"). You are responsible for everything you post. You must
            not post illegal contents.
          </Text>
          <Text mt={5}>
            Our Service may contain links to third-party web sites or services
            that are not owned or controlled by Ryo Kato. Ryo Kato​ has no
            control over, and assumes no responsibility for, the content,
            privacy policies, or practices of any third party web sites or
            services. You further acknowledge and agree that Ryo Kato​ shall not
            be responsible or liable, directly or indirectly, for any damage or
            loss caused or alleged to be caused by or in connection with use of
            or reliance on any such content, goods or services available on or
            through any such web sites or services.
          </Text>

          <Text mt={5}>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material we will try to
            provide notice prior to any new terms taking effect. What
            constitutes a material change will be determined at our sole
            discretion.
          </Text>
        </Box>
      </Box>
    </Layout>
  );
};

export default Terms;
