import { createContext } from "preact";
import type { RadioGroupState } from "react-stately";

export const RadioContext = createContext<RadioGroupState | null>(null);
