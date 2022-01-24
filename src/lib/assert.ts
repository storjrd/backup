function assert = (condition: boolean, message: string): asserts condition => {
	if (!condition) {
		throw new Error(`Assertion Error: ${message}`);
	}
}

export { assert };
