import type { AccountTypes, Snapshot, BackupEvent } from "@/types";

export interface State {
	snapshots: Snapshot[] | null;
	backupEvents: BackupEvent[];
	loginStatus: boolean;

	// todo: remove
	endpoint: string;
	plan: number;
	bucket: string;
	accountType: string;
	accountTypes: AccountTypes;
	videosUsage: number;
	picturesUsage: number;
	documentsUsage: number;
	othersUsage: number;
	totalUsage: number;
	preferences: boolean;
}

export const state: State = {
	snapshots: null,
	backupEvents: [],
	loginStatus: false,

	endpoint: "",
	plan: 1.5e11,
	bucket: "",
	accountType: "Free",
	accountTypes: {
		freeAccount: "Free"
	},
	videosUsage: 0,
	picturesUsage: 0,
	documentsUsage: 0,
	othersUsage: 0,
	totalUsage: 0.8e11,
	preferences: true
};
