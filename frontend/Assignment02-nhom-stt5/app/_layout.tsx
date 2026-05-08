import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../redux/store';

// Import màn hình Dashboard và các hành động (actions) từ Redux
import DashboardScreen from '../screens/DashboardScreen';
import { fetchRooms } from '../redux/roomSlice';
import { fetchBookings } from '../redux/bookingSlice';

/**
 * Component MainApp:
 * Nơi xử lý logic chính như gọi API và điều hướng màn hình.
 * Component này phải nằm trong Provider để sử dụng được useDispatch.
 */
const MainApp = () => {
    const dispatch = useDispatch<any>();

    useEffect(() => {
        // Tự động tải danh sách phòng và lịch đặt ngay khi mở app
        dispatch(fetchRooms());
        dispatch(fetchBookings());
    }, [dispatch]);

    // Hiển thị Dashboard làm màn hình chính của ứng dụng
    return <DashboardScreen />;
};

/**
 * Component App (Layout):
 * Thành phần gốc của ứng dụng, bọc toàn bộ project trong Redux Store.
 */
export default function App() {
    return (
        <Provider store={store}>
            <MainApp />
        </Provider>
    );
}