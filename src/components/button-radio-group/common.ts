import { createContext } from "preact";
import { RadioGroupState } from "react-stately";

export const RadioContext = createContext<RadioGroupState | null>(null);
