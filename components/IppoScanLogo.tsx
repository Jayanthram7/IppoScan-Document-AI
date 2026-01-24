export function IppoScanLogo({ className = "", color = "white" }: { className?: string; color?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Up-Right Arrow (↗) - Extended */}
            <path
                d="M 10 80 L 30 60 L 75 60 L 90 45 L 75 30 L 60 45 L 30 45 L 10 65 Z"
                fill={color}
            />

            {/* Down-Left Arrow (↙) - Extended */}
            <path
                d="M 90 20 L 70 40 L 25 40 L 10 55 L 25 70 L 40 55 L 70 55 L 90 35 Z"
                fill={color}
            />
        </svg>
    );
}
