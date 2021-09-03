import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.43.186:5000/",
});

export default instance;

export const assest = "http://192.168.43.186:5000/";

export const massageSocket = "http://192.168.43.186:5000/";
