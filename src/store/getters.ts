import * as R from "ramda";
import { CreateGetterContext } from "@/lib/typed-store";
import { State } from "./state";

import type {
	AccountTypes,
	Snapshot,
	Backup,
	BackupEvent,
	BackupStatusEvent,
	BackupSummaryEvent
} from "@/types";

export type Getters = {
	accountTypes: (state: State) => AccountTypes;
	lastStatusEvent: (state: State) => BackupStatusEvent | undefined;
	lastSummaryEvent: (state: State) => BackupSummaryEvent | undefined;
	backupStarted: (state: State, getters: GetterContext) => boolean;
	backupFinished: (state: State, getters: GetterContext) => boolean;
	backups: (state: State, getters: GetterContext) => Backup[];
};

export type GetterContext = CreateGetterContext<Getters>;

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
		const arr: Backup[] = [];

		if (
			getters.backupStarted &&
			!getters.backupFinished &&
			getters.lastStatusEvent !== undefined
		) {
			arr.push({
				name: "",
				historic: [
					{
						id: "",
						time: Date.now().toString(),
						name: "",
						progress: getters.lastStatusEvent.percent_done * 100,
						hostname: ""
					}
				]
			});
		}

		if (state.snapshots !== null) {
			const backupsArr = state.snapshots
				.map(
					(snapshot: Snapshot): Backup => ({
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
					})
				)
				.reverse();

			backupsArr.forEach((backup) => {
				const backupFound = arr.find(
					(item) => item.name === backup.name
				);

				if (backupFound && backup.historic[0]) {
					backupFound.historic.push(backup.historic[0]);
				} else if (backup.historic[0]) {
					arr.push({
						name: backup.name,
						historic: [backup.historic[0]]
					});
				}
			});
		}

		return arr;
	}
};
