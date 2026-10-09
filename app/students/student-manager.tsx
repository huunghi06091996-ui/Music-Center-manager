"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Card } from "@/components/ui";

export type StudentStatus = "Đang học" | "Tạm nghỉ" | "Ngừng học" | "Học thử";
export type StudentRecord = {
  id: string;
  fullName: string;
  branch: "Lexington" | "Thesun Avenue";
  subject: string;
  teacher: string;
  parentName: string;
  phone: string;
  packageName: string;
  schedule: string;
  remaining: number;
  feeStatus: string;
  status: StudentStatus;
  notes: string;
};

const STORAGE_KEY = "music-center-manager.students.v1";

const seedStudents: StudentRecord[] = [
  {
    id: "HV000001",
    fullName: "Nguyễn Minh Anh",
    branch: "Lexington",
    subject: "Piano",
    teacher: "Cô Lan",
    parentName: "Nguyễn Văn A",
    phone: "0901 234 567",
    packageName: "Piano 8 buổi",
    schedule: "Thứ 3 · 18:00–19:00",
    remaining: 2,
    feeStatus: "Đủ",
    status: "Đang học",
    notes: "",
  },
  {
    id: "HV000002",
    fullName: "Trần Gia Hân",
    branch: "Lexington",
    subject: "Violin",
    teacher: "Cô Hương",
    parentName: "Trần Minh Thư",
    phone: "0902 345 678",
    packageName: "Violin 8 buổi",
    schedule: "Thứ 5 · 17:00–18:00",
    remaining: 1,
    feeStatus: "Nợ 500.000đ",
    status: "Đang học",
    notes: "",
  },
  {
    id: "HV000003",
    fullName: "Lê Bảo Nam",
    branch: "Thesun Avenue",
    subject: "Guitar",
    teacher: "Thầy Minh",
    parentName: "Lê Hoàng",
    phone: "0903 456 789",
    packageName: "Guitar 8 buổi",
    schedule: "Thứ 2 · 18:00–19:00",
    remaining: 6,
    feeStatus: "Đủ",
    status: "Đang học",
    notes: "",
  },
  {
    id: "HV000004",
    fullName: "Phạm Tuấn Anh",
    branch: "Thesun Avenue",
    subject: "Piano",
    teacher: "Cô Lan",
    parentName: "Phạm Thu Hà",
    phone: "0904 567 890",
    packageName: "Piano 8 buổi",
    schedule: "Thứ 6 · 19:00–20:00",
    remaining: 0,
    feeStatus: "Đủ",
    status: "Tạm nghỉ",
    notes: "Đang chờ gia hạn gói.",
  },
];

const emptyForm: StudentRecord = {
  id: "",
  fullName: "",
  branch: "Lexington",
  subject: "Piano",
  teacher: "",
  parentName: "",
  phone: "",
  packageName: "Piano 8 buổi",
  schedule: "",
  remaining: 8,
  feeStatus: "Chưa thu",
  status: "Đang học",
  notes: "",
};

