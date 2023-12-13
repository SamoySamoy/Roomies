// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const DEV_API_SERVER_PORT = 8000;
const API_SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? `${window.location.origin}/api`
    : `${window.location.protocol}${window.location.hostname}:${DEV_API_SERVER_PORT}/api`;

// initialize an empty api service that we'll inject endpoints into later as needed
export const baseApiSlice = createApi({
  reducerPath: 'api', // optional
  baseQuery: fetchBaseQuery({
    baseUrl: API_SERVER_URL,
    credentials: 'include',
    prepareHeaders: (headers, api) => {},
  }),
  keepUnusedDataFor: 0,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  tagTypes: [
    'Hotel',
    'HotelImage',
    'User',
    'Fav',
    'Cart',
    'Comment',
    'Transaction',
    'Book',
    'Service',
    'ServiceImage',
  ],
  endpoints: () => ({}),
});
