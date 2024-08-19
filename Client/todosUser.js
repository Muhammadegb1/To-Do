// client/todosUser.js
sessionStorage.clear();
const addButton = document.getElementById("addTask");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("tasklist");
const saveButton = document.getElementById("save");
const logoutButton = document.getElementById("logout");

// Get username and email from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const email = urlParams.get('email'); 

// Set the username and email in the HTML
document.getElementById('username').textContent = username;
document.getElementById('email').textContent = email;


sessionStorage.setItem("username",username);
sessionStorage.setItem("email",email);


document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
});


// Function to load todos from server
function loadTasks() {
    console.log("Loading tasks...");
    fetch(`${email}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data);
            if (data && data.length > 0) {
                console.log("Tasks found:", data);
                data.forEach(task => {
                    createTaskElement(task);
                });
            } else {
                console.log("No tasks found");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error loading tasks. Please try again later.");
            window.location.href = "/login";
        });
}


// Function to add a new task
function addTask() {
    const task = taskInput.value.trim();

    if (task) {
        createTaskElement(task);
        taskInput.value = ""; // Clear the input field
    } else {
        alert("Please enter a task!");
    }
}

// Event listener for adding a new task
addButton.addEventListener("click", addTask);

// Function to create a new task element
function createTaskElement(task) {
    const container = document.createElement("div"); 
    container.className = 'task-container';           

    const listItem = document.createElement("li");
    const taskText = document.createElement("span");
    taskText.textContent = task;
    listItem.appendChild(taskText);
    
    // Add the listItem to the container
    container.appendChild(listItem);
    
    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
        container.remove();  // Remove the entire container, not just the listItem
    });

    // Create update button
    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.addEventListener("click", function() {
        const newTask = prompt("Enter updated task:");
        if (newTask !== null && newTask.trim() !== "") {
            taskText.textContent = newTask;
        }
    });

    // Add buttons next to the listItem by appending them to the container
    container.appendChild(updateButton);
    container.appendChild(deleteButton);

    // Append the whole container to the taskList
    taskList.appendChild(container);
}

// Function to save todos to server
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(function(item) {
        const taskText = item.querySelector("span").textContent.trim(); 
        tasks.push(taskText);
    });
    
    fetch("/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, tasks: tasks })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
}


// Function to handle save button click
function handleSaveButtonClick() {
    saveTasks();
    alert("Tasks saved successfully!");
}

// Event listener for save button
saveButton.addEventListener("click", handleSaveButtonClick);

// Function to handle logout button click
function handleLogoutButtonClick() {
    fetch('/logout')
        .then(response => {
            if (response.redirected) {
                sessionStorage.clear();
                window.location.replace('/login');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Event listener for logout button
logoutButton.addEventListener("click", handleLogoutButtonClick);
