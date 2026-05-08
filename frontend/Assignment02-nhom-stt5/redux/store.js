import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './roomSlice';
import bookingReducer from './bookingSlice';

export const store = configureStore({
    reducer: {
        rooms: roomReducer,
        bookings: bookingReducer,
    },
});