import React from "react"
import Image from "next/image"

interface PngLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  src?: string
}

export function PngLogo({ className = "", size = "md", src = "/logo.png" }: PngLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt="mycollegemap logo"
        width={64}
        height={64}
        className={`${sizeClasses[size]} object-contain`}
        priority
      />
    </div>
  )
}
