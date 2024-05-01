import dotenv from "dotenv";
const cors = require("cors");

dotenv.config();

import connectMongoose from "./config/mongo.config";

import App from "./app";
import { startCron } from "./ride_cron";
import { imap } from "./services/imap";

connectMongoose(() => {
  let app = App();
  startCron();
  imap.connect();
  return app;
});
