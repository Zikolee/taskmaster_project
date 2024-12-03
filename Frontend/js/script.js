const apiUrl = "/auth"; // Replace with backend URL if deployed

// Sign-Up Form Handler
document.querySelector('#signup-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;

  try {
    const response = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Registration successful! Please log in.');
      window.location.href = 'signin.html'; // Redirect to sign-in page
    } else {
      alert(data.error || 'Failed to register.');
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred. Please try again.');
  }
});

// Sign-In Form Handler
document.querySelector('#signin-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;

  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Login successful');
      localStorage.setItem('token', data.token); // Save the token
      window.location.href = 'task.html'; // Redirect to TaskMaster area
    } else {
      alert(data.error || 'Invalid login credentials.');
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred. Please try again.');
  }
});

// // Task Page Handler
// document.querySelector('#fetch-tasks')?.addEventListener('click', async () => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     alert('You are not logged in. Redirecting to login...');
//     window.location.href = 'signin.html';
//     return;
//   }

//   try {
//     const response = await fetch('/tasks', {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (response.ok) {
//       const tasks = await response.json();
//       const taskContainer = document.querySelector('#task-container');
//       taskContainer.innerHTML = tasks
//         .map((task) => `<p>${task.description}</p>`)
//         .join('');
//     } else {
//       alert('Failed to fetch tasks. Please log in again.');
//       localStorage.removeItem('token');
//       window.location.href = 'signin.html';
//     }
//   } catch (error) {
//     console.error(error);
//     alert('An error occurred. Please try again.');
//   }
// });

// Logout Functionality
document.querySelector('#logout-button')?.addEventListener('click', () => {
  localStorage.removeItem('token');
  alert('You have been logged out.');
  window.location.href = 'index.html';
});

