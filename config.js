"use strict";
// transporter -->> primary method to create a transporter that can send emails.
module.exports = {
  mailer: {
    service: "gmail",
    auth: {
      user: "loneahsaan135@gmail.com",
      pass: "afpixhqgyzsoyljl",
    },
  },
  dbConnstring: "mongodb://127.0.0.1:27017/codeshare",
  sessionKey: "HaloCode4Share",
};
// creating a connection string to the database
