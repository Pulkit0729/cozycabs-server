import dotenv from 'dotenv';

dotenv.config();

import connectMongoose from './config/mongo.config';

import App from './app';
import { startCron } from './rideCron';

connectMongoose(() => {
  const app = App();
  startCron();
  // connect();
  return app;
});
