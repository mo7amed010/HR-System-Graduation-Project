import axios from "axios";

const API = "http://localhost:3003/api/holidays";

const authHeader = {
  headers: {
    authentication: localStorage.getItem("token"), 
  },
};

export const getHolidays = () => axios.get(API, authHeader);
export const addHoliday = (data) => axios.post(API, data, authHeader);
export const updateHoliday = (id, data) => axios.put(`${API}/${id}`, data, authHeader);
export const deleteHoliday = (id) => axios.delete(`${API}/${id}`, authHeader);
