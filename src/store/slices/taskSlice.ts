import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Task, TaskState } from '../../types';

const WEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Replace with actual API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const addTaskWithWeather = createAsyncThunk(
  'tasks/addTaskWithWeather',
  async ({ title, priority }: { title: string; priority: Task['priority'] }) => {
    try {
      // For now, create task without weather data to test basic functionality
      const task: Task = {
        id: Date.now().toString(),
        title,
        priority,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks));

      return task;
    } catch (error) {
      throw new Error('Failed to add task');
    }
  }
);

const initialState: TaskState = {
  tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTaskWithWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskWithWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = [...state.tasks, action.payload]; // Fixed: Properly update the tasks array
      })
      .addCase(addTaskWithWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add task';
      });
  },
});

export const { deleteTask } = taskSlice.actions;
export default taskSlice.reducer;