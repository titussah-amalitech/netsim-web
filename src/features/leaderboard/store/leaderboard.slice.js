import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { leaderboardService } from "../../../services/index";

// Fetch all leaderboard entries
export const fetchLeaderboard = createAsyncThunk(
   "leaderboard/fetchAll",
   async (_, thunkAPI) => {
      try {
            let entries = await leaderboardService.getAll();

            // If no entries are present (first run), seed with dummy data so the
            // leaderboard page shows meaningful content and uses localStorage.
            if (!entries || entries.length === 0) {
               const dummyScores = [
                  { name: "Titus", score: 1905, timestamp: new Date().toISOString(), id: Date.now() + 1 },
                  { name: "Ama", score: 1587, timestamp: new Date().toISOString(), id: Date.now() + 2 },
                  { name: "Kojo", score: 1204, timestamp: new Date().toISOString(), id: Date.now() + 3 },
                  { name: "Lee", score: 1108, timestamp: new Date().toISOString(), id: Date.now() + 4 },
                  { name: "Nana", score: 998, timestamp: new Date().toISOString(), id: Date.now() + 5 },
                  { name: "Yaw", score: 863, timestamp: new Date().toISOString(), id: Date.now() + 6 },
                  { name: "Efua", score: 741, timestamp: new Date().toISOString(), id: Date.now() + 7 },
                  { name: "Akosua", score: 665, timestamp: new Date().toISOString(), id: Date.now() + 8 },
                  { name: "Kwame", score: 589, timestamp: new Date().toISOString(), id: Date.now() + 9 },
                  { name: "Mensah", score: 531, timestamp: new Date().toISOString(), id: Date.now() + 10 },
                  { name: "Adwoa", score: 402, timestamp: new Date().toISOString(), id: Date.now() + 11 },
                  { name: "Kofi", score: 378, timestamp: new Date().toISOString(), id: Date.now() + 12 },
                  { name: "Selina", score: 256, timestamp: new Date().toISOString(), id: Date.now() + 13 },
                  { name: "Dela", score: 142, timestamp: new Date().toISOString(), id: Date.now() + 14 },
                  { name: "Ebo", score: 76, timestamp: new Date().toISOString(), id: Date.now() + 15 },
               ];

               // Save directly to localStorage so EntityService can read them
               localStorage.setItem("leaderboard", JSON.stringify(dummyScores));
               entries = dummyScores;
            }
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