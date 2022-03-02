// Types shared between both back and front end
import type { Snapshot, BackupEvent } from "@/types";

// This type is transformed into backend.invoke() form in src/lib/backend
export type Api = {
	setup: (arg0: {
		endpoint: string;
		bucket: string;
		accessKey: string;
		secretKey: string;
		resticPassword: string;
	}) => Promise<void>;
	setSnapshots: (arg0: any[]) => Promise<void>;
	snapshots: () => Promise<Snapshot[]>;
	logout: () => Promise<void>;
	backup: (arg0: { directories: string[] }) => Promise<void>;
	"get-backup-events": () => Promise<BackupEvent[]>;
	restore: (arg0: { snapshot: Snapshot; target: string }) => Promise<void>;
	"get-directory": () => Promise<
		{ canceled: boolean; filePaths: string[] } | undefined
	>;
	openSignup: () => Promise<void>;
	openUpgradePlan: () => Promise<void>;
	openGetStarted: () => Promise<void>;
	getEndpoint: () => Promise<string>;
	getBucketName: () => Promise<string>;
	getTotalUsage: () => Promise<void>;
	setBucketName: (arg0: string) => Promise<void>;
	loginStatus: () => Promise<boolean>;
};
