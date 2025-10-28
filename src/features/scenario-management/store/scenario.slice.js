import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Services for API calls
import { scenarioService } from "../../../services/index";

// Fetch all scenarios
export const fetchScenarios = createAsyncThunk(
  "scenarios/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await scenarioService.getAll();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Fetch single scenario by ID
export const fetchScenarioById = createAsyncThunk(
  "scenarios/fetchById",
  async (id, thunkAPI) => {
    try {
      const data = await scenarioService.getById(id);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Create scenario
export const createScenario = createAsyncThunk(
  "scenarios/create",
  async (data, thunkAPI) => {
    try {
      return await scenarioService.create(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Update scenario
export const updateScenario = createAsyncThunk(
  "scenarios/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await scenarioService.update(id, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Import (load) scenario from JSON
export const importScenario = createAsyncThunk(
  "scenarios/import",
  async (file, thunkAPI) => {
    try {
      return await scenarioService.import(file);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Export (download) scenario
export const exportScenario = createAsyncThunk(
  "scenarios/export",
  async (id, thunkAPI) => {
    try {
      const response = await scenarioService.export(id);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const scenarioSlice = createSlice({
  name: "scenarios",
  initialState: {
    scenarios: [],
    loading: false,
    error: null,
    selectedScenario: null,
  },
  reducers: {
    clearScenarios: (state) => {
      state.scenarios = [];
      state.selectedScenario = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScenarios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScenarios.fulfilled, (state, action) => {
        state.loading = false;
        state.scenarios = action.payload || [];
      })
      .addCase(fetchScenarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchScenarioById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScenarioById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedScenario = action.payload;
      })
      .addCase(fetchScenarioById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createScenario.fulfilled, (state, action) => {
        state.loading = false;
        state.scenarios.push(action.payload);
      })

      .addCase(updateScenario.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.scenarios.findIndex((s) => s.id === updated.id);
        if (index !== -1) {
          state.scenarios[index] = updated;
        }
        if (state.selectedScenario?.id === updated.id) {
          state.selectedScenario = updated;
        }
      })

      .addCase(importScenario.fulfilled, (state, action) => {
        state.loading = false;
        state.scenarios.push(action.payload);
      })

      .addCase(exportScenario.fulfilled, (state) => {
        state.loading = false;
        // File download happens in component
      });
  },
});

export const { clearScenarios } = scenarioSlice.actions;
export default scenarioSlice.reducer;
