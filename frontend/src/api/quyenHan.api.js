import axios from "axios";

const API_URL = "http://localhost:5000/api/quyen-han"; 
// đổi port nếu backend bạn khác

export const getAllQuyenHan = () => {
  return axios.get(API_URL).then(res => {
    return res;
  });
};


export const searchQuyenHanByName = (keyword) => {
  return axios.get(`${API_URL}/search`, {
    params: { keyword }
  });
};

export const createQuyenHan = (data) => {
  return axios.post(API_URL, data);
};

export const updateQuyenHan = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const deleteQuyenHan = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
