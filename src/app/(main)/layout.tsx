import UserNavbar from "@/src/components/UserNavbar";

export default function MainAppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <UserNavbar />
            <main className="pt-[65px]">
                {children}
            </main>
        </>
    );
}