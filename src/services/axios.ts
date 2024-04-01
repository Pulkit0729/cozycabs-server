const axios = require("axios").create();

export default async function makeRequest(url: String, method: any, body: any, headers: any) {
    return axios[method]((url = url), body, { headers });
  }
  