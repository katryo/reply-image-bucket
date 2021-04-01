// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Image, Keyword, KeywordInfo } = initSchema(schema);

export {
  Image,
  Keyword,
  KeywordInfo
};