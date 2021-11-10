const execa = require("execa");

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

module.exports = ({ endpoint, bucket, accessKey, secretKey, password }) => {
	console.log("createRestic()", {
		endpoint,
		bucket,
		accessKey,
		secretKey,
		password
	});

	const runRestic = (...args) =>
		execa("restic", [...args, "--json"], {
			env: {
				RESTIC_REPOSITORY: `s3:${endpoint}/${bucket}`,
				RESTIC_PASSWORD: password,
				AWS_ACCESS_KEY_ID: accessKey,
				AWS_SECRET_ACCESS_KEY: secretKey
			}
		});

	const runResticSingleOutput = async (...args) => {
		const { stdout, stderr } = await runRestic(...args);

		return JSON.parse(stdout);
	};

	const runResticStreamOutput = (...args) => {
		const { stdout, stderr } = runRestic(...args);

		return parseJSONStream(stdout);
	};

	const init = async () => runRestic("init");
	const snapshots = async () => runResticSingleOutput("snapshots");
	const backup = (dir) => runResticStreamOutput("backup", dir);

	return {
		init,
		snapshots,
		backup
	};
};
