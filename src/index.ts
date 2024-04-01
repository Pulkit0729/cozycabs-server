import dotenv from "dotenv";
const cors = require("cors");

dotenv.config();

import connectMongoose from "./config/mongo.config";

import App from "./app";

connectMongoose(() => {
  let app = App();
  return app;
});
