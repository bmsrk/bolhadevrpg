import { useState, useCallback, useMemo } from 'react';
import { GameState, LogEntry, CharacterArchetype, Enemy, Location } from './types';
import { ARCHETYPES, LOCATIONS, ENEMIES, ITEMS } from './constants';
import { LogDisplay, StatsSidebar, ActionButton } from './components/TerminalUI';
import { rollDice, resolveCombatRound } from './utils/dice';
import { Terminal, Skull, Trophy } from 'lucide-react';

// Attribute mapping for combat actions - defined as constant to avoid recreating
const ATTRIBUTE_MAP = {
  'WIT': 'Wit',
  'CRAFT': 'Craft',
  'SOCIAL': 'Social'
} as const;

const INITIAL_STATE: GameState = {
  screen: 'START',
  player: {
    archetype: null,
    hp: 20,
    maxHp: 20,
    attributes: { Wit: 1, Craft: 1, Social: 1, Luck: 1 },
    inventory: [],
    followers: 100,
  },
  currentLocation: LOCATIONS[0],
  currentEnemy: null,
  questProgress: 0,
  logs: [],
  turn: 0,
};

const App = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  const addLog = useCallback((text: string, type: LogEntry['type'] = 'info', sender: string = 'GAME') => {
    setGameState(prev => ({
      ...prev,
      logs: [...prev.logs, { id: Date.now().toString() + Math.random(), text, type, sender }]
    }));
  }, []);

  // --- Actions ---

  const startGame = () => {
    setGameState({ ...INITIAL_STATE, screen: 'CLASS_SELECT', logs: [] });
    addLog("Inicializando BOLHADEV_OS v2.0...", 'system');
    addLog("Detectado novo usuário. Selecione seu arquétipo de sofrimento.", 'info');
  };

  const selectClass = (archetype: CharacterArchetype) => {
    setGameState(prev => ({
      ...prev,
      screen: 'EXPLORE',
      player: {
        ...prev.player,
        archetype,
        attributes: { ...archetype.starting_attributes },
        hp: 20,
        maxHp: 20,
      }
    }));
    addLog(`Arquétipo ${archetype.name} selecionado.`, 'success');
    addLog(`Bem-vindo ao ${LOCATIONS[0].name}. ${LOCATIONS[0].desc}`, 'info');
    addLog("MISSÃO: Uma feature crítica precisa ir pro ar. O CI está vermelho. Boa sorte.", 'system');
  };

  const moveLocation = useCallback((location: Location) => {
    // 30% chance of encounter when moving
    const encounterRoll = Math.random();
    let nextScreen: GameState['screen'] = 'EXPLORE';
    let enemy: Enemy | null = null;

    if (encounterRoll < 0.4) {
      nextScreen = 'COMBAT';
      const randomEnemy = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
      enemy = { ...randomEnemy, hp: randomEnemy.hp }; // clone to avoid mutating constant
      addLog(`ALERTA: ${enemy.name} bloqueia o caminho!`, 'combat');
      addLog(`"${enemy.desc}"`, 'dialogue', enemy.name);
    } else {
      addLog(`Você chegou em ${location.name}.`, 'info');
      addLog(location.desc, 'system');
      
      // Random flavor text or small item find
      if (Math.random() > 0.7) {
        const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        setGameState(prev => ({
            ...prev,
            player: { ...prev.player, inventory: [...prev.player.inventory, item] }
        }));
        addLog(`Você encontrou: ${item.name} abandonado no chão.`, 'success');
      }
    }

    setGameState(prev => ({
      ...prev,
      screen: nextScreen,
      currentLocation: location,
      currentEnemy: enemy
    }));
  }, [addLog]);

  const handleCombatAction = useCallback((actionType: 'WIT' | 'CRAFT' | 'SOCIAL') => {
    if (!gameState.currentEnemy || !gameState.player.archetype) return;

    const playerAttr = gameState.player.attributes[ATTRIBUTE_MAP[actionType]];
    // Enemy defends with random attribute for simplicity or specific
    const enemyDef = 2; 

    // Player Turn
    addLog(`Você usou ${actionType}...`, 'info', 'YOU');
    const result = resolveCombatRound(playerAttr, enemyDef);
    
    let damage = result.damage;
    
    // Archetype bonuses
    if (gameState.player.archetype.id === 'maintainer' && actionType === 'CRAFT' && result.damage === 0) {
        // Special: Merge Authority (Fake implementation: guarantee 1 dmg on fail)
        damage = 1;
        addLog("Merge Authority ativado: Force push no argumento.", 'success');
    }

    const newEnemyHp = gameState.currentEnemy.hp - damage;
    addLog(result.narration, 'system');
    
    if (damage > 0) {
        addLog(`Causou ${damage} de dano de ego no ${gameState.currentEnemy.name}!`, 'success');
    } else {
        addLog("Seu argumento foi ignorado.", 'failure');
    }

    if (newEnemyHp <= 0) {
      // Victory
      const questGain = 25;
      const followerGain = 50 + (gameState.player.attributes.Social * 10);
      
      setGameState(prev => ({
        ...prev,
        screen: 'EXPLORE',
        currentEnemy: null,
        questProgress: Math.min(100, prev.questProgress + questGain),
        player: {
            ...prev.player,
            followers: prev.player.followers + followerGain
        }
      }));
      addLog(`${gameState.currentEnemy.name} foi cancelado/refatorado com sucesso!`, 'success');
      addLog(`Ganhou ${followerGain} seguidores e avançou a release.`, 'success');
      
      if (gameState.questProgress + questGain >= 100) {
          addLog("RELEASE DEPLOYED! O build passou! Milagre!", 'success');
          setGameState(prev => ({ ...prev, screen: 'VICTORY' }));
      }
      return;
    }

    // Optimistic update for enemy HP before enemy turn
    setGameState(prev => ({ ...prev, currentEnemy: { ...prev.currentEnemy!, hp: newEnemyHp } }));

    // Enemy Turn (delayed for better UX)
    setTimeout(() => {
        setGameState(prev => {
          if (!prev.currentEnemy) return prev; // safety check
          
          const enemyAttack = prev.currentEnemy.stats.Wit > prev.currentEnemy.stats.Craft ? 'Wit' : 'Craft';
          const enemyAbility = prev.currentEnemy.abilities[Math.floor(Math.random() * prev.currentEnemy.abilities.length)];
          
          addLog(`${prev.currentEnemy.name} usa "${enemyAbility}"!`, 'combat', 'ENEMY');
          
          const enemyRoll = rollDice(prev.currentEnemy.stats[enemyAttack] || 3);
          const playerDefRoll = rollDice(prev.player.attributes.Wit);
          
          const dmgTaken = Math.max(0, enemyRoll.successes - playerDefRoll.successes);
          
          addLog(`Defesa: ${playerDefRoll.message} vs Atk: ${enemyRoll.message}`, 'system');

          if (dmgTaken > 0) {
              addLog(`Você perdeu ${dmgTaken} de Sanidade!`, 'failure');
              const newHp = prev.player.hp - dmgTaken;
              if (newHp <= 0) {
                  return { ...prev, player: { ...prev.player, hp: 0 }, screen: 'GAME_OVER' };
              }
              return { ...prev, currentEnemy: { ...prev.currentEnemy, hp: newEnemyHp }, player: { ...prev.player, hp: newHp } };
          } else {
              addLog("Você tankou o ataque com sua indiferença cínica.", 'info');
              return { ...prev, currentEnemy: { ...prev.currentEnemy, hp: newEnemyHp } };
          }
        });
    }, 1000);
  }, [gameState.currentEnemy, gameState.player, gameState.questProgress, addLog]);
  
  const flee = useCallback(() => {
      addLog("Você tentou fugir da discussão...", 'info');
      if (Math.random() > 0.5) {
          addLog("Sucesso! Você mutou a thread.", 'success');
          setGameState(prev => ({...prev, screen: 'EXPLORE', currentEnemy: null}));
      } else {
          addLog("Falha! Eles te marcaram no 'quote tweet'.", 'failure');
          // Take minor damage
          setGameState(prev => ({...prev, player: {...prev.player, hp: Math.max(0, prev.player.hp - 1)}}));
      }
  }, [addLog]);

  // --- Rendering Content based on State ---

  const renderContent = () => {
    switch (gameState.screen) {
      case 'START':
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500">
            <h1 className="text-6xl md:text-8xl font-bold text-green-500 text-shadow-glow tracking-tighter text-center">
              BOLHADEV
              <span className="block text-2xl md:text-3xl text-green-700 mt-2">THREADS & BUGS EDITION</span>
            </h1>
            <div className="max-w-md text-center text-green-300 border border-green-800 p-6 bg-black/50">
              <p>O ano é 2024 (ou 2025, o calendário do JS quebrou).</p>
              <p className="mt-4">Sua missão: Sobreviver a uma semana de deploy, brigas de ego e frameworks JS novos.</p>
            </div>
            <button 
                onClick={startGame}
                className="px-8 py-3 bg-green-700 hover:bg-green-600 text-black font-bold text-xl rounded shadow-[0_0_15px_rgba(0,255,0,0.5)] animate-pulse"
            >
                PRESS START
            </button>
          </div>
        );

      case 'CLASS_SELECT':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-full overflow-y-auto">
            <div className="md:col-span-2 text-center mb-4">
              <h2 className="text-2xl text-white">ESCOLHA SEU ARQUÉTIPO</h2>
            </div>
            {ARCHETYPES.map((arch) => (
              <div key={arch.id} className="border border-green-800 p-4 hover:bg-green-900/20 cursor-pointer transition-colors" onClick={() => selectClass(arch)}>
                <h3 className="text-xl font-bold text-green-400">{arch.name}</h3>
                <p className="text-sm text-gray-400 italic mb-2">{arch.description}</p>
                <div className="text-xs grid grid-cols-2 gap-2 text-green-600">
                    <div>Wit: {arch.starting_attributes.Wit}</div>
                    <div>Craft: {arch.starting_attributes.Craft}</div>
                    <div>Social: {arch.starting_attributes.Social}</div>
                    <div>Luck: {arch.starting_attributes.Luck}</div>
                </div>
                <div className="mt-2 text-xs text-yellow-600 border-t border-green-900 pt-1">
                    Trait: {arch.special}
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'GAME_OVER':
          return (
              <div className="flex flex-col items-center justify-center h-full text-center">
                  <Skull size={64} className="text-red-500 mb-4" />
                  <h1 className="text-4xl text-red-500 font-bold mb-4">BURNOUT CRÍTICO</h1>
                  <p className="mb-8">Você foi cancelado. Seu código foi reescrito por uma IA júnior. Fim de jogo.</p>
                  <button onClick={() => setGameState(INITIAL_STATE)} className="border border-red-500 text-red-500 px-4 py-2 hover:bg-red-900/20">REBOOT SYSTEM</button>
              </div>
          );

      case 'VICTORY':
          return (
              <div className="flex flex-col items-center justify-center h-full text-center">
                  <Trophy size={64} className="text-yellow-500 mb-4" />
                  <h1 className="text-4xl text-yellow-500 font-bold mb-4">RELEASE SUCCESSFUL</h1>
                  <p className="mb-8">O build passou. Os stakeholders estão felizes (por 15 minutos). Descanse, guerreiro.</p>
                  <button onClick={() => setGameState(INITIAL_STATE)} className="border border-yellow-500 text-yellow-500 px-4 py-2 hover:bg-yellow-900/20">NEW GAME+</button>
              </div>
          );

      default:
        // Main Gameplay loop is handled by the persistent layout below, 
        // this section handles the "Active View" logic if we wanted specific visuals,
        // but for MUD style, mostly Logs + Actions drive the UI.
        return null;
    }
  };

  const handleRest = useCallback(() => {
    const heal = Math.ceil(Math.random() * 3);
    setGameState(prev => ({...prev, player: {...prev.player, hp: Math.min(prev.player.maxHp, prev.player.hp + heal)}}));
    addLog(`Você scrollou a timeline. Recuperou ${heal} de Sanidade.`, 'success');
  }, [addLog]);

  // Memoize enemy max HP lookup
  const enemyMaxHp = useMemo(() => {
    if (!gameState.currentEnemy) return 0;
    return ENEMIES.find(e => e.id === gameState.currentEnemy?.id)?.hp || 0;
  }, [gameState.currentEnemy?.id]);

  // --- Dynamic Action Buttons ---
  const getActions = useMemo(() => {
      if (gameState.screen === 'EXPLORE') {
          return (
              <>
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Navigation</div>
                {LOCATIONS.filter(l => l.id !== gameState.currentLocation.id).map(loc => (
                    <ActionButton key={loc.id} label={`Ir para ${loc.name}`} onClick={() => moveLocation(loc)} subtext="Mover" />
                ))}
                <div className="text-xs text-gray-500 mt-4 mb-2 uppercase tracking-widest">System</div>
                <ActionButton label="Checar Twitter (Rest)" onClick={handleRest} subtext="Recuperar HP" />
              </>
          );
      }
      
      if (gameState.screen === 'COMBAT') {
          const enemyHpPercent = gameState.currentEnemy ? (gameState.currentEnemy.hp / enemyMaxHp) * 100 : 0;
          return (
              <>
                <div className="text-xs text-red-500 mb-2 uppercase tracking-widest animate-pulse">COMBAT MODE</div>
                <div className="mb-4 p-2 border border-red-900 bg-red-900/10">
                    <p className="text-red-400 font-bold">{gameState.currentEnemy?.name}</p>
                    <div className="w-full bg-red-900/30 h-2 mt-1">
                         <div className="bg-red-500 h-full" style={{width: `${enemyHpPercent}%`}}></div>
                    </div>
                </div>
                
                <ActionButton label="Argumentar (Wit)" onClick={() => handleCombatAction('WIT')} subtext={`Roll ${gameState.player.attributes.Wit}d6`} />
                <ActionButton label="Refatorar (Craft)" onClick={() => handleCombatAction('CRAFT')} subtext={`Roll ${gameState.player.attributes.Craft}d6`} />
                <ActionButton label="Ratio / Cancelar (Social)" onClick={() => handleCombatAction('SOCIAL')} subtext={`Roll ${gameState.player.attributes.Social}d6`} />
                
                <div className="mt-4"></div>
                <ActionButton label="Mutar Thread (Fugir)" onClick={flee} subtext="Chance de falha" />
              </>
          );
      }
      return null;
  }, [gameState.screen, gameState.currentLocation.id, gameState.currentEnemy, gameState.player.attributes, enemyMaxHp, moveLocation, handleRest, handleCombatAction, flee]);

  return (
    <div className="flex flex-col h-screen w-full bg-black text-green-500 font-mono relative overflow-hidden">
        {/* CRT Overlay Effects */}
        <div className="crt-overlay absolute inset-0 z-50 pointer-events-none"></div>
        <div className="scanline absolute inset-0 z-40 pointer-events-none"></div>
        
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-green-800 bg-black z-10">
            <div className="flex items-center gap-2">
                <Terminal className="animate-pulse" />
                <span className="font-bold text-xl tracking-wider">BOLHADEV_OS</span>
            </div>
            <div className="text-xs md:text-sm opacity-70">
                v2.0.4-rc1 // {gameState.screen}
            </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden relative z-10">
            
            {/* Conditional Render for Menus vs Game Loop */}
            {(gameState.screen === 'START' || gameState.screen === 'CLASS_SELECT' || gameState.screen === 'GAME_OVER' || gameState.screen === 'VICTORY') ? (
                <main className="w-full h-full flex flex-col relative bg-gray-900/50">
                    {renderContent()}
                </main>
            ) : (
                <>
                    {/* Left: Game Log (The "Monitor") */}
                    <div className="flex-1 flex flex-col min-w-0 bg-gray-950/80">
                         <LogDisplay logs={gameState.logs} />
                         
                         {/* Input Area (Fake) */}
                         <div className="p-2 border-t border-green-900 flex items-center gap-2 text-green-600">
                             <span>{'>'}</span>
                             <span className="typing-cursor">_</span>
                         </div>
                    </div>

                    {/* Right: Stats & Actions */}
                    <div className="hidden md:flex flex-col">
                        <StatsSidebar gameState={gameState} />
                        <div className="w-64 border-l border-green-900 bg-black/90 p-4 overflow-y-auto flex-1 border-t border-green-800">
                             {getActions}
                        </div>
                    </div>
                </>
            )}
        </div>
        
        {/* Mobile Action Sheet (Visible only on small screens during gameplay) */}
        {(gameState.screen === 'EXPLORE' || gameState.screen === 'COMBAT') && (
            <div className="md:hidden border-t-2 border-green-800 bg-black p-2 h-1/3 overflow-y-auto z-20">
                <div className="grid grid-cols-1 gap-2">
                     {getActions}
                </div>
                {/* Mini Stat Bar for Mobile */}
                <div className="mt-4 flex justify-between text-xs border-t border-green-900 pt-2 text-gray-500">
                    <span>HP: {gameState.player.hp}</span>
                    <span>QUEST: {gameState.questProgress}%</span>
                </div>
            </div>
        )}
    </div>
  );
};

export default App;
