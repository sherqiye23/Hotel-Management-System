import CountUp from "react-countup";

export default function AboutSection() {
    const stats = [
        { number: 250, label: "Luxury Rooms" },
        { number: 15000, label: "Happy Guests" },
        { number: 120, label: "Staff Members" },
        { number: 10, label: "Years of Service" },
    ];


    return (
        <section className="py-20 bg-white text-center  mx-auto my-0 max-w-[1400px]">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About Our Hotel</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                Experience comfort and hospitality at its finest. We’ve welcomed thousands of guests and continue to provide the best hotel experience every day.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map((item, index) => (
                    <div key={index}>
                        <p className="text-4xl font-extrabold text-indigo-600">
                            <CountUp end={item.number} duration={2.5} separator="," />+
                        </p>
                        <p className="text-gray-500">{item.label}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
