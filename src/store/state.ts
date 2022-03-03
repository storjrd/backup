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
	totalUsage: 0.8e11,
	preferences: true
};
