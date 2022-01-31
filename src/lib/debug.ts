export default (moduleName: string): ((...log: any[]) => void) => {
	return (...log: any[]): void => {
		console.log(`${moduleName}:`, ...log);
	};
};
