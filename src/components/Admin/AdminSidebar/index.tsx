import Link from 'next/link'

// users, rooms, reservations, feedbacks
const AdminSidebar = () => {
    return (
        <div className="rounded-xl p-4 sticky top-20 self-start h-[88vh]">
            <h2 className="text-xl font-bold mb-6">
                <div className='flex justify-center sm:justify-start gap-1'>
                    <span>👩‍💼</span>
                    <span className='hidden sm:block whitespace-nowrap'>Admin Panel</span>
                </div>
            </h2>
            <ul className="space-y-4">
                <li>
                    <Link href="/admin/dashboard">
                        <div className='flex justify-center sm:justify-start gap-1'>
                            <span>📊</span>
                            <span className='hidden sm:block'>Dashboard</span>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link href="/admin/tables/users">
                        <div className='flex justify-center sm:justify-start gap-1'>
                            <span>👤</span>
                            <span className='hidden sm:block'>Users</span>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default AdminSidebar