function nextStudentCode(students: StudentRecord[]) {
  const max = students.reduce((acc, student) => {
    const n = Number(student.id.replace(/\D/g, ""));
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return `HV${String(max + 1).padStart(6, "0")}`;
}

export default function StudentManager() {
  const [students, setStudents] = useState<StudentRecord[]>(seedStudents);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("Tất cả cơ sở");
  const [subject, setSubject] = useState("Tất cả môn");
  const [status, setStatus] = useState("Tất cả trạng thái");
  const [editing, setEditing] = useState<StudentRecord | null>(null);
  const [form, setForm] = useState<StudentRecord>(emptyForm);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setStudents(JSON.parse(saved));
    } catch {
      // Keep starter data if local storage cannot be read.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students, loaded]);

  const subjects = useMemo(
    () => Array.from(new Set(students.map((s) => s.subject))).sort(),
    [students]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("vi");
    return students.filter((student) => {
      const matchesSearch = !q || [student.fullName, student.id, student.phone, student.parentName, student.teacher]
        .join(" ")
        .toLocaleLowerCase("vi")
        .includes(q);
      const matchesBranch = branch === "Tất cả cơ sở" || student.branch === branch;
      const matchesSubject = subject === "Tất cả môn" || student.subject === subject;
      const matchesStatus = status === "Tất cả trạng thái" || student.status === status;
      return matchesSearch && matchesBranch && matchesSubject && matchesStatus;
    });
  }, [students, search, branch, subject, status]);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, id: nextStudentCode(students) });
  }

  function openEdit(student: StudentRecord) {
    setEditing(student);
    setForm({ ...student });
  }

  function closeModal() {
    setEditing(null);
    setForm(emptyForm);
  }

  function saveStudent() {
    if (!form.fullName.trim()) {
      setNotice("Vui lòng nhập họ tên học viên.");
      return;
    }

    if (editing) {
      setStudents((current) => current.map((student) => student.id === editing.id ? { ...form, id: editing.id } : student));
      setNotice(`Đã cập nhật ${form.fullName}.`);
    } else {
      setStudents((current) => [...current, { ...form, id: form.id || nextStudentCode(current) }]);
      setNotice(`Đã thêm học viên ${form.fullName}.`);
    }
    closeModal();
  }

  function updateField<K extends keyof StudentRecord>(key: K, value: StudentRecord[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetDemoData() {
    if (!window.confirm("Khôi phục dữ liệu mẫu? Các thay đổi học viên trên trình duyệt này sẽ bị thay thế.")) return;
    setStudents(seedStudents);
    setNotice("Đã khôi phục dữ liệu mẫu.");
  }

  return (
    <>
      {notice && <div className="noticeBar"><span>✓ {notice}</span><button onClick={() => setNotice("")}>×</button></div>}

      <div className="toolbar studentToolbar">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm tên, mã HV, SĐT, phụ huynh..." />
        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option>Tất cả cơ sở</option><option>Lexington</option><option>Thesun Avenue</option>
        </select>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option>Tất cả môn</option>{subjects.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Tất cả trạng thái</option><option>Đang học</option><option>Tạm nghỉ</option><option>Ngừng học</option><option>Học thử</option>
        </select>
        <button className="primaryBtn" onClick={openCreate}>+ Thêm học viên</button>
      </div>

      <div className="studentSummary">
        <strong>{filtered.length}</strong> học viên đang hiển thị
        <span>·</span>
        <span>Lexington: {students.filter((s) => s.branch === "Lexington").length}</span>
        <span>·</span>
        <span>Thesun Avenue: {students.filter((s) => s.branch === "Thesun Avenue").length}</span>
        <button className="linkBtn" onClick={resetDemoData}>Khôi phục dữ liệu mẫu</button>
      </div>

      <Card>
        <table className="studentTable">
          <thead><tr><th>Học viên</th><th>Cơ sở</th><th>Môn</th><th>Giáo viên</th><th>Lịch học</th><th>Còn buổi</th><th>Học phí</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.id}>
                <td><strong>{student.fullName}</strong><div className="muted miniText">{student.id} · {student.phone || "Chưa có SĐT"}</div></td>
                <td><Badge tone="info">{student.branch}</Badge></td>
                <td>{student.subject}</td>
                <td>{student.teacher || <span className="muted">Chưa gán</span>}</td>
                <td>{student.schedule || <span className="muted">Chưa xếp lịch</span>}</td>
                <td>{student.remaining <= 2 ? <Badge tone={student.remaining === 0 ? "danger" : "warning"}>{student.remaining} buổi</Badge> : <Badge tone="success">{student.remaining} buổi</Badge>}</td>
                <td>{student.feeStatus.includes("Nợ") || student.feeStatus === "Chưa thu" ? <Badge tone="danger">{student.feeStatus}</Badge> : <Badge tone="success">✓ {student.feeStatus}</Badge>}</td>
                <td><Badge tone={student.status === "Đang học" ? "success" : student.status === "Tạm nghỉ" ? "warning" : student.status === "Học thử" ? "info" : "neutral"}>{student.status}</Badge></td>
                <td><button className="secondaryBtn compactBtn" onClick={() => openEdit(student)}>Chỉnh sửa</button></td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={9}><div className="emptyState"><strong>Không tìm thấy học viên</strong><span>Thử thay đổi từ khóa hoặc bộ lọc.</span></div></td></tr>}
          </tbody>
        </table>
      </Card>

      {(editing || form.id) && (
        <div className="modalBackdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modalPanel" role="dialog" aria-modal="true">
            <div className="modalHeader"><div><h2>{editing ? "Chỉnh sửa học viên" : "Thêm học viên"}</h2><p>{editing ? editing.id : form.id}</p></div><button className="modalClose" onClick={closeModal}>×</button></div>

            <div className="formGrid">
              <label className="field full"><span>Họ và tên *</span><input autoFocus value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="Nguyễn Minh Anh" /></label>
              <label className="field"><span>Cơ sở</span><select value={form.branch} onChange={(e) => updateField("branch", e.target.value as StudentRecord["branch"])}><option>Lexington</option><option>Thesun Avenue</option></select></label>
              <label className="field"><span>Trạng thái</span><select value={form.status} onChange={(e) => updateField("status", e.target.value as StudentStatus)}><option>Đang học</option><option>Tạm nghỉ</option><option>Ngừng học</option><option>Học thử</option></select></label>
              <label className="field"><span>Phụ huynh</span><input value={form.parentName} onChange={(e) => updateField("parentName", e.target.value)} /></label>
              <label className="field"><span>Số điện thoại</span><input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="09xx xxx xxx" /></label>
              <label className="field"><span>Môn học</span><select value={form.subject} onChange={(e) => updateField("subject", e.target.value)}><option>Piano</option><option>Guitar</option><option>Violin</option><option>Thanh nhạc</option><option>Drums</option><option>Music Theory</option></select></label>
              <label className="field"><span>Giáo viên</span><input value={form.teacher} onChange={(e) => updateField("teacher", e.target.value)} placeholder="Cô Lan" /></label>
              <label className="field"><span>Gói học</span><input value={form.packageName} onChange={(e) => updateField("packageName", e.target.value)} placeholder="Piano 8 buổi" /></label>
              <label className="field"><span>Còn lại</span><input type="number" min={0} value={form.remaining} onChange={(e) => updateField("remaining", Math.max(0, Number(e.target.value)))} /></label>
              <label className="field full"><span>Lịch học</span><input value={form.schedule} onChange={(e) => updateField("schedule", e.target.value)} placeholder="Thứ 3 · 18:00–19:00" /></label>
              <label className="field"><span>Tình trạng học phí</span><input value={form.feeStatus} onChange={(e) => updateField("feeStatus", e.target.value)} placeholder="Đủ / Nợ 500.000đ" /></label>
              <label className="field full"><span>Ghi chú</span><textarea rows={3} value={form.notes} onChange={(e) => updateField("notes", e.target.value)} /></label>
            </div>

            <div className="modalFooter"><button className="secondaryBtn" onClick={closeModal}>Hủy</button><button className="primaryBtn" onClick={saveStudent}>Lưu học viên</button></div>
          </div>
        </div>
      )}
    </>
  );
}
