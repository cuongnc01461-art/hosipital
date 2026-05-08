import React, { useMemo } from 'react';
import { Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import RoomCard from '../components/RoomCard'; // Import component vừa tạo

const STATUS_CONFIG = {
    empty: { text: 'Trống', color: '#27ae60', icon: 'checkmark-circle' },
    occupied: { text: 'Đang có khách', color: '#c0392b', icon: 'person' },
    reserved: { text: 'Đã đặt trước', color: '#f39c12', icon: 'calendar' }
};

const DashboardScreen = () => {
    const rooms = useSelector((state) => state.rooms.data);
    const bookings = useSelector((state) => state.bookings.data);

    const dashboardData = useMemo(() => {
        return rooms.map(room => {
            const activeBooking = bookings.find(b =>
                b.room_id === room.id && (b.status === 'staying' || b.status === 'booked')
            );

            let displayStatus = 'empty';
            if (activeBooking) {
                displayStatus = activeBooking.status === 'staying' ? 'occupied' : 'reserved';
            }

            return { ...room, displayStatus, bookingInfo: activeBooking || null };
        });
    }, [rooms, bookings]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Dashboard - Tình Trạng Phòng</Text>
            <FlatList
                data={dashboardData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    // Truyền dữ liệu vào RoomCard qua Props
                    <RoomCard item={item} config={STATUS_CONFIG[item.displayStatus]} />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f6f8', paddingHorizontal: 16, paddingTop: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 16 },
    listContent: { paddingBottom: 30 },
});

export default DashboardScreen;