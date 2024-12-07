var express = require("express");
var router = express.Router();
// router.get("/createTask", function (req, res) {
//   var newTask = new Task();
//   // save the task
//   newTask.save(function (err, data) {
//     if (err) {
//       console.log(err);
//       res.render("error");
//     } else {
//       res.redirect("/task/" + data._id);
//     }
//   });
// });
// mongoose does not use callback function now-->> we can now use async/ await or promise

router.get("/createTask", async function (req, res) {
  try {
    var newTask = new Task();
    // save the task using async/await
    const data = await newTask.save();
    res.redirect("/task/" + data._id);
  } catch (err) {
    console.log(err);
    res.render("error");
  }
});

router.get("/task/:id", async function (req, res) {
  try {
    const task = await Task.findOne({ _id: req.params.id });
    if (task) {
      res.render("task", { data: task, roomId : task._id});
    } else {
      res.render("error", { message: "Task not found" });
    }
  } catch (err) {
    console.log(err);
    res.render("error", {
      message: "An error occured while retrieving the page",
    });
  }
});
module.exports = router;
