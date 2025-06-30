'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/hooks/use-language'
import { Language } from '@/lib/translations'

const languageOptions = [
    { value: 'fr' as Language, label: 'Français', flag: '🇫🇷' },
    { value: 'en' as Language, label: 'English', flag: '🇺🇸' }
]

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage()

    const currentLanguage = languageOptions.find(option => option.value === language)

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                <SelectTrigger className="w-auto min-w-[48px] bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-gray-50 shadow-lg">
                    <SelectValue>
                        <div className="flex items-center justify-center">
                            <span className="text-xl">{currentLanguage?.flag}</span>
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{option.flag}</span>
                                <span>{option.label}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
