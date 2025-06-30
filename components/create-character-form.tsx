"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Character } from "@/lib/types"
import { useState } from "react"

interface CreateCharacterFormProps {
    onCharacterCreated: (character: Character) => void
    onCancel: () => void
}

export default function CreateCharacterForm({ onCharacterCreated, onCancel }: CreateCharacterFormProps) {
    const [name, setName] = useState("")
    const [type, setType] = useState<"player" | "ally" | "enemy">("player")
    const [imageUrl, setImageUrl] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            return
        }

        setIsSubmitting(true)

        try {
            const newCharacter: Character = {
                id: Date.now().toString(),
                name: name.trim(),
                type,
                imageUrl: imageUrl.trim(),
            }

            onCharacterCreated(newCharacter)

            // Reset form
            setName("")
            setType("player")
            setImageUrl("")
        } catch (error) {
            console.error("Error creating character:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="character-name">Character Name *</Label>
                <Input
                    id="character-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter character name..."
                    className="mt-1"
                    required
                />
            </div>

            <div>
                <Label htmlFor="character-type">Character Type</Label>
                <Select value={type} onValueChange={(value: "player" | "ally" | "enemy") => setType(value)}>
                    <SelectTrigger className="mt-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="player">Player</SelectItem>
                        <SelectItem value="ally">Ally</SelectItem>
                        <SelectItem value="enemy">Enemy</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="character-image">Character Image URL (optional)</Label>
                <Input
                    id="character-image"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/character-image.jpg"
                    className="mt-1"
                />
                {imageUrl && (
                    <div className="mt-2">
                        <div className="text-sm text-gray-600 mb-1">Preview:</div>
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-white font-bold text-sm ${type === "player"
                                        ? "border-green-500 bg-green-600"
                                        : type === "ally"
                                            ? "border-blue-500 bg-blue-600"
                                            : "border-red-500 bg-red-600"
                                    }`}
                            >
                                <img
                                    src={imageUrl}
                                    alt="Character preview"
                                    className="w-full h-full rounded-full object-cover"
                                    onError={(e) => {
                                        // Fallback to initials if image fails to load
                                        const target = e.target as HTMLImageElement
                                        target.style.display = "none"
                                        target.nextElementSibling!.textContent = name.charAt(0).toUpperCase() || "?"
                                    }}
                                />
                                <span className="hidden"></span>
                            </div>
                            <div className="text-sm text-gray-600">
                                {name || "Character Name"} ({type})
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={!name.trim() || isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Character"}
                </Button>
            </div>
        </form>
    )
}
