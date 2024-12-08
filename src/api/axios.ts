import axios from "axios";

export const BASE_URL = "http://localhost:5245/api"; // http://localhost:5245/api // http://192.168.1.50:8033/api

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
