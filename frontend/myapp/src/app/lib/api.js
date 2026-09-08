const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:8000/api';

// Refresh the access token when it expires
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('Session expired. Please sign in again.');
  }

  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  });

  if (!response.ok) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    throw new Error('Session expired. Please sign in again.');
  }

  const data = await response.json();

  localStorage.setItem('accessToken', data.access);

  return data.access;
}

// Reusable helper for authenticated API requests
async function authFetch(url, options = {}) {
  let accessToken = localStorage.getItem('accessToken');

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // If the access token expired, refresh it and retry once
  if (response.status === 401) {
    accessToken = await refreshAccessToken();

    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return response;
}

// Fetch all tasks
export async function getTasks() {
  const response = await authFetch(`${API_URL}/tasks/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
}
// Create a new task
export async function createTask(taskData) {
  const response = await authFetch(`${API_URL}/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create task: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// Get users available for task assignment
export async function getUsers() {
  const response = await authFetch(`${API_URL}/users/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

// Get tasks assigned to the logged-in user
export async function getAssignedTasks() {
  const response = await authFetch(`${API_URL}/tasks/assigned/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch assigned tasks');
  }

  return response.json();
}

// Allow an assignee to change only the completion status
export async function updateAssignedTaskCompletion(id, completed) {
  const response = await authFetch(
    `${API_URL}/tasks/${id}/completion/`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to update task completion: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// Update an existing task
export async function updateTask(id, taskData) {
  const response = await authFetch(`${API_URL}/tasks/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update task: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// Delete a task
export async function deleteTask(id) {
  const response = await authFetch(`${API_URL}/tasks/${id}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(
      `Failed to delete task: ${response.status} ${response.statusText}`
    );
  }

  return true;
}

// Log in and retrieve JWT tokens
export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
}

// Register a new user
export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data.username?.[0] ||
      data.email?.[0] ||
      data.password?.[0] ||
      'Failed to create account';

    throw new Error(message);
  }

  return data;
}

// Get the currently logged-in user
export async function getCurrentUser() {
  const response = await authFetch(`${API_URL}/users/me/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch current user');
  }

  return response.json();
}

// Log out the current user on the frontend
export function logoutUser() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}