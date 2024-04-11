import { getToken } from "./authenticate";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function makeRequest(path, method, body = null) {
    const token = getToken();
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`
    });
  
    const config = {
      method: method,
      headers: headers
    };
  
    if (body) {
      config.body = JSON.stringify(body);
    }
  
    const response = await fetch(`${API_URL}${path}`, config);
  
    if (response.status === 200) {
      return response.json();
    } else {
      
      return [];
    }
  }


// addToFavourites(id)
export async function addToFavourites(id) {
    return makeRequest(`/favourites/${id}`, 'PUT');
}

// removeFromFavourites(id)
export async function removeFromFavourites(id) {
    return makeRequest(`/favourites/${id}`, 'DELETE');
}

// getFavourites()
export async function getFavourites() {
    return makeRequest('/favourites', 'GET');
}

// addToHistory(id)
export async function addToHistory(id) {
    return makeRequest(`/history/${id}`, 'PUT');
}

// removeFromHistory(id)
export async function removeFromHistory(id) {
    return makeRequest(`/history/${id}`, 'DELETE');
}

// getHistory()
export async function getHistory() {
    return makeRequest('/history', 'GET');
}   