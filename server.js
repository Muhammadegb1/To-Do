// server.js

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const validateFunc = require("./Client/validateFunc.js");

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// Serve static files from the 'Client' directory
app.use(express.static(path.join(__dirname, 'Client')));

// Function to read users from JSON file
function readUsers() {
    try {
        const data = fs.readFileSync("users.json");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Function to save users to JSON file
function saveUsers(users) {
    fs.writeFileSync("users.json", JSON.stringify(users));
}

// Register get
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/Client/RegisterUser.html'));
});

// Handle POST requests to /register
app.post("/register", (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const repeatPassword = req.body.repeatPassword;
    let _validate = new validateFunc();
    _validate.Validate_password(res,password,repeatPassword);
    // Read existing users from file
    let users = readUsers();

    // Check if email is already registered
    _validate.Validate_email(res,users,email);

    // Add new user
    users.push({ email, username, password });

    // Save updated user list to file
    saveUsers(users);

    // Create a JSON file for user's tasks
    fs.writeFileSync(`${email}.json`, JSON.stringify([]));

    // Redirect to login page after successful registration
    res.redirect('/login');
});

// Login get
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/Client/LoginUser.html'));
});

// Handle POST requests to /login
app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Read existing users from file
    let users = readUsers();

    // Check if email exists in the database
    const user = users.find(user => user.email === email);
    let _validate = new validateFunc();
    _validate.Validate_email_In_DATA(res,user,password);

    // Send a response if login is successful
    res.redirect(`/todos?email=${user.email}&username=${user.username}`);
});

// Todos get
app.get('/todos', (req, res) => {
    res.sendFile(path.join(__dirname, '/Client/todosUser.html'));
});

// Handle POST requests to save todos
app.post("/todos", (req, res) => {
    const email = req.body.email;
    const tasks = req.body.tasks;
    saveTasks(email, tasks);
    res.send({ message: "Todos saved successfully!" });
});

// Handle task deletion
app.post("/delete-task", (req, res) => {
    const email = req.body.email;
    const taskIndex = req.body.taskIndex;
    deleteTask(email, taskIndex);
    res.send({ message: "Task deleted successfully!" });
});

// Handle logout request
app.get('/logout', (req, res) => {
    res.clearCookie("auth_token"); // ניקוי ה-cookie
    res.redirect('/login');
});


// Endpoint to serve JSON file based on email
app.get('/:email.json', (req, res) => {
    const email = req.params.email;
    fs.readFile(`${email}.json`, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    });
  });
  

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

// Function to read tasks for a user from JSON file
function readTasks(email) {
    try {
        const data = fs.readFileSync(`${email}.json`);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Function to save tasks for a user to JSON file
function saveTasks(email, tasks) {
    fs.writeFileSync(`${email}.json`, JSON.stringify(tasks));
}

// Function to delete a task for a user from JSON file
function deleteTask(email, taskIndex) {
    const tasks = readTasks(email);
    tasks.splice(taskIndex, 1);
    saveTasks(email, tasks);
}
