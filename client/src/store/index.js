import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // More reducers added in later phases: courses, tests, jobs, etc.
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;
