export type LessonStatus = "completed" | "scheduled" | "absent" | "unconfirmed";

export const metrics = [
  { label: "Học viên đang học", value: "186", hint: "+12 tháng này" },
  { label: "Ca học hôm nay", value: "32", hint: "25 đã hoàn thành" },
  { label: "Giáo viên hoạt động", value: "12", hint: "10 có lịch hôm nay" },
  { label: "Học phí còn nợ", value: "26,5 triệu", hint: "5 học viên" },
];

export const lessons = [
  { time: "17:00", student: "Minh Anh", subject: "Piano", teacher: "Cô Lan", room: "P01", status: "completed" as LessonStatus },
  { time: "18:00", student: "Gia Hân", subject: "Piano", teacher: "Cô Lan", room: "P01", status: "scheduled" as LessonStatus },
  { time: "18:00", student: "Bảo Nam", subject: "Guitar", teacher: "Thầy Minh", room: "G01", status: "scheduled" as LessonStatus },
  { time: "19:00", student: "Hoàng An", subject: "Violin", teacher: "Cô Hương", room: "V01", status: "unconfirmed" as LessonStatus },
];

export const students = [
  { id: 1, name: "Nguyễn Minh Anh", subject: "Piano", teacher: "Cô Lan", remaining: 2, fee: "Đủ", state: "Đang học" },
  { id: 2, name: "Trần Gia Hân", subject: "Violin", teacher: "Cô Hương", remaining: 1, fee: "Nợ 500.000đ", state: "Đang học" },
  { id: 3, name: "Lê Bảo Nam", subject: "Guitar", teacher: "Thầy Minh", remaining: 6, fee: "Đủ", state: "Đang học" },
  { id: 4, name: "Phạm Tuấn Anh", subject: "Piano", teacher: "Cô Lan", remaining: 0, fee: "Đủ", state: "Hết gói" },
];

export const teachers = [
  { name: "Nguyễn Thị Lan", subject: "Piano", students: 18, units: 46, pay: "6.900.000đ" },
  { name: "Trần Minh", subject: "Guitar", students: 14, units: 38, pay: "6.840.000đ" },
  { name: "Lê Hương", subject: "Violin", students: 12, units: 42, pay: "8.400.000đ" },
];
