import API from './api';

export const createInterview = async (data) => {
  const response = await API.post('/interviews', data);
  return response.data;
};

export const startInterview = async (id) => {
  const response = await API.post(`/interviews/${id}/start`);
  return response.data;
};

export const submitAnswer = async (id, data) => {
  const response = await API.post(`/interviews/${id}/answer`, data);
  return response.data;
};

export const endInterview = async (id) => {
  const response = await API.post(`/interviews/${id}/end`);
  return response.data;
};

export const getUserInterviews = async () => {
  const response = await API.get('/interviews');
  return response.data;
};

export const getInterviewById = async (id) => {
  const response = await API.get(`/interviews/${id}`);
  return response.data;
};
