import type { Snapshot, BackupEvent } from "@/types";

type Setup = (
	arg0: "setup",
	arg1: {
		endpoint: string;
		bucket: string;
		accessKey: string;
		secretKey: string;
	}
) => Promise<void>;

type SetSnapshots = (arg0: "setSnapshots", arg1: any[]) => Promise<void>;

type Snapshots = (arg0: "snapshots") => Promise<Snapshot[]>;

type Logout = (arg0: "logout") => Promise<void>;

type Backup = (
	arg0: "backup",
	arg1: {
		directories: string[];
	}
) => Promise<void>;

type GetBackupEvents = (arg0: "get-backup-events") => Promise<BackupEvent[]>;

type Restore = (
	arg0: "restore",
	arg1: {
		snapshotId: string;
		target: string;
	}
) => Promise<void>;

type GetDirectory = (arg0: "get-directory") => Promise<void>;

type OpenSignup = (arg0: "openSignup") => Promise<void>;

type OpenUpgradePlan = (arg0: "openUpgradePlan") => Promise<void>;

type GetBucketName = (arg0: "getBucketName") => Promise<string>;

type SetBucketName = (arg0: "setBucketName", arg1: string) => Promise<void>;

type LoginStatus = (arg0: "loginStatus") => Promise<boolean>;

interface Backend {
	invoke: Setup &
		SetSnapshots &
		Snapshots &
		Logout &
		Backup &
		GetBackupEvents &
		Restore &
		GetDirectory &
		OpenSignup &
		OpenUpgradePlan &
		GetBucketName &
		SetBucketName &
		LoginStatus;
}

const { backend } = window as unknown as { backend: Backend };

export default backend;
