const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/mydb", { useNewUrlParser: true });


const db = mongoose.connection;
db.once("open", function () {
    console.log('Connection is OK')
});

const userSchema = new Schema({
    name: String,
    gender: String,
    taskId: Number

});

const taskSchema = new Schema({
    _id: String,
    title: String,
    text: String,
    completed: Boolean,
    created: Date,
    updated: Boolean
});

/**
 * User collection
 */

//Create an insert user script

userSchema.statics.insertUsers = function () {
    
    const users = [  
        { name: 'D', gender: "male", taskId: 1 },
        { name: 'B', gender: "male", taskId: 2 },
        { name: 'A', gender: "female", taskId: 4 },
        { name: 'C', gender: "female", taskId: 3 }
    ];
    this.insertMany(users).then(users => {console.log('users are inserted')}).catch(console.log);
};

// Create update user's name script for given _id

userSchema.statics.updateUsers = function () {

    this.find().then(user => {

       this.findByIdAndUpdate(user.id, {$set: {name: user.name}}, function(err, doc) {
            if(err) console.log(err);
            console.log("users' names are updated");
        });
    });
};

//Create get all users script (retrieving only username) and sorted by username
userSchema.statics.sortUsers = function () {
    
    this.find()
    .sort({name: 1})
    .then(users => {
        //console.log(users);
        console.log("users are sorted by name")
    })
    .catch(console.log);
};


//Create a script that returns only female users

userSchema.statics.returnOnlyFemale = function () { 
    
    this.find({gender: "female"}).then(user => console.log(user));
};

/**
 * Task collection
 */

taskSchema.statics.insertTasks = function () {
    
    const tasks = [  
        { _id: 1, title: 'task1', text: 'todo1', completed: true, created: new Date(), updated: false },
        { _id: 2, title: 'task2', text: 'todo2', completed: true, created: new Date(), updated: false },
        { _id: 3, title: 'task3', text: 'todo3', completed: true, created: new Date(), updated: false }
    ];
    
    this.insertMany(tasks).then(task => {console.log('tasks are inserted')}).catch(console.log);
};

//Create a script to update all tasks completed = false

taskSchema.statics.updateCompleted = function () {
    this.updateMany( {completed: true} , {$set: {completed: false}} )
    .then (this.find())
    .then(console.log)
};

//Create a script to delete all completed: true tasks

taskSchema.statics.delCompletedTrueTasks = function () {

    this.deleteMany({completed: true})
    .then (this.find())
    .then(console.log)
};

const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);

//Create a script to get all tasks of user sorted by created date that are not completed.

User.find({}, function (err, users) {

    let notCompletedTasks = [];
    users.forEach(user => {
        Task.find({}, function (err, tasks) {
            tasks.forEach(task => {
                //console.log(user.taskId , +task._id, task.completed )
                if (user.taskId === +task._id && task.completed === false) {
                    notCompletedTasks.push(task);
                    //console.log("Not completed tasks []" , notCompletedTasks)
                }
            })
        })
    });
    return notCompletedTasks;
});

//User.returnOnlyFemale();
//User.insertUsers();
//User.updateUsers();
//User.sortUsers();

//Task.insertTasks();
//Task.updateCompleted();
//Task.find().then( task => console.log(task))

//Task.delCompletedTrueTasks();

