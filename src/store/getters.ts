import * as R from "ramda";
import { CreateGetterContext } from "@/lib/typed-store";
import { State } from "./state";

import type {
	AccountTypes,
	SingleBackup,
	Snapshot,
	Backup,
	BackupEvent,
	BackupStatusEvent,
	BackupSummaryEvent
} from "@/types";
import { mapGetters } from "vuex";

export type Getters = {
	accountTypes: (state: State) => AccountTypes;
	lastStatusEvent: (state: State) => BackupStatusEvent | undefined;
	lastSummaryEvent: (state: State) => BackupSummaryEvent | undefined;
	backupStarted: (state: State, getters: GetterContext) => boolean;
	backupFinished: (state: State, getters: GetterContext) => boolean;
	backups: (state: State, getters: GetterContext) => Backup[];
};

export type GetterContext = CreateGetterContext<Getters>;

const snapshotToSingleBackup = (snapshot: Snapshot): SingleBackup => ({
	name: snapshot.paths.join(", "),
	historic: [
		{
			id: snapshot.id,
			time: snapshot.time,
			name: snapshot.paths.join(", "),
			progress: 100,
			hostname: snapshot.hostname
		}
	]
});

const statusEventToBackup = (event: BackupStatusEvent): SingleBackup => ({
	name: "",
	historic: [
		{
			id: "",
			time: Date.now().toString(),
			name: "",
			progress: event.percent_done * 100,
			hostname: ""
		}
	]
});

const groupBackups = (ungrouped: SingleBackup[]): Backup[] => {
	const grouped: Backup[] = [];

	for (const backup of ungrouped) {
		const backupFound = grouped.find((item) => item.name === backup.name);

		if (backupFound !== undefined) {
			backupFound.historic.push(backup.historic[0]);
		} else {
			// deep clone
			grouped.push({
				name: backup.name,
				historic: [
					{
						...backup.historic[0]
					}
				]
			});
		}
	}

	return grouped;
};

const sortBackups = (backups: Backup[]): Backup[] => {
	const mostRecentHistoric = (backup: Backup) =>
		Math.max(
			...backup.historic.map((historic) => Date.parse(historic.time))
		);

	return [
		...backups.sort((a, b) => {
			const aTime = mostRecentHistoric(a);
			const bTime = mostRecentHistoric(b);

			if (aTime > bTime) {
				return -1;
			}

			if (aTime === bTime) {
				return 0;
			}

			return 1;
		})
	];
};

export const getters: Getters = {
	accountTypes: (state) => state.accountTypes,

	lastStatusEvent: (state) => {
		const isStatusEvent = (event: BackupEvent): boolean =>
			event.message_type === "status";

		const event = R.findLast(isStatusEvent)(state.backupEvents);

		return event as unknown as BackupStatusEvent | undefined;
	},

	lastSummaryEvent: (state) => {
		const isSummaryEvent = (event: BackupEvent): boolean =>
			event.message_type === "summary";

		const event = R.findLast(isSummaryEvent)(state.backupEvents);

		return event as unknown as BackupSummaryEvent | undefined;
	},

	backupStarted: (state, getters) => getters.lastStatusEvent !== undefined,

	backupFinished: (state, getters) => getters.lastSummaryEvent !== undefined,

	backups: (state, getters) => {
		const backups: Backup[] = [];

		// create Backup[] for in-progress snapshot
		if (getters.lastStatusEvent !== undefined) {
			backups.push(statusEventToBackup(getters.lastStatusEvent));
		}

		// transform raw restic snapshots into grouped backups
		if (state.snapshots !== null) {
			console.log(state.snapshots[0]);

			backups.push(
				...groupBackups(state.snapshots.map(snapshotToSingleBackup))
			);
		}

		return sortBackups(backups);
	}
};
