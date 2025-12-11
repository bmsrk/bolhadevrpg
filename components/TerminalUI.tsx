import { useEffect, useRef, memo } from 'react';
import { GameState, LogEntry } from '../types';
import { Terminal, Cpu, Users, Clover, Heart } from 'lucide-react';

const LogDisplayComponent = ({ logs }: { logs: LogEntry[] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-lg crt-flicker">
      {logs.map((log) => (
        <div key={log.id} className={`
          ${log.type === 'info' ? 'text-green-400' : ''}
          ${log.type === 'combat' ? 'text-red-400' : ''}
          ${log.type === 'dialogue' ? 'text-yellow-300' : ''}
          ${log.type === 'system' ? 'text-blue-400 italic' : ''}
          ${log.type === 'success' ? 'text-cyan-400 font-bold' : ''}
          ${log.type === 'failure' ? 'text-red-600 font-bold' : ''}
        `}>
          <span className="opacity-50 mr-2">[{log.sender || 'SYS'}]</span>
          <span>{log.text}</span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
LogDisplayComponent.displayName = 'LogDisplay';
export const LogDisplay = memo(LogDisplayComponent);

const StatsSidebarComponent = ({ gameState }: { gameState: GameState }) => {
  const { player } = gameState;
  if (!player.archetype) return null;

  return (
    <div className="w-full md:w-64 border-l border-green-900 bg-black/80 p-4 flex flex-col gap-4 text-green-500 font-mono">
      <div className="border-b border-green-800 pb-2 mb-2">
        <h2 className="text-xl font-bold uppercase text-shadow-glow">{player.archetype.name}</h2>
        <p className="text-xs opacity-70">Lvl 1 Dev</p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="flex items-center gap-2"><Heart size={16} /> SANITY (HP)</span>
            <span>{player.hp}/{player.maxHp}</span>
          </div>
          <div className="w-full bg-green-900/30 h-2">
            <div 
              className="bg-green-500 h-full transition-all duration-500" 
              style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
            ></div>
          </div>
        </div>

        <div>
           <div className="flex justify-between items-center mb-1">
            <span className="flex items-center gap-2"><Users size={16} /> FOLLOWERS</span>
            <span>{player.followers}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="border border-green-800 p-2 flex flex-col items-center">
            <Terminal size={16} className="mb-1" />
            <span>WIT: {player.attributes.Wit}</span>
          </div>
          <div className="border border-green-800 p-2 flex flex-col items-center">
            <Cpu size={16} className="mb-1" />
            <span>CRAFT: {player.attributes.Craft}</span>
          </div>
          <div className="border border-green-800 p-2 flex flex-col items-center">
            <Users size={16} className="mb-1" />
            <span>SOC: {player.attributes.Social}</span>
          </div>
          <div className="border border-green-800 p-2 flex flex-col items-center">
            <Clover size={16} className="mb-1" />
            <span>LUCK: {player.attributes.Luck}</span>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="border-b border-green-800 mb-2 font-bold">INVENTORY</h3>
          <ul className="text-sm space-y-1">
            {player.inventory.length === 0 && <li className="opacity-50 text-xs italic">Mochila vazia...</li>}
            {player.inventory.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto pt-4 border-t border-green-800">
             <h3 className="font-bold text-xs mb-1">QUEST: SALVAR RELEASE</h3>
             <div className="w-full bg-green-900/30 h-1">
                <div 
                  className="bg-yellow-500 h-full transition-all duration-500" 
                  style={{ width: `${gameState.questProgress}%` }}
                ></div>
             </div>
        </div>
      </div>
    </div>
  );
};
StatsSidebarComponent.displayName = 'StatsSidebar';
export const StatsSidebar = memo(StatsSidebarComponent);

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  subtext?: string;
  disabled?: boolean;
}

const ActionButtonComponent: React.FC<ActionButtonProps> = ({ onClick, label, subtext, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-full text-left p-3 border border-green-700 bg-black hover:bg-green-900/30 
      transition-all group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed
      font-mono
    `}
  >
    <div className="relative z-10 flex flex-col">
      <span className="font-bold text-green-400 group-hover:text-green-200">
        <span className="mr-2 animate-pulse">{'>'}</span> {label}
      </span>
      {subtext && <span className="text-xs text-green-600 group-hover:text-green-400 ml-4">{subtext}</span>}
    </div>
  </button>
);
ActionButtonComponent.displayName = 'ActionButton';
export const ActionButton = memo(ActionButtonComponent);