import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

const defaultPlayers = ['Player 1', 'Player 2', 'Player 3'] as const;

type GameContextValue = {
  players: string[];
  activePlayers: string[];
  selectedModeId: string | null;
  maxDrinks: number;
  updatePlayer: (index: number, name: string) => void;
  addPlayer: () => void;
  removePlayer: (index: number) => void;
  selectMode: (modeId: string) => void;
  resetMode: () => void;
  increaseMaxDrinks: () => void;
  decreaseMaxDrinks: () => void;
  setMaxDrinks: (value: number) => void;
};

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<string[]>(() => [...defaultPlayers]);
  const [selectedModeId, setSelectedModeId] = useState<string | null>(null);
  const [maxDrinks, setMaxDrinksValue] = useState<number>(3);

  const updatePlayer = useCallback((index: number, name: string) => {
    setPlayers((current) =>
      current.map((player, playerIndex) => (playerIndex === index ? name : player)),
    );
  }, []);

  const addPlayer = useCallback(() => {
    setPlayers((current) => [...current, `Player ${current.length + 1}`]);
  }, []);

  const removePlayer = useCallback((index: number) => {
    setPlayers((current) => (current.length > 1 ? current.filter((_, i) => i !== index) : current));
  }, []);

  const selectMode = useCallback((modeId: string) => {
    setSelectedModeId(modeId);
  }, []);

  const resetMode = useCallback(() => {
    setSelectedModeId(null);
  }, []);

  const increaseMaxDrinks = useCallback(() => {
    setMaxDrinksValue((value) => value + 1);
  }, []);

  const decreaseMaxDrinks = useCallback(() => {
    setMaxDrinksValue((value) => Math.max(1, value - 1));
  }, []);

  const setMaxDrinks = useCallback((value: number) => {
    setMaxDrinksValue(Math.max(1, Math.round(value)));
  }, []);

  const activePlayers = useMemo(
    () => players.map((player) => player.trim()).filter((player) => player.length > 0),
    [players],
  );

  const value = useMemo(
    () => ({
      players,
      activePlayers,
      selectedModeId,
      maxDrinks,
      updatePlayer,
      addPlayer,
      removePlayer,
      selectMode,
      resetMode,
      increaseMaxDrinks,
      decreaseMaxDrinks,
      setMaxDrinks,
    }),
    [
      players,
      activePlayers,
      selectedModeId,
      maxDrinks,
      updatePlayer,
      addPlayer,
      removePlayer,
      selectMode,
      resetMode,
      increaseMaxDrinks,
      decreaseMaxDrinks,
      setMaxDrinks,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }

  return context;
};
