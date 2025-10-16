import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { leaderboardService } from "../../../services/index";

// Fetch all leaderboard entries
export const fetchLeaderboard = createAsyncThunk(
   "leaderboard/fetchAll",
   async (_, thunkAPI) => {
      try {
         const entries = await leaderboardService.getAll();
         // Sort by score descending and take top 10
         const sorted = entries
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
         return sorted;
      } catch (err) {
         return thunkAPI.rejectWithValue(err.message);
      }
   }
);

// Add new leaderboard entry
export const addLeaderboardEntry = createAsyncThunk(
   "leaderboard/addEntry",
   async ({ name, score }, thunkAPI) => {
      try {
         const newEntry = {
            name,
            score,
            timestamp: new Date().toISOString(),
         };

         // Get current entries
         const entries = await leaderboardService.getAll();

         // Add new entry and sort
         const updated = [...entries, newEntry]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Keep only top 10

         // Save updated leaderboard entries individually
         for (const entry of updated) {
            await leaderboardService.create(entry);
         }

         return updated;
      } catch (err) {
         return thunkAPI.rejectWithValue(err.message);
      }
   }
);

// Clear leaderboard
export const clearLeaderboard = createAsyncThunk(
   "leaderboard/clear",
   async (_, thunkAPI) => {
      try {
         localStorage.setItem("leaderboard", JSON.stringify([]));
         return [];
      } catch (err) {
         return thunkAPI.rejectWithValue(err.message);
      }
   }
);

const leaderboardSlice = createSlice({
   name: "leaderboard",
   initialState: {
      entries: [],
      highestScore: 0,
      averageScore: 0,
      totalPlayers: 0,
      loading: false,
      error: null,
   },
   reducers: {
      resetLeaderboardState: (state) => {
         state.entries = [];
         state.highestScore = 0;
         state.averageScore = 0;
         state.totalPlayers = 0;
         state.loading = false;
         state.error = null;
      },
   },
   extraReducers: (builder) => {
      builder
         // Fetch leaderboard
         .addCase(fetchLeaderboard.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchLeaderboard.fulfilled, (state, action) => {
            state.loading = false;
            state.entries = action.payload;

            // Calculate leaderboard stats 
            const scores = action.payload.map((e) => e.score);
            state.highestScore = scores.length ? Math.max(...scores) : 0;
            state.averageScore = scores.length
               ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
               : 0;
            state.totalPlayers = scores.length;

         })
         .addCase(fetchLeaderboard.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // Add entry
         .addCase(addLeaderboardEntry.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(addLeaderboardEntry.fulfilled, (state, action) => {
            state.loading = false;
            state.entries = action.payload;

            // Recalculate stats after add
            const scores = action.payload.map((e) => e.score);
            state.highestScore = scores.length ? Math.max(...scores) : 0;
            state.averageScore = scores.length
               ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
               : 0;
            state.totalPlayers = scores.length;
         })
         .addCase(addLeaderboardEntry.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // Clear leaderboard
         .addCase(clearLeaderboard.fulfilled, (state) => {
            state.loading = false;
            state.entries = [];
            state.highestScore = 0;
            state.averageScore = 0;
            state.totalPlayers = 0;
         });
   },
});

export const { resetLeaderboardState } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;