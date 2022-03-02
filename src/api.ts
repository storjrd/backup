// Types shared between both back and front end
import type { Snapshot, BackupEvent } from "./types";

type Promisable<T> = T | PromiseLike<T>;

// This type is transformed into backend.invoke() form in src/lib/backend
export type Api = {
	setup: (arg0: {
		endpoint: string;
		bucket: string;
		accessKey: string;
		secretKey: string;
		resticPassword: string;
	}) => Promisable<void>;
	// setSnapshots: (arg0: any[]) => Promisable<void>;
	snapshots: () => Promisable<Snapshot[]>;
	logout: () => Promisable<void>;
	backup: (arg0: { directories: string[] }) => Promisable<void>;
	"get-backup-events": () => Promisable<BackupEvent[]>;
	restore: (arg0: { snapshot: Snapshot; target: string }) => Promisable<void>;
	"get-directory": () => Promisable<
		{ canceled: boolean; filePaths: string[] } | undefined
	>;
	openSignup: () => Promisable<void>;
	openUpgradePlan: () => Promisable<void>;
	openGetStarted: () => Promisable<void>;
	getEndpoint: () => Promisable<string>;
	getBucketName: () => Promisable<string>;
	getTotalUsage: () => Promisable<void>;
	// setBucketName: (arg0: string) => Promisable<void>;
	loginStatus: () => Promisable<boolean>;
};
