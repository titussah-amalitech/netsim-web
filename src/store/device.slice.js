import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { deviceService } from "../services"

// Fetch all devices
export const fetchDevices = createAsyncThunk(
  "devices/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await deviceService.getAll()
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message)
    }
  }
)

// Fetch single device by ID
export const fetchDeviceById = createAsyncThunk(
  "devices/fetchById",
  async (id, thunkAPI) => {
    try {
      return await deviceService.getById(id)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message)
    }
  }
)

// Create a new device
export const createDevice = createAsyncThunk(
  "devices/create",
  async (data, thunkAPI) => {
    try {
      return await deviceService.create(data)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message)
    }
  }
)

// Update a device
export const updateDevice = createAsyncThunk(
  "devices/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await deviceService.update(id, data)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message)
    }
  }
)

// Delete a device
export const deleteDevice = createAsyncThunk(
  "devices/delete",
  async (id, thunkAPI) => {
    try {
      await deviceService.remove(id)
      return id // return deleted device id so we can update state
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message)
    }
  }
)

const deviceSlice = createSlice({
  name: "devices",
  initialState: {
    devices: [],
    loading: false,
    error: null,
    selectedDevice: null, // store details of one device
  },
  reducers: {
    clearDevices: (state) => {
      state.devices = []
      state.selectedDevice = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false
        state.devices = action.payload.data || [];
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch by ID
      .addCase(fetchDeviceById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedDevice = action.payload
      })

      // Create
      .addCase(createDevice.fulfilled, (state, action) => {
        state.loading = false
        state.devices.push(action.payload)
      })

      // Update
      .addCase(updateDevice.fulfilled, (state, action) => {
        state.loading = false
        const index = state.devices.findIndex((d) => d.id === action.payload.id)
        if (index !== -1) {
          state.devices[index] = action.payload
        }
      })

      // Delete
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.loading = false
        state.devices = state.devices.filter((d) => d.id !== action.payload)
      })
  },
})

export const { clearDevices } = deviceSlice.actions
export default deviceSlice.reducer
