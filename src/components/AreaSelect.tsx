import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, MapPin, Search } from 'lucide-react';
import { LAHORE_AREAS, type LahoreArea } from '../lib/lahoreAreas';

interface AreaSelectProps {
  value: string;
  /** Fired with the full area (name + coords) so the parent can move the map. */
  onSelect: (area: LahoreArea) => void;
}

/** Searchable dropdown of Lahore areas, styled to match the address form inputs. */
export default function AreaSelect({ value, onSelect }: AreaSelectProps) {
  const [open, setOpen] = useState(false);
  // Open the panel upward when there isn't enough room below the field.
  const [dropUp, setDropUp] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    if (!open && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      setDropUp(window.innerHeight - rect.bottom < 300 && rect.top > 300);
    }
    setOpen((o) => !o);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LAHORE_AREAS;
    return LAHORE_AREAS.filter((a) => a.name.toLowerCase().includes(q));
  }, [query]);

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const pick = (area: LahoreArea) => {
    onSelect(area);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        className="w-full flex items-center gap-2.5 bg-zinc-950 border border-white/5 hover:border-white/10 focus:border-primary-peach rounded-xl pl-4 pr-10 py-3 text-sm text-left focus:outline-none transition-colors cursor-pointer"
      >
        <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
        <span className={`truncate ${value ? 'text-white' : 'text-zinc-600'}`}>
          {value || 'Select your area in Lahore…'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-500 absolute right-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className={`absolute z-30 w-full rounded-xl border border-white/10 bg-zinc-950 shadow-2xl overflow-hidden ${
            dropUp ? 'bottom-full mb-2' : 'mt-2'
          }`}
        >
          <div className="relative p-2 border-b border-white/5">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (filtered.length > 0) pick(filtered[0]);
                } else if (e.key === 'Escape') {
                  setOpen(false);
                }
              }}
              placeholder="Search area…"
              className="w-full bg-zinc-900 border border-white/5 focus:border-primary-peach rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:outline-none transition-colors placeholder:text-zinc-600"
            />
          </div>
          <ul className="max-h-44 sm:max-h-52 overflow-y-auto">
            {filtered.map((area) => (
              <li key={area.name}>
                <button
                  type="button"
                  onClick={() => pick(area)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer hover:bg-white/5 ${
                    area.name === value ? 'text-primary-peach' : 'text-zinc-300'
                  }`}
                >
                  {area.name}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-xs text-zinc-600">No matching area found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
