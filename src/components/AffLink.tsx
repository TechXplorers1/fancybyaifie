
'use client';

export const AffLink = () => {
    return (
        <div className="absolute top-4 left-4 z-10">
            <div className="relative flex items-center justify-center w-24 h-24">
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                    <circle 
                        cx="50" 
                        cy="50" 
                        r="48" 
                        stroke="hsl(var(--accent-2))" 
                        strokeWidth="2" 
                        fill="hsla(var(--accent-2), 0.8)" 
                    />
                </svg>
                <div className="relative text-center text-white font-medium text-sm tracking-wider">
                    AFF
                    <br />
                    LINK
                </div>
            </div>
        </div>
    )
}
