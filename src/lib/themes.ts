// ─── Shared types ────────────────────────────────────────────────────────────

type Variable = { bg: string; fg: string };

type BaseVariables = {
	bg: string;
	fg: string;
	card: Variable;
	popover: Variable;
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
		accent: Variable;
		border: string;
		ring: string;
	};
};

type AccentVariables = {
	primary: Variable;
	sidebar: {
		primary: Variable;
	};
};

export type Base = {
	root: BaseVariables;
	dark: BaseVariables;
};

export type AccentTheme = {
	radius: string;
	root: AccentVariables;
	dark: AccentVariables;
};

export const bases: { [name: string]: Base } = {
	stone: {
		root: {
			bg: "oklch(1 0 0)",
			fg: "oklch(0.145 0 0)",
			card: { bg: "oklch(1 0 0)", fg: "oklch(0.145 0 0)" },
			popover: { bg: "oklch(1 0 0)", fg: "oklch(0.145 0 0)" },
			secondary: { bg: "oklch(0.97 0 0)", fg: "oklch(0.205 0 0)" },
			muted: { bg: "oklch(0.97 0 0)", fg: "oklch(0.556 0 0)" },
			accent: { bg: "oklch(0.97 0 0)", fg: "oklch(0.205 0 0)" },
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
				accent: { bg: "oklch(0.97 0 0)", fg: "oklch(0.205 0 0)" },
				border: "oklch(0.922 0 0)",
				ring: "oklch(0.708 0 0)",
			},
		},
		dark: {
			bg: "oklch(0.145 0 0)",
			fg: "oklch(0.985 0 0)",
			card: { bg: "oklch(0.205 0 0)", fg: "oklch(0.985 0 0)" },
			popover: { bg: "oklch(0.205 0 0)", fg: "oklch(0.985 0 0)" },
			secondary: { bg: "oklch(0.269 0 0)", fg: "oklch(0.985 0 0)" },
			muted: { bg: "oklch(0.269 0 0)", fg: "oklch(0.708 0 0)" },
			accent: { bg: "oklch(0.269 0 0)", fg: "oklch(0.985 0 0)" },
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
				accent: { bg: "oklch(0.269 0 0)", fg: "oklch(0.985 0 0)" },
				border: "oklch(1 0 0 / 10%)",
				ring: "oklch(0.556 0 0)",
			},
		},
	},

	zinc: {
		root: {
			bg: "oklch(1 0 0)",
			fg: "oklch(0.141 0.005 285.823)",
			card: { bg: "oklch(1 0 0)", fg: "oklch(0.141 0.005 285.823)" },
			popover: { bg: "oklch(1 0 0)", fg: "oklch(0.141 0.005 285.823)" },
			secondary: {
				bg: "oklch(0.967 0.001 286.375)",
				fg: "oklch(0.21 0.006 285.885)",
			},
			muted: {
				bg: "oklch(0.967 0.001 286.375)",
				fg: "oklch(0.552 0.016 285.938)",
			},
			accent: {
				bg: "oklch(0.967 0.001 286.375)",
				fg: "oklch(0.21 0.006 285.885)",
			},
			destructive: "oklch(0.577 0.245 27.325)",
			border: "oklch(0.92 0.004 286.32)",
			input: "oklch(0.92 0.004 286.32)",
			ring: "oklch(0.705 0.015 286.067)",
			charts: [
				"oklch(0.869 0.005 286.286)",
				"oklch(0.552 0.016 285.938)",
				"oklch(0.442 0.017 285.786)",
				"oklch(0.37 0.013 285.805)",
				"oklch(0.274 0.006 286.033)",
			],
			sidebar: {
				bg: "oklch(0.985 0.002 286.067)",
				fg: "oklch(0.141 0.005 285.823)",
				accent: {
					bg: "oklch(0.967 0.001 286.375)",
					fg: "oklch(0.21 0.006 285.885)",
				},
				border: "oklch(0.92 0.004 286.32)",
				ring: "oklch(0.705 0.015 286.067)",
			},
		},
		dark: {
			bg: "oklch(0.141 0.005 285.823)",
			fg: "oklch(0.985 0 0)",
			card: {
				bg: "oklch(0.21 0.006 285.885)",
				fg: "oklch(0.985 0 0)",
			},
			popover: {
				bg: "oklch(0.21 0.006 285.885)",
				fg: "oklch(0.985 0 0)",
			},
			secondary: {
				bg: "oklch(0.274 0.006 286.033)",
				fg: "oklch(0.985 0 0)",
			},
			muted: {
				bg: "oklch(0.274 0.006 286.033)",
				fg: "oklch(0.705 0.015 286.067)",
			},
			accent: {
				bg: "oklch(0.274 0.006 286.033)",
				fg: "oklch(0.985 0 0)",
			},
			destructive: "oklch(0.704 0.191 22.216)",
			border: "oklch(1 0 0 / 10%)",
			input: "oklch(1 0 0 / 15%)",
			ring: "oklch(0.552 0.016 285.938)",
			charts: [
				"oklch(0.869 0.005 286.286)",
				"oklch(0.552 0.016 285.938)",
				"oklch(0.442 0.017 285.786)",
				"oklch(0.37 0.013 285.805)",
				"oklch(0.274 0.006 286.033)",
			],
			sidebar: {
				bg: "oklch(0.21 0.006 285.885)",
				fg: "oklch(0.985 0 0)",
				accent: {
					bg: "oklch(0.274 0.006 286.033)",
					fg: "oklch(0.985 0 0)",
				},
				border: "oklch(1 0 0 / 10%)",
				ring: "oklch(0.552 0.016 285.938)",
			},
		},
	},

	slate: {
		root: {
			bg: "oklch(1 0 0)",
			fg: "oklch(0.129 0.042 264.695)",
			card: { bg: "oklch(1 0 0)", fg: "oklch(0.129 0.042 264.695)" },
			popover: { bg: "oklch(1 0 0)", fg: "oklch(0.129 0.042 264.695)" },
			secondary: {
				bg: "oklch(0.968 0.007 247.896)",
				fg: "oklch(0.208 0.042 265.755)",
			},
			muted: {
				bg: "oklch(0.968 0.007 247.896)",
				fg: "oklch(0.554 0.046 257.417)",
			},
			accent: {
				bg: "oklch(0.968 0.007 247.896)",
				fg: "oklch(0.208 0.042 265.755)",
			},
			destructive: "oklch(0.577 0.245 27.325)",
			border: "oklch(0.929 0.013 255.508)",
			input: "oklch(0.929 0.013 255.508)",
			ring: "oklch(0.704 0.04 256.788)",
			charts: [
				"oklch(0.868 0.017 252.894)",
				"oklch(0.554 0.046 257.417)",
				"oklch(0.446 0.043 257.281)",
				"oklch(0.372 0.044 257.287)",
				"oklch(0.279 0.041 260.031)",
			],
			sidebar: {
				bg: "oklch(0.984 0.003 247.858)",
				fg: "oklch(0.129 0.042 264.695)",
				accent: {
					bg: "oklch(0.968 0.007 247.896)",
					fg: "oklch(0.208 0.042 265.755)",
				},
				border: "oklch(0.929 0.013 255.508)",
				ring: "oklch(0.704 0.04 256.788)",
			},
		},
		dark: {
			bg: "oklch(0.129 0.042 264.695)",
			fg: "oklch(0.984 0.003 247.858)",
			card: {
				bg: "oklch(0.208 0.042 265.755)",
				fg: "oklch(0.984 0.003 247.858)",
			},
			popover: {
				bg: "oklch(0.208 0.042 265.755)",
				fg: "oklch(0.984 0.003 247.858)",
			},
			secondary: {
				bg: "oklch(0.279 0.041 260.031)",
				fg: "oklch(0.984 0.003 247.858)",
			},
			muted: {
				bg: "oklch(0.279 0.041 260.031)",
				fg: "oklch(0.704 0.04 256.788)",
			},
			accent: {
				bg: "oklch(0.279 0.041 260.031)",
				fg: "oklch(0.984 0.003 247.858)",
			},
			destructive: "oklch(0.704 0.191 22.216)",
			border: "oklch(1 0 0 / 10%)",
			input: "oklch(1 0 0 / 15%)",
			ring: "oklch(0.554 0.046 257.417)",
			charts: [
				"oklch(0.868 0.017 252.894)",
				"oklch(0.554 0.046 257.417)",
				"oklch(0.446 0.043 257.281)",
				"oklch(0.372 0.044 257.287)",
				"oklch(0.279 0.041 260.031)",
			],
			sidebar: {
				bg: "oklch(0.208 0.042 265.755)",
				fg: "oklch(0.984 0.003 247.858)",
				accent: {
					bg: "oklch(0.279 0.041 260.031)",
					fg: "oklch(0.984 0.003 247.858)",
				},
				border: "oklch(1 0 0 / 10%)",
				ring: "oklch(0.554 0.046 257.417)",
			},
		},
	},
};

