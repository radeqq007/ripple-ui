type Variable = {
	bg: string;
	fg: string;
};

type Variables = {
	bg: string;
	fg: string;
	card: Variable;
	popover: Variable;
	primary: Variable;
	secondary: Variable;
	muted: Variable;
	accent: Variable;
	destructive: string;
	border: string;
	input: string;
	ring: string;
	charts: [string, string, string, string, string];
	sidebar: {
		bg: string;
		fg: string;
		primary: Variable;
		accent: Variable;
		border: string;
		ring: string;
	};
};

type Theme = {
	radius: string;
	root: Variables;
	dark: Variables;
};

export const themes: { [name: string]: Theme } = {
	stone: {
		radius: "0.625rem",
		root: {
			bg: "oklch(1 0 0)",
			fg: "oklch(0.145 0 0)",
			card: {
				bg: "oklch(1 0 0)",
				fg: "oklch(0.145 0 0)",
			},
			popover: {
				bg: "oklch(1 0 0)",
				fg: "oklch(1 0 0)",
			},
			primary: {
				bg: "oklch(0.205 0 0)",
				fg: "oklch(0.986 0 0)",
			},
			secondary: {
				bg: "oklch(0.97 0 0)",
				fg: "oklch(0.205 0 0)",
			},
			muted: {
				bg: "oklch(0.97 0 0)",
				fg: "oklch(0.556 0 0)",
			},
			accent: {
				bg: "oklch(0.97 0 0)",
				fg: "oklch(0.566 0 0)",
			},
			destructive: "oklch(0.577 0.245 27.325)",
			border: "oklch(0.922 0 0)",
			input: "oklch(0.922 0 0)",
			ring: "oklch(0.708 0 0)",
			charts: [
				"oklch(0.87 0 0)",
				"oklch(0.556 0 0)",
				"oklch(0.439 0 0)",
				"oklch(0.371 0 0)",
				"oklch(0.269 0 0)",
			],
			sidebar: {
				bg: "oklch(0.985 0 0)",
				fg: "oklch(0.145 0 0)",
				primary: {
					bg: "oklch(0.205 0 0)",
					fg: "oklch(0.985 0 0)",
				},
				accent: {
					bg: "oklch(0.97 0 0)",
					fg: "oklch(0.205 0 0)",
				},
				border: "oklch(0.922 0 0)",
				ring: "oklch(0.708 0 0)",
			},
		},
		dark: {
			bg: "oklch(0.145 0 0)",
			fg: "oklch(0.985 0 0)",
			card: {
				bg: "oklch(0.205 0 0)",
				fg: "oklch(0.985 0 0)",
			},
			popover: {
				bg: "oklch(0.205 0 0)",
				fg: "oklch(0.985 0 0)",
			},
			primary: {
				bg: "oklch(0.922 0 0)",
				fg: "oklch(0.205 0 0)",
			},
			secondary: {
				bg: "oklch(0.269 0 0)",
				fg: "oklch(0.985 0 0)",
			},
			muted: {
				bg: "oklch(0.269 0 0)",
				fg: "oklch(0.708 0 0)",
			},
			accent: {
				bg: "oklch(0.269 0 0)",
				fg: "oklch(0.985 0 0)",
			},
			destructive: "oklch(0.704 0.191 22.216)",
			border: "oklch(1 0 0 / 10%)",
			input: "oklch(1 0 0 / 15%)",
			ring: "oklch(0.556 0 0)",
			charts: [
				"oklch(0.87 0 0)",
				"oklch(0.556 0 0)",
				"oklch(0.439 0 0)",
				"oklch(0.371 0 0)",
				"oklch(0.269 0 0)",
			],
			sidebar: {
				bg: "oklch(0.205 0 0)",
				fg: "oklch(0.985 0 0)",
				primary: {
					bg: "oklch(0.488 0.243 264.376)",
					fg: "oklch(0.985 0 0)",
				},
				accent: {
					bg: "oklch(0.269 0 0)",
					fg: "oklch(0.985 0 0)",
				},
				border: "oklch(1 0 0 / 10%)",
				ring: "oklch(0.556 0 0)",
			},
		},
	},
};
