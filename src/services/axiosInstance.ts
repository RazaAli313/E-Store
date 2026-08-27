import axios from 'axios';
import * as caseConverter from 'change-object-case';

import env from '#env';
import { getAccessToken } from './authToken';

const options = { recursive: true, arrayRecursive: true };

const axiosInstance = axios.create({
  baseURL: env.VITE_BACKEND_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(config => {
  const accessToken = getAccessToken();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

  if (!(config?.data instanceof FormData)) {
    const caseConvertedData = Array.isArray(config?.data)
      ? caseConverter.snakeArray(config.data, options)
      : caseConverter.snakeKeys(config?.data, options);
    config.data = caseConvertedData;
  }

  const caseConvertedData = caseConverter.snakeKeys(config.params);
  config.params = caseConvertedData;

  return config;
});

axiosInstance.interceptors.response.use(
  response => {
    if (response.data && typeof response.data === 'object') {
      response.data = Array.isArray(response.data)
        ? caseConverter.camelArray(response.data, options)
        : caseConverter.camelKeys(response.data, options);
    }
    return response;
  },
  error => {
    if (error.response) {
      if (error?.response?.data && typeof error.response.data === 'object') {
        error.response.data = caseConverter.camelKeys(error.response.data, options);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
