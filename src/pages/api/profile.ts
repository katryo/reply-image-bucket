import Amplify, {withSSRContext} from 'aws-amplify';
import {NextApiRequest, NextApiResponse} from 'next';

const AWS_CONFIG = process.env.NEXT_PUBLIC_AWS_CONFIG;
const awsConfigStr = Buffer.from(AWS_CONFIG ?? '', 'base64').toString('utf8');
const config = JSON.parse(awsConfigStr);

// Amplify SSR configuration needs to be done within each API route
Amplify.configure({...config, ssr: true});
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {Auth} = withSSRContext({req});

  let user;
  try {
    user = await Auth.currentAuthenticatedUser();
    console.log('user is authenticated');
    // fetch some data and assign it to the data variable
  } catch (err) {
    console.log('error: no authenticated user');
  }

  res.statusCode = 200;
  res.json({
    user: user ? user : undefined,
  });
};
