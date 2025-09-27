"use client";
import MotionProvider from "./MotionProvider";
import PageTransition from "./PageTransition";

interface ClientMotionWrapperProps {
  children: React.ReactNode;
}

export default function ClientMotionWrapper({ children }: ClientMotionWrapperProps) {
  return (
    <MotionProvider>
      <PageTransition>{children}</PageTransition>
    </MotionProvider>
  );
}

