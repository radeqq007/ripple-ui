export const die = (msg: string, hint?: string): never => {
	console.error(`✖  ${msg}`);
	if (hint) console.error(`   ${hint}`);
	return process.exit(1);
};

export const warn = (msg: string) => {
	console.warn(`⚠  ${msg}`);
};

export const isNetworkError = (err: unknown): boolean => {
	if (!(err instanceof Error)) return false;
	return (
		err.message.includes("fetch") ||
		err.message.includes("ENOTFOUND") ||
		err.message.includes("ECONNREFUSED") ||
		err.message.includes("ETIMEDOUT") ||
		err.message.includes("network") ||
		err.message.toLowerCase().includes("failed to fetch")
	);
};

export const formatError = (err: unknown): string => {
	if (err instanceof Error) return err.message;
	if (typeof err === "string") return err;
	return "An unknown error occurred";
};
