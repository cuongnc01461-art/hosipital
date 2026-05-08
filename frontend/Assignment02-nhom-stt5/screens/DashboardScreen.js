import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// Import action từ Redux và Component thẻ phòng
import { fetchRooms } from '../redux/roomSlice';
import RoomCard from '../components/RoomCard'; 

const DashboardScreen = () => {
    const dispatch = useDispatch();
    const rooms = useSelector((state) => state.rooms.data);
    const status = useSelector((state) => state.rooms.status);

    // IP của máy Backend (Máy Nhi)
    const BASE_URL = 'http://10.106.45.127:3000/api/rooms';

    // State quản lý Cửa sổ (Modal)
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Biến để biết đang Thêm hay Sửa
    const [formData, setFormData] = useState({ id: null, room_name: '', room_type: 'standard', price: '', status: 'available' });

    useEffect(() => {
        dispatch(fetchRooms());
    }, [dispatch]);

    // Bật form Thêm
    const openAddModal = () => {
        setIsEditing(false);
        setFormData({ id: null, room_name: '', room_type: 'standard', price: '', status: 'available' });
        setModalVisible(true);
    };

    // Bật form Sửa (Đổ dữ liệu cũ vào form)
    const openEditModal = (room) => {
        setIsEditing(true);
        setFormData(room);
        setModalVisible(true);
    };

    // Hàm Xử lý Gửi dữ liệu (Thêm hoặc Sửa)
    const handleSubmit = async () => {
        if (!formData.room_name || !formData.price) {
            return Alert.alert("Lỗi", "Vui lòng nhập đủ tên phòng và giá!");
        }

        try {
            if (isEditing) {
                // Gọi API Sửa
                await axios.put(`${BASE_URL}/${formData.id}`, formData);
                Alert.alert("Thành công", "Đã cập nhật phòng!");
            } else {
                // Gọi API Thêm
                await axios.post(BASE_URL, formData);
                Alert.alert("Thành công", "Đã tạo phòng mới!");
            }
            setModalVisible(false);
            dispatch(fetchRooms()); // Load lại danh sách lập tức
        } catch (error) {
            Alert.alert("Lỗi", "Không thể lưu dữ liệu, vui lòng thử lại.");
        }
    };

    // Hàm Xử lý Xóa
    const handleDelete = (id) => {
        Alert.alert("Xác nhận", "Bạn có chắc muốn xóa phòng này?", [
            { text: "Hủy", style: "cancel" },
            { 
                text: "Xóa", 
                style: "destructive",
                onPress: async () => {
                    try {
                        await axios.delete(`${BASE_URL}/${id}`);
                        dispatch(fetchRooms());
                        Alert.alert("Đã xóa", "Xóa phòng thành công!");
                    } catch (error) {
                        Alert.alert("Lỗi hệ thống", "Phòng này đang có người đặt, không thể xóa!");
                    }
                } 
            }
        ]);
    };

    return (
        <View style={styles.container}>
            {/* Header có nút Thêm */}
            <View style={styles.header}>
                <Text style={styles.title}>Quản Lý Phòng</Text>
                <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
                    <Ionicons name="add-circle" size={40} color="#27ae60" />
                </TouchableOpacity>
            </View>

            {status === 'loading' && rooms.length === 0 ? (
                <ActivityIndicator size="large" color="#3498db" />
            ) : (
                <FlatList
                    data={rooms}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    refreshing={status === 'loading'}
                    onRefresh={() => dispatch(fetchRooms())}
                    renderItem={({ item }) => (
                        <View style={styles.itemWrapper}>
                            {/* Thẻ phòng của bạn */}
                            <RoomCard item={item} />
                            
                            {/* Thanh công cụ Sửa / Xóa nằm góc trên bên phải thẻ phòng */}
                            <View style={styles.actionRow}>
                                <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionBtn}>
                                    <Ionicons name="pencil" size={22} color="#f39c12" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.actionBtn, { marginLeft: 10 }]}>
                                    <Ionicons name="trash" size={22} color="#e74c3c" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}

            {/* Modal Nhập Liệu */}
            <Modal visible={modalVisible} transparent={true} animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>{isEditing ? 'Sửa Phòng' : 'Thêm Phòng Mới'}</Text>
                        
                        <TextInput style={styles.input} placeholder="Tên phòng (vd: P.505)"
                            value={formData.room_name}
                            onChangeText={(txt) => setFormData({...formData, room_name: txt})} />
                        
                        <TextInput style={styles.input} placeholder="Loại (standard/deluxe/suite)"
                            value={formData.room_type}
                            onChangeText={(txt) => setFormData({...formData, room_type: txt})} />
                        
                        <TextInput style={styles.input} placeholder="Giá (VND)" keyboardType="numeric"
                            value={formData.price.toString()}
                            onChangeText={(txt) => setFormData({...formData, price: txt})} />
                        
                        <TextInput style={styles.input} placeholder="Trạng thái (available/occupied)"
                            value={formData.status}
                            onChangeText={(txt) => setFormData({...formData, status: txt})} />

                        <View style={styles.btnRow}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.submitBtn, {backgroundColor: '#95a5a6'}]}>
                                <Text style={styles.btnText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
                                <Text style={styles.btnText}>Lưu</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f6f8', paddingHorizontal: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 50, marginBottom: 15 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50' },
    addButton: { shadowColor: '#27ae60', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
    itemWrapper: { position: 'relative', marginBottom: 15 },
    actionRow: { position: 'absolute', top: 10, right: 10, flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 10, padding: 5 },
    actionBtn: { padding: 5 },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    modalBox: { backgroundColor: 'white', width: '85%', padding: 20, borderRadius: 15, elevation: 5 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#2c3e50' },
    input: { borderWidth: 1, borderColor: '#bdc3c7', padding: 12, borderRadius: 8, marginBottom: 10, fontSize: 16 },
    btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    submitBtn: { flex: 0.48, backgroundColor: '#3498db', padding: 12, borderRadius: 8, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default DashboardScreen;
