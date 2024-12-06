var mongoose = require("mongoose");
var taskSchema = new mongoose.Schema({


});
module.exports = mongoose.model("Task", taskSchema);
/**
 * Now we have to create two new routers, 1 is for creating new tasks and another is for showing a specific task
 */
