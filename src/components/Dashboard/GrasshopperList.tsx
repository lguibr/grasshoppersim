import React, { useState, useMemo } from 'react';
import { CricketStat } from '../../store';
import { GrasshopperCard } from './GrasshopperCard';
import { ScrollArea } from '../ui/scroll-area';
import { ArrowUpDown } from 'lucide-react';

type SortField = 'id' | 'health' | 'speed' | 'aggressiveness' | 'jumpDistance' | 'age';

export const GrasshopperList = ({ stats, followedId, onFollow }: { stats: CricketStat[], followedId: number | null, onFollow: (id: number) => void }) => {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDesc, setSortDesc] = useState(true);

  const sortedStats = useMemo(() => {
    const now = Date.now();
    return [...stats].sort((a, b) => {
      let valA, valB;
      switch (sortField) {
        case 'health': valA = a.health; valB = b.health; break;
        case 'speed': valA = a.traits.speed; valB = b.traits.speed; break;
        case 'aggressiveness': valA = a.traits.aggressiveness; valB = b.traits.aggressiveness; break;
        case 'jumpDistance': valA = a.traits.jumpDistance; valB = b.traits.jumpDistance; break;
        case 'age': valA = now - a.birthTime; valB = now - b.birthTime; break;
        default: valA = a.id; valB = b.id; break;
      }
      return sortDesc ? valB - valA : valA - valB;
    });
  }, [stats, sortField, sortDesc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(true);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between px-2 py-1 mb-2 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800">
        <button onClick={() => handleSort('id')} className="flex items-center gap-1 hover:text-slate-300">ID <ArrowUpDown size={10}/></button>
        <div className="flex gap-3">
          <button onClick={() => handleSort('age')} className="flex items-center gap-1 hover:text-blue-400">AGE <ArrowUpDown size={10}/></button>
          <button onClick={() => handleSort('health')} className="flex items-center gap-1 hover:text-emerald-400">ENG <ArrowUpDown size={10}/></button>
          <button onClick={() => handleSort('speed')} className="flex items-center gap-1 hover:text-amber-400">SPD <ArrowUpDown size={10}/></button>
          <button onClick={() => handleSort('aggressiveness')} className="flex items-center gap-1 hover:text-rose-400">AGR <ArrowUpDown size={10}/></button>
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0 w-full pr-3">
        <div className="flex flex-col gap-1 pb-4">
          {sortedStats.map((stat) => (
            <GrasshopperCard 
              key={stat.id}
              stat={stat} 
              isFollowed={followedId === stat.id} 
              onFollow={onFollow} 
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
