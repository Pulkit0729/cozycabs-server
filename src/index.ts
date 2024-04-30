import dotenv from "dotenv";
const cors = require("cors");

dotenv.config();

import connectMongoose from "./config/mongo.config";

import App from "./app";
import { startCron } from "./ride_cron";

connectMongoose(() => {
  let app = App();
  startCron();
  return app;
});
