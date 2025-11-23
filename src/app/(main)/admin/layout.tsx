import AdminSidebar from "@/src/components/Admin/AdminSidebar";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grid gap-2 grid-cols-[1fr_4fr] pt-[25px]">
            <AdminSidebar />
            {children}
        </div>
    );
}
