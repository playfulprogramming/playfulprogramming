// Thank you StackOverflow
// @see https://stackoverflow.com/a/65309348
import { useRouter } from "next/router";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  FC,
  PropsWithChildren,
} from "react";

interface HValidation {
  history: string[];
  setHistory(data: string[]): void;
  back(fallbackRoute?: string): void;
}

const HistoryContext = createContext<HValidation>({} as HValidation);
export const HistoryProvider: FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { asPath, push, pathname } = useRouter();
  const [history, setHistory] = useState<string[]>([]);

  function back(fallbackRoute?: string) {
    for (let i = history.length - 2; i >= 0; i--) {
      const route = history[i];
      if (!route.includes("#") && route !== pathname) {
        push(route);
        const newHistory = history.slice(0, i);
        setHistory(newHistory);
        return;
      }
    }
    if (fallbackRoute) {
      push(fallbackRoute);
    }
  }

  useEffect(() => {
    setHistory((previous) => [...previous, asPath]);
  }, [asPath]);

  return (
    <HistoryContext.Provider
      value={{
        back,
        history,
        setHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export function useHistory(): HValidation {
  const context = useContext(HistoryContext);
  return context;
}
