import dotenv from "dotenv";
const cors = require("cors");

dotenv.config();

import connectMongoose from "./config/mongo.config";

import App from "./app";
import { startCron } from "./rideCron";
import connect from "./services/imap";

connectMongoose(() => {
  let app = App();
  startCron();
  // connect();
  return app;
});
