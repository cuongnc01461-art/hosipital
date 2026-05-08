import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { fetchRooms } from '../redux/roomSlice';
import RoomCard from '../components/RoomCard';

const DashboardScreen = () => {
    const dispatch = useDispatch();
    const rooms = useSelector((state) => state.rooms.data);
    const status = useSelector((state) => state.rooms.status);

    const [searchText, setSearchText] = useState('');
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        dispatch(fetchRooms());
    }, [dispatch]);

    // HÀM QUAN TRỌNG: Xử lý khi bấm vào từng phòng
    const handlePressRoom = (room) => {
        setSelectedRoom(room);
        setConfirmModalVisible(true);
    };

    const handleConfirmAction = async (action) => {
        try {
            // Gọi API xác nhận của Nhi
            await axios.put(`http://10.106.45.127:3000/api/bookings/${selectedRoom.id}/confirm`, { action });
            Alert.alert("Thành công", "Đã cập nhật trạng thái!");
            setConfirmModalVisible(false);
            dispatch(fetchRooms()); // Load lại để cập nhật màu sắc
        } catch (error) {
            Alert.alert("Lỗi", "Vui lòng kiểm tra lại kết nối Backend.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Quản Lý Phòng</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add-circle" size={40} color="#27ae60" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#95a5a6" />
                <TextInput 
                    placeholder="Tìm tên phòng..." 
                    style={{flex: 1, marginLeft: 10}}
                    onChangeText={setSearchText}
                />
            </View>

            {status === 'loading' ? <ActivityIndicator size="large" /> : (
                <FlatList
                    data={rooms.filter(r => r.room_name.includes(searchText))}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            activeOpacity={0.7} 
                            onPress={() => handlePressRoom(item)} // Bấm vào bất kỳ phòng nào cũng hiện modal
                            style={styles.itemWrapper}
                        >
                            <RoomCard
                                item={{
                                    ...item,
                                    // Đảm bảo tên khách được hiển thị
                                    customer_name: item.customer_name || 'Phòng trống',
                                    bookingInfo: {
                                        color: item.status === 'available' ? '#2ecc71' : '#e74c3c',
                                        customerName: item.customer_name || 'Chưa có khách',
                                        checkIn: item.check_in_time,
                                        checkOut: item.check_out_time
                                    }
                                }}
                                config={{ color: '#3498db', icon: 'bed' }}
                            />
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* MODAL XÁC NHẬN - PHẢI NẰM NGOÀI FLATLIST */}
            <Modal visible={confirmModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Thông Tin Phòng</Text>
                        
                        {selectedRoom && (
                            <View style={styles.infoBox}>
                                <Text style={styles.infoText}>🏠 Số phòng: **{selectedRoom.room_name}**</Text>
                                <Text style={styles.infoText}>👤 Khách hàng: **{selectedRoom.customer_name || 'Chưa có khách'}**</Text>
                                <Text style={styles.infoText}>🔔 Trạng thái: {selectedRoom.status}</Text>
                            </View>
                        )}

                        <View style={styles.btnRow}>
                            {selectedRoom?.status === 'occupied' ? (
                                <TouchableOpacity 
                                    style={[styles.actionBtn, {backgroundColor: '#27ae60', flex: 1}]}
                                    onPress={() => handleConfirmAction('checkout')}
                                >
                                    <Text style={styles.btnText}>Check-out</Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={{color: '#7f8c8d', textAlign: 'center', flex: 1}}>Phòng này đang trống</Text>
                            )}
                        </View>

                        <TouchableOpacity onPress={() => setConfirmModalVisible(false)} style={styles.closeBtn}>
                            <Text style={{color: '#95a5a6', marginTop: 15}}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f6f8', paddingHorizontal: 16, paddingTop: 50 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    title: { fontSize: 26, fontWeight: 'bold' },
    searchBar: { flexDirection: 'row', backgroundColor: 'white', padding: 10, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
    itemWrapper: { marginBottom: 15 },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalBox: { backgroundColor: 'white', width: '85%', padding: 25, borderRadius: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    infoBox: { marginBottom: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 },
    infoText: { fontSize: 16, marginBottom: 8 },
    btnRow: { flexDirection: 'row' },
    actionBtn: { padding: 15, borderRadius: 10, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold' },
    closeBtn: { alignItems: 'center' }
});

export default DashboardScreen;
