import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
export const metadata = { title: "Music Center Manager", description: "Quản lý trung tâm âm nhạc" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="vi"><body><div className="appShell"><Sidebar/><main className="main"><Topbar/><div className="content">{children}</div></main></div></body></html>; }
