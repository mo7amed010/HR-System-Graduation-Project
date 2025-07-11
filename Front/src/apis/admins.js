import axios from "./config";

const API = "/admins";

export const getAdmins = () => axios.get(API);
export const addAdmin = (data) => axios.post(API, data);
export const updateAdmin = (id, data) => axios.patch(`${API}/${id}`, data);
export const deleteAdmin = (id) => axios.delete(`${API}/${id}`);
export const searchAdmins = (name) => axios.get(`${API}/search?name=${name}`);