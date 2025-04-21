import axios from "axios";

// Create base axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor for adding auth token, etc.
// apiClient.interceptors.request.use(
//   (config) => {
//     // You can modify the request config here
//     // For example, add an auth token from localStorage
//     const token =
//       typeof window !== "undefined" ? localStorage.getItem("token") : null;

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor for handling errors globally
// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle errors globally
//     if (error.response) {
//       // Server responded with a status code outside of 2xx range
//       if (error.response.status === 401) {
//         // Handle unauthorized - e.g., redirect to login
//         if (typeof window !== "undefined") {
//           // localStorage.removeItem('token');
//           // window.location.href = '/login';
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default apiClient;
