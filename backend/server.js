const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// Cấu hình kết nối Database
const dbConfig = {
    host: 'localhost',
    user: 'root',      // Thay bằng user của bạn
    password: '123456',      // Thay bằng password của bạn
    database: 'hotel_booking_db' // Đảm bảo bạn đã tạo database này
};

// Hàm hỗ trợ kết nối và truy vấn
async function query(sql, params) {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(sql, params);
    await connection.end();
    return results;
}

// --- RESTful API ENDPOINTS (GET) ---

// 1. Lấy danh sách tất cả các phòng
app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await query('SELECT * FROM rooms');
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Lấy danh sách khách hàng
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await query('SELECT * FROM customers');
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Lấy danh sách lịch đặt phòng (Thêm b.room_id vào đoạn SELECT)
app.get('/api/bookings', async (req, res) => {
    try {
        const sql = `
            SELECT b.id, b.room_id, r.room_name, c.name as customer_name, 
                   b.check_in_time, b.check_out_time, b.status
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            JOIN customers c ON b.customer_id = c.id
        `;
        const bookings = await query(sql);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Chạy Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
