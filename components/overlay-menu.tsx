"use client"

import { ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OverlayMenuProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    side: "left" | "right"
    className?: string
}

export default function OverlayMenu({
    isOpen,
    onClose,
    title,
    children,
    side,
    className = ""
}: OverlayMenuProps) {
    if (!isOpen) return null

    const sideClasses = side === "left"
        ? "left-4 top-16"
        : "right-4 top-16"

    return (
        <div className={`fixed ${sideClasses} z-[100] w-80 max-h-[calc(100vh-80px)] bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold">{title}</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 hover:bg-gray-200"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(100vh-140px)] p-4">
                {children}
            </div>
        </div>
    )
}
