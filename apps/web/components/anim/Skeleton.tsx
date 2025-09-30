"use client";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export default function Skeleton({ className = "", width = "w-full", height = "h-6" }: SkeletonProps) {
  return (
    <div className={`skeleton ${width} ${height} ${className}`} />
  );
}




