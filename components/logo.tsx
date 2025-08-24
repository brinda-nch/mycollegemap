import React from "react"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  }

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className={sizeClasses[size]}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Graduation Hat - More Dynamic */}
        
        {/* Hat Brim - Curved and 3D effect */}
        <path
          d="M15 50 Q50 60 85 50 L85 55 Q50 65 15 55 Z"
          fill="currentColor"
          className="text-primary"
        />
        
        {/* Hat Cap - Angled and realistic */}
        <path
          d="M25 50 L75 50 L50 30 Z"
          fill="currentColor"
          className="text-primary"
        />
        
        {/* Hat Band */}
        <path
          d="M30 50 L70 50 L70 52 L30 52 Z"
          fill="currentColor"
          className="text-primary opacity-80"
        />
        
        {/* Hat Base */}
        <path
          d="M30 50 L70 50 L65 60 L35 60 Z"
          fill="currentColor"
          className="text-primary"
        />
        
        {/* Tassel - More detailed */}
        <circle
          cx="50"
          cy="30"
          r="3"
          fill="currentColor"
          className="text-primary"
        />
        <path
          d="M50 27 L50 20"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        />
        <path
          d="M50 20 L45 15"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary"
        />
        <path
          d="M50 20 L55 15"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary"
        />
        
        {/* Additional hat details */}
        <path
          d="M35 50 L65 50"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-primary opacity-60"
        />
      </svg>
    </div>
  )
}
