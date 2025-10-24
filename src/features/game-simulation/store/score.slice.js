import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { scoreService } from "../services/score.service";

// Initialize game session
export const initializeGame = createAsyncThunk(
  "score/initializeGame",
  async ({ scenarioId, userId, scenarioName }, thunkAPI) => {
    try {
      return scoreService.initializeGame(scenarioId, userId, scenarioName);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Record issue start
export const recordIssueStart = createAsyncThunk(
  "score/recordIssueStart",
  async ({ deviceId, issueType }, thunkAPI) => {
    try {
      return scoreService.recordIssueStart(deviceId, issueType);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Record issue fix
export const recordIssueFix = createAsyncThunk(
  "score/recordIssueFix",
  async (deviceId, thunkAPI) => {
    try {
      return scoreService.recordIssueFix(deviceId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Load current game
export const loadCurrentGame = createAsyncThunk(
  "score/loadCurrentGame",
  async (_, thunkAPI) => {
    try {
      return scoreService.getCurrentGame();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// End game
export const endGame = createAsyncThunk(
  "score/endGame",
  async (playerName, thunkAPI) => {
    try {
      return scoreService.endGame(playerName);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const scoreSlice = createSlice({
  name: "score",
  initialState: {
    currentScore: 0,
    issuesFixed: 0,
    totalIssues: 0,
    activeIssues: 0,
    lastPoints: 0,
    avgFixTime: 0,
    elapsedTime: 0,
    isGameActive: false,
    loading: false,
    error: null,
    gameStarted: false,
    pointNotification: null, // For showing point awards
  },
  reducers: {
    clearScore: (state) => {
      state.currentScore = 0;
      state.issuesFixed = 0;
      state.totalIssues = 0;
      state.activeIssues = 0;
      state.lastPoints = 0;
      state.avgFixTime = 0;
      state.elapsedTime = 0;
      state.isGameActive = false;
      state.gameStarted = false;
      state.pointNotification = null;
    },
    updateGameStats: (state) => {
      const stats = scoreService.getGameStats();
      if (stats) {
        state.currentScore = stats.score;
        state.issuesFixed = stats.issuesFixed;
        state.totalIssues = stats.totalIssues;
        state.activeIssues = stats.activeIssues;
        state.lastPoints = stats.lastPoints;
        state.avgFixTime = stats.avgFixTime;
        state.elapsedTime = stats.elapsedTime;
      }
    },
    clearPointNotification: (state) => {
      state.pointNotification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize game
      .addCase(initializeGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeGame.fulfilled, (state) => {
        state.loading = false;
        state.currentScore = 0;
        state.issuesFixed = 0;
        state.totalIssues = 0;
        state.activeIssues = 0;
        state.isGameActive = true;
        state.gameStarted = true;
      })
      .addCase(initializeGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Record issue start
      .addCase(recordIssueStart.fulfilled, (state) => {
        const stats = scoreService.getGameStats();
        if (stats) {
          state.activeIssues = stats.activeIssues;
          state.totalIssues = stats.totalIssues;
        }
      })

      // Record issue fix
      .addCase(recordIssueFix.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentScore = action.payload.totalScore;
          state.issuesFixed = action.payload.issuesFixed;
          state.lastPoints = action.payload.pointsAwarded;
          state.pointNotification = {
            points: action.payload.pointsAwarded,
            timestamp: Date.now(),
          };

          const stats = scoreService.getGameStats();
          if (stats) {
            state.activeIssues = stats.activeIssues;
            state.avgFixTime = stats.avgFixTime;
          }
        }
      })

      // Load current game
      .addCase(loadCurrentGame.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentScore = action.payload.score;
          state.issuesFixed = action.payload.issuesFixed;
          state.totalIssues = action.payload.totalIssues;
          state.isGameActive = action.payload.isActive;
          state.gameStarted = true;

          const stats = scoreService.getGameStats();
          if (stats) {
            state.activeIssues = stats.activeIssues;
            state.avgFixTime = stats.avgFixTime;
            state.elapsedTime = stats.elapsedTime;
          }
        }
      })

      // End game
      .addCase(endGame.fulfilled, (state) => {
        state.isGameActive = false;
        state.gameStarted = false;
      });
  },
});

export const { clearScore, updateGameStats, clearPointNotification } =
  scoreSlice.actions;
export default scoreSlice.reducer;