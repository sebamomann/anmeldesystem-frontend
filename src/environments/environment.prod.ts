require('dotenv').config();

export const environment = {
  production: false,
  api: {
    url: process.env.API_URL
  },
};