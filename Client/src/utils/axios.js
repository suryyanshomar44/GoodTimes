import axios from "axios";

const instance = axios.create({
  baseURL: "https://hackthron-backend.herokuapp.com",
  withCredentials: true,
});

export default instance;
// https://clickonik-backend.herokuapp.com
//http://localhost:5000/
//https://hackthron-backend.herokuapp.com/
