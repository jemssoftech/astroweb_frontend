"use client";

import Iconify from "./Iconify";

type Ayanamsa =
  | "RAMAN"
  | "LAHIRI"
  | "KRISHNAMURTI"
  | "YUKTESHWAR"
  | "JN_BHASIN"
  | "FAGAN_BRADLEY";

interface Props {
  selectedAyanamsa: Ayanamsa;
  onAyanamsaChange: (ayanamsa: Ayanamsa) => void;
}

export default function AyanamsaSelector({
  selectedAyanamsa,
  onAyanamsaChange,
}: Props) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-foreground/80 mb-1">
        Ayanamsa
      </label>
      <div className="flex">
        <span className="flex items-center px-3 bg-input border border-r-0 border-border rounded-l-md">
          <Iconify icon="mdi:zodiac-leo" width={20} height={20} />
        </span>
        <select
          className="flex-1 px-3 py-2 border border-border rounded-r-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
          value={selectedAyanamsa}
          onChange={(e) => onAyanamsaChange(e.target.value as Ayanamsa)}
        >
          <option value="RAMAN">Raman</option>
          <option value="LAHIRI">Lahiri</option>
          <option value="KRISHNAMURTI">Krishnamurti</option>
          <option value="YUKTESHWAR">Yukteshwar</option>
          <option value="JN_BHASIN">J.N. Bhasin</option>
          <option value="FAGAN_BRADLEY">Fagan Bradley</option>
        </select>
      </div>
    </div>
  );
}
