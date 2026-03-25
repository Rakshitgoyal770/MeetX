import React from 'react';
import { Square, Circle, Minus } from "lucide-react";

export default function IconButton({
    icon,
    onClick,
    activated
} : {
    icon: React.ReactNode;
    onClick: () => void;
    activated: boolean;

}) {
    return (
        <button onClick={onClick} className={`p-2 rounded-md hover:bg-gray-200 ${activated ? 'bg-gray-300' : 'bg-white'}`}>
            {icon}
        </button>
    )
}