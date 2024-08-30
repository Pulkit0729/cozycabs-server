import dotenv from 'dotenv';

dotenv.config();

import connectMongoose from './config/mongo.config';

import App from './app';
import { startCron } from './rideCron';
import connectToMailbox from './services/external/imap';
import { NodeEnv } from './utils/constants';

connectMongoose(() => {
  const app = App();
  startCron();
  if (process.env.NODE_ENV === NodeEnv.production) {
    connectToMailbox();
  }
  return app;
});
