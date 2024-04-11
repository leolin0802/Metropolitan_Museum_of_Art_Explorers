import { jwtDecode } from 'jwt-decode';

// setToken(token)
export function setToken(token) {
  localStorage.setItem('access_token', token);
}

// getToken()
export function getToken() {
  try {
    return localStorage.getItem('access_token');
  } catch (err) {
    return null;
  }
}

// removeToken()
export function removeToken() {
  localStorage.removeItem('access_token');
}

//readToken()
export function readToken() {
  try {
    const token = getToken();
    return token ? jwtDecode(token) : null;
  } catch (err) {
    return null;
  }
}

// isAuthenticated()
export function isAuthenticated() {
  const token = readToken();
  return token ? true : false;
}

//authenticatedUser(user, password)
export async function authenticateUser(user, password) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({ userName: user, password: password }),
      headers: {
        'content-type': 'application/json',
      },
    });
  
    const data = await res.json();
  
    if (res.status === 200) {
      setToken(data.token);
      return true;
    } else {
      throw new Error(data.message);
    }
  }
  
// registerUser(user, password, password2)
export async function registerUser(user, password, password2) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
      method: 'POST',
      body: JSON.stringify({
        userName: user,
        password: password,
        password2: password2
      }),
      headers: {
        'content-type': 'application/json',
      },
    });

    const data = await res.json();

    if(res.status === 200) {
      return true;
    }
    else {
      throw new Error(data.message || "Registration failed!");
    }

  } catch (err) {
    console.error('Registration error: ', err);
    throw err;
  }
}
