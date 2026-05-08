import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import RoomCard from '../components/RoomCard';
import { fetchRooms } from '../redux/roomSlice';
import axios from 'axios';

const DashboardScreen = () => {
    const dispatch = useDispatch();
    const rooms = useSelector((state) => state.rooms.data);
    
    // State để quản lý Modal thêm phòng
    const [modalVisible, setModalVisible] = useState(false);
    const [newRoom, setNewRoom] = useState({ room_name: '', type: 'STANDARD', status: 'Trống' });

    const BASE_URL = 'http://10.106.45.127:3000/api/rooms';

    // Hàm xử lý Thêm phòng
    const handleAddRoom = async () => {
        if (!newRoom.room_name) return Alert.alert("Lỗi", "Vui lòng nhập tên phòng");
        try {
            await axios.post(BASE_URL, newRoom);
            setModalVisible(false);
            setNewRoom({ room_name: '', type: 'STANDARD', status: 'Trống' });
            dispatch(fetchRooms()); // Tải lại danh sách sau khi thêm
            Alert.alert("Thành công", "Đã thêm phòng mới!");
        } catch (error) {
            Alert.alert("Lỗi", "Không thể thêm phòng");
        }
    };

    // Hàm xử lý Xóa phòng
    const handleDeleteRoom = (id) => {
        Alert.alert("Xác nhận", "Bạn có chắc muốn xóa phòng này?", [
            { text: "Hủy" },
            { 
                text: "Xóa", 
                style: "destructive",
                onPress: async () => {
                    try {
                        await axios.delete(`${BASE_URL}/${id}`);
                        dispatch(fetchRooms()); // Tải lại danh sách sau khi xóa
                    } catch (error) {
                        Alert.alert("Lỗi", "Phòng này đang có lịch đặt, không thể xóa!");
                    }
                } 
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Dashboard - Quản Lý</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle" size={35} color="#2ecc71" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={rooms}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <RoomCard item={item} />
                        <TouchableOpacity 
                            style={styles.deleteBtn} 
                            onPress={() => handleDeleteRoom(item.id)}
                        >
                            <Ionicons name="trash" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Modal thêm phòng mới */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Thêm Phòng Mới</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Tên phòng (vd: P.404)" 
                            onChangeText={(txt) => setNewRoom({...newRoom, room_name: txt})}
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Loại phòng (STANDARD/DELUXE)" 
                            onChangeText={(txt) => setNewRoom({...newRoom, type: txt})}
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Hủy" color="red" onPress={() => setModalVisible(false)} />
                            <Button title="Lưu" onPress={handleAddRoom} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f6f8', padding: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 40 },
    title: { fontSize: 22, fontWeight: 'bold' },
    cardContainer: { position: 'relative' },
    deleteBtn: { position: 'absolute', right: 10, top: 10, backgroundColor: '#e74c3c', padding: 8, borderRadius: 20 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 15, width: '80%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 10 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }
});

export default DashboardScreen;
