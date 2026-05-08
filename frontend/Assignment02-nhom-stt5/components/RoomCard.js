import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Hàm hỗ trợ format thời gian
const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        hour: '2-digit', minute: '2-digit',
        day: '2-digit', month: '2-digit'
    });
};

const RoomCard = ({ item, config }) => {
    const { bookingInfo } = item;

    return (
        <View style={[styles.card, { borderLeftColor: config.color }]}>
            {/* Header: Tên phòng & Trạng thái */}
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.roomName}>{item.room_name}</Text>
                    <Text style={styles.roomType}>Loại: {item.room_type.toUpperCase()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: config.color + '20' }]}>
                    <Ionicons name={config.icon} size={16} color={config.color} />
                    <Text style={[styles.statusText, { color: config.color }]}>
                        {config.text}
                    </Text>
                </View>
            </View>

            {/* Body: Thông tin khách hàng & Thời gian */}
            {bookingInfo && (
                <View style={styles.bookingDetails}>
                    <View style={styles.detailRow}>
                        <Ionicons name="person-circle-outline" size={18} color="#555" />
                        <Text style={styles.detailText}>Khách: {bookingInfo.customer_name}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={18} color="#555" />
                        <Text style={styles.detailText}>
                            In: {formatTime(bookingInfo.check_in_time)}  -  Out: {formatTime(bookingInfo.check_out_time)}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 16,
        padding: 16,
        borderLeftWidth: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    roomName: { fontSize: 20, fontWeight: 'bold', color: '#2d3436' },
    roomType: { fontSize: 14, color: '#636e72', marginTop: 2 },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: { marginLeft: 6, fontWeight: 'bold', fontSize: 13 },
    bookingDetails: {
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f2f6',
    },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    detailText: { marginLeft: 8, fontSize: 14, color: '#2d3436' },
});

export default RoomCard;