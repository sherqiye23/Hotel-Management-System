const HeroSection = () => {
    return (
        <>
            <section className="relative mt-15 w-full h-[60vh] flex items-center justify-center text-center  mx-auto my-0 max-w-[1400px]">
                <div
                    className="absolute inset-0 bg-cover rounded-4xl bg-center brightness-75"
                    style={{
                        backgroundImage: "url(./images/header-section-image.jpg"
                    }}
                ></div>

                <div className="relative z-10 text-white flex flex-col items-center px-4">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3">
                        Welcome to comfort - book your stay today.
                    </h1>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
                        Feel at home, wherever you go
                    </h2>
                    <p className="text-lg md:text-xl mb-8 opacity-90">
                        1,480,086 rooms around the world are waiting for you!
                    </p>
                </div>
            </section>
        </>
    )
}

export default HeroSection