import {h} from 'preact';
import {
  createContext,
  FC,
  useEffect,
  useReducer,
} from "preact/compat";
import { useIsomorphicLayoutEffect } from "utils/index";

interface MarkdownDataContextType {
  selectedTabText: string;
}

type SET_SELECTED_TAB_TEXT_ACTION = {
  type: "SET_SELECTED_TAB_TEXT";
  payload: string;
};

function reducer(
  state: MarkdownDataContextType,
  action: SET_SELECTED_TAB_TEXT_ACTION
) {
  switch (action.type) {
    case "SET_SELECTED_TAB_TEXT":
      return { selectedTabText: action.payload };
    default:
      throw new Error();
  }
}

const initialState: MarkdownDataContextType = { selectedTabText: "" };

export const MarkdownDataContext = createContext<{
  state: MarkdownDataContextType;
  dispatch: any;
}>({
  state: initialState,
  dispatch: () => {},
});

export const MarkdownDataProvider: FC<unknown> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Alternative to `useEffect`
  useIsomorphicLayoutEffect(() => {
    const tabSelect = localStorage.getItem("tabs-selection");
    if (!tabSelect) return;
    dispatch({
      type: "SET_SELECTED_TAB_TEXT",
      payload: tabSelect,
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("tabs-selection", state.selectedTabText || "");
  }, [state.selectedTabText]);

  // If user has linked to a heading that's inside of a tab
  useEffect(() => {
    // const hash = window.location.hash;
    // if (!hash) return;
    // // If hash exists, then we can safely ignore it
    // if (document.querySelector(hash)) return;
    // const partialHash = hash.slice(1);
    // try {
    //   const matchingTab = document.querySelector(
    //     `[data-headers*="${partialHash}"`
    //   );
    //   if (!matchingTab) return;
    //   // If header is not in a tab
    //   const tabName = matchingTab.getAttribute("data-tabname");
    //   if (!tabName) return;
    //   dispatch({ type: "SET_SELECTED_TAB_TEXT", payload: tabName });
    //   setTimeout(() => {
    //     const el = document.querySelector(hash);
    //     if (!el) return;
    //     el.scrollIntoView(true);
    //   }, 100);
    // } catch (e) {
    //   console.error("Error finding matching tab", e);
    // }
  }, []);

  return (
    <MarkdownDataContext.Provider value={{ state, dispatch }}>
      {children}
    </MarkdownDataContext.Provider>
  );
};
