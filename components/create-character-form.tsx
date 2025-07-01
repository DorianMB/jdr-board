"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Character } from "@/lib/types"
import { useState } from "react"
import { useLanguage } from '@/hooks/use-language'

interface CreateCharacterFormProps {
    onCharacterCreated: (character: Character) => void
    onCancel: () => void
}

export default function CreateCharacterForm({ onCharacterCreated, onCancel }: CreateCharacterFormProps) {
    const { t } = useLanguage();
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
                <Label htmlFor="character-name">{t('characterName')} *</Label>
                <Input
                    id="character-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('characterName') + '...'}
                    className="mt-1"
                    required
                />
            </div>

            <div>
                <Label htmlFor="character-type">{t('characterType')}</Label>
                <Select value={type} onValueChange={(value: "player" | "ally" | "enemy") => setType(value)}>
                    <SelectTrigger className="mt-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="player">{t('player')}</SelectItem>
                        <SelectItem value="ally">{t('ally')}</SelectItem>
                        <SelectItem value="enemy">{t('enemy')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="character-image">{t('imageUrl')} ({t('optional') || 'optional'})</Label>
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
                        <div className="text-sm text-gray-600 mb-1">{t('preview') || 'Preview:'}</div>
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
                                    alt={t('characterPreviewAlt') || 'Character preview'}
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
                                {name || t('characterName')} ({type === "player" ? t('player') : type === "ally" ? t('ally') : t('enemy')})
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    {t('cancel')}
                </Button>
                <Button type="submit" disabled={!name.trim() || isSubmitting}>
                    {isSubmitting ? (t('creating') || 'Creating...') : (t('createCharacter') || 'Create Character')}
                </Button>
            </div>
        </form>
    )
}
