import { cn } from "../../../lib/tiptap-utils";
import "./card.scss";
import { forwardRef } from "preact/compat";

const Card = forwardRef<HTMLDivElement, JSX.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		return (
			<div ref={ref} className={cn("tiptap-card", className)} {...props} />
		);
	},
);
Card.displayName = "Card";

const CardHeader = forwardRef<
	HTMLDivElement,
	JSX.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	return (
		<div ref={ref} className={cn("tiptap-card-header", className)} {...props} />
	);
});
CardHeader.displayName = "CardHeader";

const CardBody = forwardRef<HTMLDivElement, JSX.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		return (
			<div ref={ref} className={cn("tiptap-card-body", className)} {...props} />
		);
	},
);
CardBody.displayName = "CardBody";

const CardItemGroup = forwardRef<
	HTMLDivElement,
	JSX.HTMLAttributes<HTMLDivElement> & {
		orientation?: "horizontal" | "vertical";
	}
>(({ className, orientation = "vertical", ...props }, ref) => {
	return (
		<div
			ref={ref}
			data-orientation={orientation}
			className={cn("tiptap-card-item-group", className)}
			{...props}
		/>
	);
});
CardItemGroup.displayName = "CardItemGroup";

const CardGroupLabel = forwardRef<
	HTMLDivElement,
	JSX.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn("tiptap-card-group-label", className)}
			{...props}
		/>
	);
});
CardGroupLabel.displayName = "CardGroupLabel";

const CardFooter = forwardRef<
	HTMLDivElement,
	JSX.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	return (
		<div ref={ref} className={cn("tiptap-card-footer", className)} {...props} />
	);
});
CardFooter.displayName = "CardFooter";

export {
	Card,
	CardHeader,
	CardFooter,
	CardBody,
	CardItemGroup,
	CardGroupLabel,
};
