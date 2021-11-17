const os = require("os");
const path = require("path");
const execa = require("execa");

const binPath = path.join(
	process.resourcesPath
		? path.join(process.resourcesPath, "resources")
		: __dirname,
	"../restic"
);

console.log({
	resourcesPath: process.resourcesPath
});

const binaryPaths = {
	"win32-x64": path.join(binPath, "restic_0.12.1_windows_amd64.exe"),
	"linux-x64": path.join(binPath, "restic_0.12.1_linux_amd64"),
	"darwin-x64": path.join(binPath, "restic_0.12.1_darwin_amd64"),
	"darwin-arm64": path.join(binPath, "restic_0.12.1_darwin_arm64")
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

module.exports = ({ endpoint, bucket, accessKey, secretKey, password }) => {
	console.log("createRestic()", {
		endpoint,
		bucket,
		accessKey,
		secretKey,
		password
	});

	const platformKey = `${os.platform()}-${os.arch()}`;

	const binaryPath =
		typeof binaryPaths[platformKey] === "string"
			? binaryPaths[platformKey]
			: "restic";

	console.log({ binaryPath });

	const runRestic = (...args) =>
		execa(binaryPath, [...args, "--json"], {
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
