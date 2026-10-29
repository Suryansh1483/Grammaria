"use client";

import { Territory } from '@/types/game';
import { SpecialTerritoryView } from './SpecialTerritoryView';
import { CentraliaView } from './CentraliaView';

interface TerritoryModalProps {
  territory: Territory | null;
  onClose: () => void;
  onStartAttack: (territory: Territory) => void;
}

export function TerritoryModal({ territory, onClose, onStartAttack }: TerritoryModalProps) {
  if (!territory) return null;
  if (territory.id === 'centralia') return <CentraliaView key={territory.id} territory={territory} onClose={onClose} />;
  return <SpecialTerritoryView key={territory.id} territory={territory} onClose={onClose} onStartAttack={onStartAttack} />;
}
