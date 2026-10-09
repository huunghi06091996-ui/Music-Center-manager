# Music Center Manager — V1 Starter

Starter app cho trung tâm âm nhạc: học viên, lịch học, điểm danh, học phí, giáo viên, số tiết và payroll.

## Chạy local

```bash
npm install
npm run dev
```

Mở http://localhost:3000

## Database

Schema PostgreSQL/Supabase nằm tại:

`supabase/migrations/001_initial_schema.sql`

## Hiện trạng

Đã có UI khung cho:
- Dashboard
- Học viên
- Lịch học
- Điểm danh
- Học phí
- Giáo viên
- Bảng công & Payroll
- Báo cáo
- Cài đặt

Dữ liệu hiện đang là mock để duyệt UI nhanh. Bước tiếp theo là nối Supabase, Auth, CRUD thật và business rules.
