var express = require("express");
var router = express.Router();


router.get("/video", async function (req, res) {
  try {
    // save the task using async/await
    const roomId =  Math.floor(10000 + Math.random() * 90000);
    res.render("video",{roomId:roomId});
  } catch (err) {
    console.log(err);
    res.render("error");
  }
});
module.exports = router;
