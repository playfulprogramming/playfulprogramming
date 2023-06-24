import style from "./input.module.scss";
import { JSX } from "preact";

export function Input({ class: className = "", ...props }: JSX.IntrinsicElements["input"]) {
	return <input {...props} class={`text-style-body-medium ${style.input} ${className}`} />;
}
