import { InjectionKey } from "vue";
import { Store, createStore, useStore as baseUseStore } from "vuex";
import * as R from "ramda";

import backend from "@/lib/backend.ts";

import type {
	Snapshot,
	Backup,
	BackupEvent,
	BackupStatusEvent,
	BackupSummaryEvent
} from "@/types";

export interface State {
	snapshots: Snapshot[] | null;
	backupEvents: BackupEvent[];
	loginStatus: boolean;

	// todo: remove
	endpoint: string;
	plan: number;
	bucket: string;
	accountType: string;
	accountTypes: object;
	totalUsage: number;
	preferences: boolean;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
	state: {
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
	},
	getters: {
		accountTypes: (state) => state.accountTypes,

		lastStatusEvent: (state): BackupStatusEvent | undefined => {
			const isStatusEvent = (event: BackupEvent): boolean =>
				event.message_type === "status";

			const event = R.findLast(isStatusEvent)(state.backupEvents);

			return event as unknown as BackupStatusEvent | undefined;
		},

		lastSummaryEvent: (state): BackupSummaryEvent | undefined => {
			const isSummaryEvent = (event: BackupEvent): boolean =>
				event.message_type === "summary";

			const event = R.findLast(isSummaryEvent)(state.backupEvents);

			return event as unknown as BackupSummaryEvent | undefined;
		},

		backupStarted: (state, getters): boolean =>
			getters.lastStatusEvent !== undefined,

		backupFinished: (state, getters): boolean =>
			getters.lastSummaryEvent !== undefined,

		backups: (state, getters): Backup[] => {
			const arr: Backup[] = [];

			if (getters.backupStarted && !getters.backupFinished) {
				arr.push({
					name: "",
					historic: [
						{
							id: "",
							time: Date.now().toString(),
							name: "",
							progress:
								getters.lastStatusEvent.percent_done * 100,
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
	},
	mutations: {
		login(state) {
			state.loginStatus = true;
		},

		logout(state) {
			state.loginStatus = false;
		},

		setBucketName(state, name) {
			state.bucket = name;
		},

		setSnapshots(state, snapshots) {
			state.snapshots = snapshots;
		},

		setEndpoint(state, endpoint) {
			state.endpoint = endpoint;
		},

		pushBackupEvents(state, events) {
			state.backupEvents = [...state.backupEvents, ...events];

			if (state.backupEvents.length > 5) {
				state.backupEvents.splice(0, state.backupEvents.length - 5);
			}
		},

		clearBackupEvents(state) {
			state.backupEvents.splice(0);
		},

		setTotalUsage(state, usage) {
			state.totalUsage = usage;
		}
	},
	actions: {
		async getSnapshots({ commit }) {
			commit("setSnapshots", await backend.invoke("snapshots"));
		},

		async login(
			{ commit, dispatch },
			{
				accessKey,
				secretKey,
				endpoint,
				bucket,
				resticPassword
			}: {
				accessKey: string;
				secretKey: string;
				endpoint: string;
				bucket: string;
				resticPassword: string;
			}
		) {
			console.log({
				endpoint,
				bucket,
				accessKey,
				secretKey,
				resticPassword
			});

			if (resticPassword.length < 3) {
				throw new Error(
					"Password needs to be longer than three characters."
				);
			}

			await backend.invoke("setup", {
				endpoint,
				bucket,
				accessKey,
				secretKey,
				resticPassword
			});

			commit("login");
			dispatch("getBucketName");
		},

		async logout({ commit }) {
			await backend.invoke("logout");
			commit("logout");
		},

		async backup(
			{ dispatch, commit, getters },
			{ directories }: { directories: string[] }
		) {
			backend.invoke("backup", {
				directories
			});

			commit("clearBackupEvents");

			console.log("events", getters.lastSummaryEvent);

			while (getters.lastSummaryEvent === undefined) {
				commit(
					"pushBackupEvents",
					await backend.invoke("get-backup-events")
				);

				console.log("summary event", getters.lastSummaryEvent);

				await new Promise((resolve) => setTimeout(resolve, 100));
			}

			console.log("backup finished");

			dispatch("getSnapshots");
		},

		async restore(
			{ commit, state },
			{ snapshotId, target }: { snapshotId: string; target: string }
		) {
			const snapshots = state.snapshots;

			if (snapshots === null) {
				throw new Error("Cannot restore snapshot before loaded");
			}

			const snapshot = snapshots.find(
				(snapshot) => snapshot.id === snapshotId
			);

			if (snapshot === undefined) {
				throw new Error(
					`Cannot find snapshot JSON.stringify(snapshotId)`
				);
			}

			await backend.invoke("restore", {
				snapshot: JSON.parse(JSON.stringify(snapshot)) as Snapshot,
				target
			});
		},

		// prompt user for directory
		async getDirectory(): Promise<{
			canceled: boolean;
			filePaths: string[];
		}> {
			const directory = await backend.invoke("get-directory");

			if (typeof directory === "undefined") {
				throw new Error("Directory does not exist.");
			}

			return directory;
		},

		async openSignup() {
			backend.invoke("openSignup");
		},

		async openUpgradePlan() {
			backend.invoke("openUpgradePlan");
		},

		async openGetStarted() {
			backend.invoke("openGetStarted");
		},

		async getEndpoint({ commit }) {
			const endpoint = await backend.invoke("getEndpoint");

			if (endpoint) {
				commit("setEndpoint", endpoint);
			}
		},

		async getBucketName({ commit }) {
			const bucketName = await backend.invoke("getBucketName");

			if (bucketName) {
				commit("setBucketName", bucketName);
			}
		},

		async getTotalUsage({ commit }) {
			// get total usage
			//...
			// set total usage
			// commit("setTotalUsage")
		}
	},
	modules: {}
});

(async () => {
	if (await backend.invoke("loginStatus")) {
		store.commit("login");
		store.dispatch("getBucketName");
		store.dispatch("getEndpoint");
	}
})();

export const useStore = () => baseUseStore(key);
