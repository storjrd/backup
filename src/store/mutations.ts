import { Snapshot, BackupSummaryEvent, BackupEvent } from "@/types";
import { identical } from "ramda";
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

		const isSummaryEvent = (
			event: BackupEvent
		): event is BackupSummaryEvent => event.message_type === "summary";

		const summaryEvents = state.backupEvents.filter(isSummaryEvent);

		// clear in-progress backup events if finished snapshot shows in list
		for (const event of summaryEvents) {
			const matchingSnapshot = snapshots.find(
				(snapshot) => snapshot.short_id === event.snapshot_id
			);

			if (matchingSnapshot !== undefined) {
				state.backupEvents = [];

				return;
			}
		}
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
