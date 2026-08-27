import API from './api';

export const getReport = async (interviewId) => {
  const response = await API.get(`/reports/${interviewId}`);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await API.get('/reports');
  return response.data;
};
