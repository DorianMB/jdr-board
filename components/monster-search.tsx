"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function MonsterSearch() {

    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [monsters, setMonsters] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Charger la liste des monstres au montage
    React.useEffect(() => {
        const fetchMonsters = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data/bestiary/bestiary-mm.json`
                );
                if (!response.ok) {
                    throw new Error(t('monsterSearchError'));
                }
                const data = await response.json();
                setMonsters(data.monster);
            } catch (err: any) {
                setError(err.message || t('monsterSearchUnknownError'));
            } finally {
                setLoading(false);
            }
        };
        fetchMonsters();
    }, [t]);

    // Filtrage dynamique
    const filteredMonsters = monsters.filter((monster) =>
        monster.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-4 flex items-center gap-2">
                <Input
                    id="monster-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('monsterSearchPlaceholder')}
                    className="flex-1"
                />
            </div>
            {loading && <div className="text-center py-4">{t('monsterSearchLoading')}</div>}
            {error && <div className="text-red-500 text-center py-4">{error}</div>}
            {!loading && !error && (
                <div className="overflow-y-auto max-h-[60vh] border rounded bg-white shadow">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-2 py-2 text-left">{t('monsterSearchName')}</th>
                                <th className="px-2 py-2 text-left">{t('monsterSearchCR')}</th>
                                <th className="px-2 py-2 text-left">{t('monsterSearchType')}</th>
                                <th className="px-2 py-2 text-left">{t('monsterSearchSource')}</th>
                                <th className="px-2 py-2 text-left">{t('monsterSearchHP')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMonsters.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-4">{t('monsterSearchNoResult')}</td>
                                </tr>
                            )}
                            {filteredMonsters.map((monster) => (
                                <tr key={monster.name + monster.source} className="border-b hover:bg-gray-50">
                                    <td className="px-2 py-1 font-medium">{monster.name}</td>
                                    <td className="px-2 py-1">{monster.cr}</td>
                                    <td className="px-2 py-1">{monster.type}</td>
                                    <td className="px-2 py-1">{monster.source}</td>
                                    <td className="px-2 py-1">{typeof monster.hp === 'object' ? monster.hp.average : monster.hp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
