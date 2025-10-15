import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService} from "../services/index"

// Fetch All Users
export const fetchUsers = createAsyncThunk(
   'users/fetchAll',
   async (_, thunkAPI) => {
      try {
         return await userService.getAll();
      } catch (err) {
         return thunkAPI.rejectWithValue(err.message);
      }
   }
);

// Create a a new user
export const createUser = createAsyncThunk(
   'users/create',
   async (userData, thunkAPI) => {
      try {
         return await userService.create(userData);
      } catch (err) {
         return thunkAPI.rejectWithValue(err.message);
      }
   }
);

const userSlice = createSlice({
   name: 'users',
   initialState: {
      users: [],
      currentUser: null,
      loading: false,
      error: null,
   },
   reducers: {
      clearUsers: (state) => {
         state.users = [];
         state.currentUser = null;
      },
      setCurrentUser: (state, action) => {
         state.currentUser = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
         })
         .addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
         .addCase(createUser.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(createUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users.push(action.payload);
            state.currentUser = action.payload;
         })
         .addCase(createUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         });
   },
});

export const { clearUsers, setCurrentUser } = userSlice.actions;
export default userSlice.reducer;