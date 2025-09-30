"use client";
import { motion } from "framer-motion";
export const MDiv = motion.div;
export const MButton = motion.button;

export const hoverScale = { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };
export const fadeInUp = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };
export const fadeIn =   { initial: { opacity: 0 },           animate: { opacity: 1 } };




