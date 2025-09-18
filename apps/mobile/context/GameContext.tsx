import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const defaultPlayers = ['Player 1', 'Player 2', 'Player 3'] as const;

export type PlayerDrinkStat = {
  index: number;
  name: string;
  drinks: number;
};

type GameContextValue = {
  players: string[];
  activePlayers: string[];
  selectedModeId: string | null;
  maxDrinks: number;
  playerStats: PlayerDrinkStat[];
  updatePlayer: (index: number, name: string) => void;
  addPlayer: () => void;
  removePlayer: (index: number) => void;
  selectMode: (modeId: string) => void;
  resetMode: () => void;
  increaseMaxDrinks: () => void;
  decreaseMaxDrinks: () => void;
  setMaxDrinks: (value: number) => void;
  adjustDrinkTotal: (index: number, delta: number) => void;
  recordDrinkForPlayer: (playerName: string, amount: number) => void;
  resetDrinkStats: () => void;
};

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<string[]>(() => [...defaultPlayers]);
  const [selectedModeId, setSelectedModeId] = useState<string | null>(null);
  const [maxDrinks, setMaxDrinksValue] = useState<number>(3);
  const [drinkLog, setDrinkLog] = useState<number[]>(() => players.map(() => 0));

  useEffect(() => {
    setDrinkLog((current) => {
      if (current.length === players.length) {
        return current;
      }

      if (current.length < players.length) {
        return [...current, ...Array(players.length - current.length).fill(0)];
      }

      return current.slice(0, players.length);
    });
  }, [players.length]);

  const updatePlayer = useCallback((index: number, name: string) => {
    setPlayers((current) =>
      current.map((player, playerIndex) => (playerIndex === index ? name : player)),
    );
  }, []);

  const addPlayer = useCallback(() => {
    setPlayers((current) => [...current, `Player ${current.length + 1}`]);
    setDrinkLog((current) => [...current, 0]);
  }, []);

  const removePlayer = useCallback((index: number) => {
    setPlayers((current) => (current.length > 1 ? current.filter((_, i) => i !== index) : current));
    setDrinkLog((current) => (current.length > 1 ? current.filter((_, i) => i !== index) : current));
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

  const adjustDrinkTotal = useCallback((index: number, delta: number) => {
    setDrinkLog((current) => {
      if (index < 0 || index >= current.length) {
        return current;
      }

      const next = [...current];
      const updated = (next[index] ?? 0) + delta;
      next[index] = Math.max(0, updated);
      return next;
    });
  }, []);

  const recordDrinkForPlayer = useCallback(
    (playerName: string, amount: number) => {
      if (!playerName || amount <= 0) {
        return;
      }

      const index = players.findIndex((player) => player.trim() === playerName.trim());

      if (index === -1) {
        return;
      }

      adjustDrinkTotal(index, amount);
    },
    [adjustDrinkTotal, players],
  );

  const resetDrinkStats = useCallback(() => {
    setDrinkLog(players.map(() => 0));
  }, [players]);

  const activePlayers = useMemo(
    () => players.map((player) => player.trim()).filter((player) => player.length > 0),
    [players],
  );

  const playerStats = useMemo(
    () =>
      players
        .map((player, index) => ({
          index,
          name: player.trim(),
          drinks: drinkLog[index] ?? 0,
        }))
        .filter(({ name }) => name.length > 0),
    [drinkLog, players],
  );

  const value = useMemo(
    () => ({
      players,
      activePlayers,
      selectedModeId,
      maxDrinks,
      playerStats,
      updatePlayer,
      addPlayer,
      removePlayer,
      selectMode,
      resetMode,
      increaseMaxDrinks,
      decreaseMaxDrinks,
      setMaxDrinks,
      adjustDrinkTotal,
      recordDrinkForPlayer,
      resetDrinkStats,
    }),
    [
      players,
      activePlayers,
      selectedModeId,
      maxDrinks,
      playerStats,
      updatePlayer,
      addPlayer,
      removePlayer,
      selectMode,
      resetMode,
      increaseMaxDrinks,
      decreaseMaxDrinks,
      setMaxDrinks,
      adjustDrinkTotal,
      recordDrinkForPlayer,
      resetDrinkStats,
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
