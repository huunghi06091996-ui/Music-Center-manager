import Link from "next/link";

const groups = [
  { title: "", items: [["Dashboard", "/"]] },
  { title: "HỌC TẬP", items: [["Học viên", "/students"], ["Lịch học", "/calendar"], ["Điểm danh", "/attendance"]] },
  { title: "TÀI CHÍNH", items: [["Học phí", "/payments"]] },
  { title: "NHÂN SỰ", items: [["Giáo viên", "/teachers"], ["Bảng công", "/payroll"]] },
  { title: "QUẢN TRỊ", items: [["Báo cáo", "/reports"], ["Cài đặt", "/settings"]] },
] as const;

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand"><span className="brandMark">♪</span><div><strong>Music Center</strong><small>Manager</small></div></div>
      <nav>
        {groups.map((g, i) => (
          <div className="navGroup" key={i}>
            {g.title && <div className="navTitle">{g.title}</div>}
            {g.items.map(([label, href]) => <Link className="navItem" href={href} key={href}>{label}</Link>)}
          </div>
        ))}
      </nav>
      <div className="sidebarFooter"><div className="avatar">A</div><div><strong>Admin</strong><small>Quản trị viên</small></div></div>
    </aside>
  );
}
