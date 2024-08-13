import dotenv from "dotenv";
const cors = require("cors");

dotenv.config();

import connectMongoose from "./config/mongo.config";

import App from "./app";
import { startCron } from "./ride_cron";
import connect from "./services/imap";
import { startRideNotifCron } from "./rideNotifCron";

connectMongoose(() => {
  let app = App();
  startCron();
  startRideNotifCron();
  connect();
  return app;
});
