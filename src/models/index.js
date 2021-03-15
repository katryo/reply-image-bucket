// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Image, Keyword } = initSchema(schema);

export {
  Image,
  Keyword
};