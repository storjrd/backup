const execa = require("execa");

module.exports = ({ repository, password }) => {
	const runResticNoOutput = async (...args) => {
		await execa("restic", [...args, "--json"], {
			env: {
				RESTIC_REPOSITORY: repository,
				RESTIC_PASSWORD: password
			}
		});
	};

	const runResticSingleOutput = async (...args) => {
		const { stdout, stderr } = await execa("restic", [...args, "--json"], {
			env: {
				RESTIC_REPOSITORY: repository,
				RESTIC_PASSWORD: password
			}
		});

		return JSON.parse(stdout);
	};

	async function* parseJSONStream(stream) {
		let raw = "";

		for await (const chunk of stream.iterator()) {
			raw += chunk;

			const rawObjects = raw.split("\n");

			raw = rawObjects.pop();

			for (const object of rawObjects) {
				yield JSON.parse(object);
			}
		}
	}

	const runResticStreamOutput = (...args) => {
		const { stdout, stderr } = execa("restic", [...args, "--json"], {
			env: {
				RESTIC_REPOSITORY: repository,
				RESTIC_PASSWORD: password
			}
		});

		return parseJSONStream(stdout);
	};

	const init = async () => runResticNoOutput("init");
	const snapshots = async () => runResticSingleOutput("snapshots");
	const backup = (dir) => runResticStreamOutput("backup", dir);

	return {
		init,
		snapshots,
		backup
	};
};
