import { InjectionKey } from "vue";
import { Store, createStore, useStore as baseUseStore } from "vuex";
import * as R from "ramda";
import type {
	Snapshot,
	BackupEvent,
	BackupStatusEvent,
	BackupSummaryEvent
} from "@/types";

interface Backend {
	invoke: (fn: string, args?: any) => Promise<any>;
}

declare global {
	interface Window {
		backend: Backend;
	}
}

const { backend } = window;

export interface State {
	snapshots: Snapshot[] | null;
	backupEvents: any[];
	loginStatus: boolean;

	// todo: remove
	account: string;
	plan: number;
	accountType: string;
	accountTypes: object;
	videosUsage: number;
	picturesUsage: number;
	documentsUsage: number;
	othersUsage: number;
	backupLocation: string;
	localCachedDirectory: string;
	preferences: boolean;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
	state: {
		snapshots: null,
		backupEvents: [],
		loginStatus: false,

		account: "example@storj.io",
		plan: 1.5e11,
		accountType: "Free",
		accountTypes: {
			freeAccount: "Free"
		},
		videosUsage: 0,
		picturesUsage: 0,
		documentsUsage: 0,
		othersUsage: 0,
		backupLocation: "/Volumes/StorjBackup",
		localCachedDirectory: "/Volumes/StorjBackup",
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
			getters.lastSummaryEvent !== undefined
	},
	mutations: {
		login(state) {
			state.loginStatus = true;
		},

		logout(state) {
			state.loginStatus = false;
		},

		setSnapshots(state, snapshots) {
			state.snapshots = snapshots;
		},

		pushBackupEvents(state, events) {
			state.backupEvents = [...state.backupEvents, ...events];

			if (state.backupEvents.length > 5) {
				state.backupEvents.splice(0, state.backupEvents.length - 5);
			}
		},

		clearBackupEvents(state) {
			state.backupEvents.splice(0);
		}
	},
	actions: {
		async getSnapshots({ commit }) {
			commit("setSnapshots", await backend.invoke("snapshots"));
		},

		async login(
			{ commit },
			{
				accessKey,
				secretKey,
				endpoint,
				bucket
			}: {
				accessKey: string;
				secretKey: string;
				endpoint: string;
				bucket: string;
			}
		) {
			console.log({
				endpoint,
				bucket,
				accessKey,
				secretKey
			});

			await backend.invoke("setup", {
				endpoint,
				bucket,
				accessKey,
				secretKey
			});

			commit("login");
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
			{},
			{ snapshotId, target }: { snapshotId: string; target: string }
		) {
			await backend.invoke("restore", {
				snapshotId,
				target
			});
		},

		// prompt user for directory
		async getDirectory() {
			return backend.invoke("get-directory");
		},

		async openSignup() {
			backend.invoke("openSignup");
		},

		async openUpgradePlan() {
			backend.invoke("openUpgradePlan");
		}
	},
	modules: {}
});

(async () => {
	if (await backend.invoke("loginStatus")) {
		store.commit("login");
	}
})();

export const useStore = () => baseUseStore(key);