export const accentThemes: { [name: string]: AccentTheme } = {
	neutral: {
		radius: "0.625rem",
		root: {
			primary: { bg: "oklch(0.205 0 0)", fg: "oklch(0.986 0 0)" },
			sidebar: {
				primary: { bg: "oklch(0.205 0 0)", fg: "oklch(0.985 0 0)" },
			},
		},
		dark: {
			primary: { bg: "oklch(0.922 0 0)", fg: "oklch(0.205 0 0)" },
			sidebar: {
				primary: { bg: "oklch(0.488 0.243 264.376)", fg: "oklch(0.985 0 0)" },
			},
		},
	},

	blue: {
		radius: "0.5rem",
		root: {
			primary: { bg: "oklch(0.546 0.245 262.881)", fg: "oklch(0.985 0 0)" },
			sidebar: {
				primary: {
					bg: "oklch(0.546 0.245 262.881)",
					fg: "oklch(0.985 0 0)",
				},
			},
		},
		dark: {
			primary: { bg: "oklch(0.623 0.214 259.815)", fg: "oklch(0.985 0 0)" },
			sidebar: {
				primary: {
					bg: "oklch(0.623 0.214 259.815)",
					fg: "oklch(0.985 0 0)",
				},
			},
		},
	},

	violet: {
		radius: "0.75rem",
		root: {
			primary: { bg: "oklch(0.541 0.281 293.009)", fg: "oklch(0.985 0 0)" },
			sidebar: {
				primary: {
					bg: "oklch(0.541 0.281 293.009)",
					fg: "oklch(0.985 0 0)",
				},
			},
		},
		dark: {
			primary: { bg: "oklch(0.606 0.25 292.717)", fg: "oklch(0.985 0 0)" },
			sidebar: {
				primary: {
					bg: "oklch(0.606 0.25 292.717)",
					fg: "oklch(0.985 0 0)",
				},
			},
		},
	},

	rose: {
		radius: "0.5rem",
		root: {
			primary: { bg: "oklch(0.586 0.253 17.585)", fg: "oklch(0.985 0 0)" },
			sidebar: {
				primary: {
					bg: "oklch(0.586 0.253 17.585)",
					fg: "oklch(0.985 0 0)",
				},
			},
		},
		dark: {
			primary: { bg: "oklch(0.645 0.246 16.439)", fg: "oklch(0.985 0 0)" },
			sidebar: {
				primary: {
					bg: "oklch(0.645 0.246 16.439)",
					fg: "oklch(0.985 0 0)",
				},
			},
		},
	},

	orange: {
		radius: "0.625rem",
		root: {
			primary: { bg: "oklch(0.646 0.222 41.116)", fg: "oklch(0.985 0 0)" },
			sidebar: {
				primary: {
					bg: "oklch(0.646 0.222 41.116)",
					fg: "oklch(0.985 0 0)",
				},
			},
		},
		dark: {
			primary: { bg: "oklch(0.702 0.191 42.842)", fg: "oklch(0.985 0 0)" },
			sidebar: {
				primary: {
					bg: "oklch(0.702 0.191 42.842)",
					fg: "oklch(0.985 0 0)",
				},
			},
		},
	},
};
