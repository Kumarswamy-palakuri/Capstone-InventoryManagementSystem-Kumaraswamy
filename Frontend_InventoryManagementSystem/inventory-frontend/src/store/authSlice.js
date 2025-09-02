import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // setCredentials: (state, action) => {
    //   const { user, token } = action.payload;
    //   state.user = user;
    //   state.token = token;
    //   state.isAuthenticated = true;
      
    //   localStorage.setItem('user', JSON.stringify(user));
    //   localStorage.setItem('token', token);
    // },
     setCredentials: (state, action) => {
      const { user, token } = action.payload;
      
      // Convert numeric role to string
      const roleMapping = {
        1: 'Staff',
        2: 'Manager',
        3: 'Admin'
      };
      
      // Normalize the user object
      const normalizedUser = {
        ...user,
        role: typeof user.role === 'number' ? roleMapping[user.role] : user.role
      };
      
      state.user = normalizedUser;
      state.token = token;
      state.isAuthenticated = true;
      
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
