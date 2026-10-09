import { PageHeader } from "@/components/ui";
import StudentManager from "./student-manager";

export default function Students() {
  return (
    <>
      <PageHeader title="Học viên" subtitle="Thêm, sửa và quản lý học viên tại Lexington & Thesun Avenue" />
      <StudentManager />
    </>
  );
}
