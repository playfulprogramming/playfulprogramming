import { preact } from "@storybook-astro/framework/integrations";
import icon from "astro-icon";
import { resolve } from "node:path";

// The adapter's isolated Astro server does not load astro.config.ts.
// Supply only the integrations and environment needed by component stories.
export const storybookDefines = {
	"import.meta.env.MODE": JSON.stringify("storybook"),
	"import.meta.env.DEV": "false",
	"import.meta.env.SITE": JSON.stringify("https://playfulprogramming.com"),
	"import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME": JSON.stringify(""),
};

export function siteIntegration() {
	const integration = preact({ compat: true });
	const loadPreact = integration.loadIntegration.bind(integration);
	integration.loadIntegration = async (resolveFrom) => {
		const preactIntegration = await loadPreact(resolveFrom);
		return {
			...preactIntegration,
			hooks: {
				...preactIntegration.hooks,
				"astro:config:setup": async (context) => {
					await preactIntegration.hooks["astro:config:setup"]?.(context);
					context.updateConfig({
						integrations: context.config.integrations.some(
							(integration) => integration.name === "astro-icon",
						)
							? []
							: [
									icon({
										iconDir: resolve(
											import.meta.dirname,
											"../src/assets/icons",
										),
									}),
								],
						vite: { define: storybookDefines },
					});
				},
			},
		};
	};
	return integration;
}
