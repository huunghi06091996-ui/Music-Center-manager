import { Badge, Card, PageHeader } from "@/components/ui";
import { lessons, metrics } from "@/lib/mock-data";

function statusLabel(s:string){if(s==="completed") return <Badge tone="success">✓ Đã học</Badge>; if(s==="scheduled") return <Badge tone="info">● Sắp học</Badge>; if(s==="unconfirmed") return <Badge tone="warning">⚠ Chưa xác nhận</Badge>; return <Badge>Nghỉ</Badge>}
export default function Dashboard(){return <>
<PageHeader title="Dashboard" subtitle="Tổng quan vận hành trung tâm hôm nay" action={<select className="secondaryBtn"><option>Tháng 10/2026</option></select>}/>
<div className="metrics">{metrics.map(m=><div className="metric" key={m.label}><div className="label">{m.label}</div><div className="value">{m.value}</div><div className="hint">{m.hint}</div></div>)}</div>
<div className="grid2">
<Card><div className="cardTitle"><h2>Lịch học hôm nay</h2><a className="muted" href="/calendar">Xem toàn bộ →</a></div><table><thead><tr><th>Giờ</th><th>Học viên</th><th>Môn</th><th>Giáo viên</th><th>Phòng</th><th>Trạng thái</th></tr></thead><tbody>{lessons.map((l,i)=><tr key={i}><td><strong>{l.time}</strong></td><td>{l.student}</td><td>{l.subject}</td><td>{l.teacher}</td><td>{l.room}</td><td>{statusLabel(l.status)}</td></tr>)}</tbody></table></Card>
<Card><div className="cardTitle"><h2>Cần xử lý</h2></div><div className="task"><div><strong>8 học viên sắp hết gói</strong><small>Còn tối đa 2 buổi</small></div><Badge tone="warning">8</Badge></div><div className="task"><div><strong>5 học viên còn nợ</strong><small>Tổng 26.500.000đ</small></div><Badge tone="danger">5</Badge></div><div className="task"><div><strong>3 buổi chưa điểm danh</strong><small>Phát sinh từ hôm qua</small></div><Badge tone="warning">3</Badge></div><div className="task"><div><strong>Payroll tháng 10</strong><small>Đang ở trạng thái nháp</small></div><Badge tone="info">Draft</Badge></div></Card>
</div>
</>}
