"use client";

import { ReactNode } from "react";

const Varient = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-500 text-white hover:bg-gray-600",
}

const Size = {
  small : "px-2 py-1 text-sm",
  medium : "px-4 py-2",
  onClick: () => void 0,
  large : "px-6 py-3 text-lg"
}

interface ButtonProps {
  varient: keyof typeof Varient;
  size: keyof typeof Size;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}

export const Button = ({ className, varient, size, children , onClick}: ButtonProps) => {
  return (
    <button
      className={`${Varient[varient]} ${Size[size]} ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
