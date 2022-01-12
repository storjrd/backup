module.exports = (moduleName) => {
	return (...log) => {
		console.log(`${moduleName}:`, ...log);
	};
};
