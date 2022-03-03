import { Snapshot, BackupEvent } from "@/types";
import { State } from "./state";

export type Mutations = typeof mutations;

export const mutations = {
	login(state: State) {
		state.loginStatus = true;
	},

	logout(state: State) {
		state.loginStatus = false;
	},

	setBucketName(state: State, name: string) {
		state.bucket = name;
	},

	setSnapshots(state: State, snapshots: Snapshot[]) {
		state.snapshots = snapshots;
	},

	setEndpoint(state: State, endpoint: string) {
		console.log("ENDPOINT", endpoint);
		state.endpoint = endpoint;
	},

	pushBackupEvents(state: State, events: BackupEvent[]) {
		state.backupEvents = [...state.backupEvents, ...events];

		if (state.backupEvents.length > 5) {
			state.backupEvents.splice(0, state.backupEvents.length - 5);
		}
	},

	clearBackupEvents(state: State) {
		state.backupEvents.splice(0);
	},

	setTotalUsage(state: State, usage: number) {
		state.totalUsage = usage;
	}
};
