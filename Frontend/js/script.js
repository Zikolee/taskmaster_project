document.addEventListener("DOMContentLoaded", () => {
const apiUrl = "http://192.168.1.121:5000/"; // Replace with backend URL if deployed


// Utility: Handle API requests
const apiRequest = async (endpoint, method, body = null, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
    const data = await response.json();
    if (response.status === 401) {
      throw new Error(`Unauthorized, ${data.message}`);
    }
    if(response.status== 403){
      window.location.href = "index.html"
    }
    if (!response.ok) throw new Error(data.message || "API Error");
    return data;
  } catch (error) {
    console.error("API Request Error:", error.message);
    throw error;
  }
};

// Show login or signup form dynamically
const showForm = (type) => {
 type == "login" ? window.location.href ="signin.html" :  window.location.href="signup.html"
};

// Event listeners for login and signup buttons
document.getElementById("loginBtn").addEventListener("click", () => showForm("login"));
document.getElementById("signupBtn").addEventListener("click", () => showForm("signup"));

// Sign Up Form Handler
document.querySelector('#signup-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fullName = e.target.fullName.value;
  const username = e.target.username.value;
  const password = e.target.password.value;

  try {
    const response = await fetch(`${apiUrl}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, username, password })
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      window.location.href = 'signin.html';
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred. Please try again.');
  }
});

// Sign In Form Handler
document.querySelector('#signin-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;

  try {
    const response = await fetch(`${apiUrl}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
      alert('Login successful');
      localStorage.setItem('token', data.token);
      window.location.href = 'task.html'; // Replace with dashboard page
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred. Please try again.');
  }
});

// Fetch and Display Tasks
const fetchTasks = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You are not logged in. Redirecting to login page.");
    showForm("login");
    return;
  }

  try {
    const tasks = await apiRequest("/tasks", "GET", null, token);
    renderTasks(tasks);
  
  } catch (error) {
   
    // alert(`Failed to load tasks: ${error.message}`);
  }
};

// Render tasks based on search and filter
const renderTasks = (tasks) => {
  const searchQuery = document.getElementById("search-input").value.toLowerCase();
  const selectedPriority = document.getElementById("filter-priority").value;
  const taskList = document.getElementById("task-list");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery) ||
      task.description.toLowerCase().includes(searchQuery);
    const matchesPriority =
      selectedPriority === "all" || task.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  taskList.innerHTML = filteredTasks
    .map(
      (task) => ` 
    <div class="task">
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <small>Priority: ${task.priority}</small>
      <small>Deadline: ${new Date(task.deadline).toLocaleDateString()}</small>
      <button onclick="deleteTask('${task._id}')">Delete</button>
    </div>
  `
    )
    .join("");
};

// Add Task
const taskForm = document.getElementById("task-form");
taskForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("token");
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const priority = document.getElementById("task-priority").value;
  const deadline = document.getElementById("task-deadline").value;

  try {
    await apiRequest("/tasks", "POST", { title, description, priority, deadline }, token);
    alert("Task added successfully!");
    document.getElementById('task-section').style.display = "block";
    document.getElementById('add-task-section').style.display = "none";
    fetchTasks();

    taskForm.reset();
  } catch (error) {
    alert(`Failed to add task: ${error.message}`);
  }
});

// Delete Task
window.deleteTask = async (taskId) => {
  if (!confirm("Are you sure you want to delete this task?")) {
    return;
  }
  const token = localStorage.getItem("token");
  try {
    await apiRequest(`/tasks/${taskId}`, "DELETE", null, token);
    alert("Task deleted successfully!");
    fetchTasks();
  } catch (error) {
    alert(`Failed to delete task: ${error.message}`);
  }
};

// Load tasks on the tasks page
if (document.getElementById("task-list")) {
  fetchTasks();
}

// Event listeners for search and filter
document.getElementById("search-input").addEventListener("input", fetchTasks);
document.getElementById("filter-priority").addEventListener("change", fetchTasks);

// Logout function
document.getElementById("logoutBtn").addEventListener("click", () => {
  if(!confirm("Are You sure you want to logout?")){
    return;
  }
  localStorage.removeItem("token"); // Remove the token from localStorage
  window.location.href = "signin.html"; // Redirect to login page
});

});

function addTask() {
document.getElementById('task-section').style.display = "none";
document.getElementById('add-task-section').removeAttribute('class');
}