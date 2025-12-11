import type React from 'react';
import { useState } from 'react';
import { useSetupStore } from '../../application/setupStore';
import type { Citizen } from '../../data/citizens';

const CORNER_DISTRICTS = [0, 3, 12, 15];
const MAX_IN_CORNER = 2;
const MAX_IN_OTHER = 1;

const DISTRICT_IDS = [
  'd0',
  'd1',
  'd2',
  'd3',
  'd4',
  'd5',
  'd6',
  'd7',
  'd8',
  'd9',
  'd10',
  'd11',
  'd12',
  'd13',
  'd14',
  'd15',
];

type DistrictData = {
  index: number;
  citizens: Citizen[];
  isCorner: boolean;
  max: number;
};

type DistrictInfoProps = {
  district: DistrictData;
  onClose: () => void;
  onRemove: (id: string) => void;
};

const DistrictInfo: React.FC<DistrictInfoProps> = ({ district, onClose, onRemove }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        role="document"
        className="relative max-w-xs w-full bg-zinc-900 border border-zinc-700 p-5"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-1 right-6 w-3 h-6 rounded-b-sm bg-red-600" />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-300"
        >
          ✕
        </button>

        <h3 className="text-lg font-bold text-zinc-200 uppercase tracking-wide mb-1">
          Квартал [{Math.floor(district.index / 4)},{district.index % 4}]
        </h3>
        <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-4">
          {district.isCorner ? 'Угловой • макс. 2' : 'Обычный • макс. 1'}
        </p>

        <div className="space-y-2">
          {district.citizens.length === 0 ? (
            <p className="text-zinc-500 text-sm italic">Пусто</p>
          ) : (
            district.citizens.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2 bg-zinc-800/50 border border-zinc-700"
              >
                <div className="flex items-center gap-2">
                  <span>{c.gender === 'MALE' ? '👨' : '👩'}</span>
                  <div>
                    <p className="text-sm text-zinc-300">{c.role}</p>
                    <p className="text-[10px] text-zinc-600">{c.faction}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(c.id)}
                  className="text-red-500 hover:text-red-400 text-xs"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

type DistrictCellProps = {
  districtId: string;
  index: number;
  citizens: Citizen[];
  max: number;
  isCorner: boolean;
  canPlace: boolean;
  onClick: () => void;
};

const DistrictCell: React.FC<DistrictCellProps> = ({
  citizens,
  max,
  isCorner,
  canPlace,
  onClick,
}) => {
  const isFull = isCorner ? citizens.length === MAX_IN_CORNER : citizens.length >= 1;

  let borderClass = 'border-zinc-800 bg-zinc-900/40';
  if (canPlace) {
    borderClass = 'border-red-500 bg-red-950/30 scale-105';
  } else if (isCorner) {
    borderClass = isFull ? 'border-zinc-700 bg-zinc-800/60' : 'border-amber-700/50 bg-amber-950/20';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`aspect-square p-1 border transition-all flex flex-col items-center justify-center relative ${borderClass}`}
    >
      {isCorner && (
        <div
          className={`absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full ${isFull ? 'bg-green-600' : 'bg-amber-600'}`}
        />
      )}

      <span
        className={`text-[10px] font-medium ${citizens.length > 0 ? 'text-zinc-400' : 'text-zinc-700'}`}
      >
        {citizens.length}/{max}
      </span>

      <div className="flex flex-wrap justify-center gap-0.5 mt-0.5">
        {citizens.slice(0, 2).map((c) => (
          <span key={c.id} className="text-[10px]">
            {c.gender === 'MALE' ? '👨' : '👩'}
          </span>
        ))}
      </div>
    </button>
  );
};

export const PlaceCitizensStep: React.FC = () => {
  const { setupState, placeCitizen, removeCitizen, autoPlaceCitizens, nextPhase } = useSetupStore();
  const [selectedCitizen, setSelectedCitizen] = useState<string | null>(null);
  const [viewDistrict, setViewDistrict] = useState<number | null>(null);

  const placedCount = setupState.placedCitizens.length;
  const totalCitizens = setupState.availableCitizens.length;

  const unplacedCitizens = setupState.availableCitizens.filter(
    (c) => !setupState.placedCitizens.some((p) => p.citizenId === c.id),
  );

  const getCitizensInDistrict = (idx: number): Citizen[] => {
    const ids = setupState.placedCitizens
      .filter((p) => p.districtIndex === idx)
      .map((p) => p.citizenId);
    return setupState.availableCitizens.filter((c) => ids.includes(c.id));
  };

  const getMaxInDistrict = (idx: number) =>
    CORNER_DISTRICTS.includes(idx) ? MAX_IN_CORNER : MAX_IN_OTHER;

  const isReady = () => {
    if (placedCount !== totalCitizens) {
      return false;
    }
    for (const corner of CORNER_DISTRICTS) {
      if (getCitizensInDistrict(corner).length !== MAX_IN_CORNER) {
        return false;
      }
    }
    return true;
  };

  const handleDistrictClick = (idx: number) => {
    const citizens = getCitizensInDistrict(idx);
    const max = getMaxInDistrict(idx);

    if (selectedCitizen && citizens.length < max) {
      placeCitizen(selectedCitizen, idx);
      setSelectedCitizen(null);
    } else if (citizens.length > 0) {
      setViewDistrict(idx);
    }
  };

  const ready = isReady();

  return (
    <div className="w-full flex flex-col h-full">
      {viewDistrict !== null && (
        <DistrictInfo
          district={{
            index: viewDistrict,
            citizens: getCitizensInDistrict(viewDistrict),
            isCorner: CORNER_DISTRICTS.includes(viewDistrict),
            max: getMaxInDistrict(viewDistrict),
          }}
          onClose={() => setViewDistrict(null)}
          onRemove={(id) => {
            removeCitizen(id);
            setViewDistrict(null);
          }}
        />
      )}

      <div className="text-center mb-3">
        <p className="text-zinc-500 text-xs italic mb-2">"Город оживает..."</p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-800 bg-zinc-900/50">
          <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Жители:</span>
          <span className={`text-sm font-bold ${ready ? 'text-red-500' : 'text-zinc-400'}`}>
            {placedCount}
          </span>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-zinc-600">{totalCitizens}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 mb-3">
        {DISTRICT_IDS.map((districtId, i) => {
          const citizens = getCitizensInDistrict(i);
          const max = getMaxInDistrict(i);
          const isCorner = CORNER_DISTRICTS.includes(i);
          const canPlace = Boolean(selectedCitizen && citizens.length < max);

          return (
            <DistrictCell
              key={districtId}
              districtId={districtId}
              index={i}
              citizens={citizens}
              max={max}
              isCorner={isCorner}
              canPlace={canPlace}
              onClick={() => handleDistrictClick(i)}
            />
          );
        })}
      </div>

      <div className="flex justify-center gap-3 text-[9px] text-zinc-600 mb-3">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-600" /> Угол ✓
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-600" /> Угол (нужно 2)
        </span>
      </div>

      {selectedCitizen && (
        <p className="text-center text-red-400 text-[11px] mb-2">
          ↑ Тапните на квартал для размещения
        </p>
      )}

      {unplacedCitizens.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5 px-1">
            Не размещены: {unplacedCitizens.length}
          </p>
          <div
            className="flex gap-1.5 overflow-x-auto pb-2 px-1"
            style={{ scrollbarWidth: 'thin' }}
          >
            {unplacedCitizens.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setSelectedCitizen(c.id === selectedCitizen ? null : c.id)}
                className={`
                  flex-shrink-0 px-2 py-1.5 border transition-all flex items-center gap-1
                  ${
                    selectedCitizen === c.id
                      ? 'border-red-600 bg-red-950/40 scale-105'
                      : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                  }
                `}
              >
                <span className="text-sm">{c.gender === 'MALE' ? '👨' : '👩'}</span>
                <span className="text-[10px] text-zinc-400 whitespace-nowrap">{c.role}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={autoPlaceCitizens}
        className="w-full py-2.5 text-[11px] uppercase tracking-wider text-zinc-500 border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 hover:text-zinc-400 transition-all mb-3"
      >
        ⚄ Авто-расстановка по правилам
      </button>

      <div className="mt-auto pt-3 border-t border-zinc-800/50">
        <button
          type="button"
          onClick={nextPhase}
          disabled={!ready}
          className={`
            w-full py-4 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold 
            border transition-all duration-300
            ${
              ready
                ? 'bg-transparent text-zinc-300 border-zinc-600 hover:border-red-600 hover:text-red-400 hover:shadow-[0_0_20px_rgba(185,28,28,0.2)]'
                : 'bg-zinc-900/30 text-zinc-700 border-zinc-800/50 cursor-not-allowed'
            }
          `}
          style={{ minHeight: '52px' }}
        >
          {ready ? 'Подтвердить →' : 'Разместите всех жителей'}
        </button>
      </div>
    </div>
  );
};
