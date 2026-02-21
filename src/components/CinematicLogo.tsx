const CinematicLogo = ({ className = "w-10 h-10" }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>

            {/* Eye Outer Shape */}
            <path
                d="M10 50C10 50 30 25 50 25C70 25 90 50 90 50C90 50 70 75 50 75C30 75 10 50 10 50Z"
                stroke="url(#logoGradient)"
                strokeWidth="4"
                strokeLinejoin="round"
            />

            {/* Inner Lens / Iris */}
            <circle
                cx="50"
                cy="50"
                r="18"
                stroke="url(#logoGradient)"
                strokeWidth="3"
            />

            {/* Film Reel Pupil */}
            <circle
                cx="50"
                cy="50"
                r="10"
                fill="url(#logoGradient)"
            />
            <circle cx="50" cy="44" r="2" fill="white" />
            <circle cx="55.2" cy="47" r="2" fill="white" />
            <circle cx="53.2" cy="53" r="2" fill="white" />
            <circle cx="46.8" cy="53" r="2" fill="white" />
            <circle cx="44.8" cy="47" r="2" fill="white" />

            {/* Lens Reflection */}
            <path
                d="M62 40C64 42 65 45 65 48"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
            />
        </svg>
    );
};

export default CinematicLogo;
