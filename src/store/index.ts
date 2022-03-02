import { InjectionKey } from "vue";
import { Store, createStore, useStore as baseUseStore } from "vuex";
import * as R from "ramda";

import {
	CreateGetterContext,
	CreateActionContext,
	CreateDispatch
} from "@/lib/typed-store";
import backend from "@/lib/backend.ts";

import type {
	AccountTypes,
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
	accountTypes: AccountTypes;
	videosUsage: number;
	picturesUsage: number;
	documentsUsage: number;
	othersUsage: number;
	totalUsage: number;
	preferences: boolean;
}

export const key: InjectionKey<Store<State>> = Symbol();

const mutations = {
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

type Getters = {
	accountTypes: (state: State) => AccountTypes;
	lastStatusEvent: (state: State) => BackupStatusEvent | undefined;
	lastSummaryEvent: (state: State) => BackupSummaryEvent | undefined;
	backupStarted: (state: State, getters: GetterContext) => boolean;
	backupFinished: (state: State, getters: GetterContext) => boolean;
	backups: (state: State, getters: GetterContext) => Backup[];
};

type GetterContext = CreateGetterContext<Getters>;

const getters: Getters = {
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

type Actions = {
	getSnapshots: (arg0: ActionContext) => void;
	login: (
		arg0: ActionContext,
		arg1: {
			accessKey: string;
			secretKey: string;
			endpoint: string;
			bucket: string;
			resticPassword: string;
		}
	) => void;
	logout: (arg0: ActionContext) => void;
	backup: (arg0: ActionContext, arg1: { directories: string[] }) => void;
	restore: (
		arg0: ActionContext,
		arg1: { snapshotId: string; target: string }
	) => void;
	getDirectory: () => Promise<{
		canceled: boolean;
		filePaths: string[];
	}>;
	openSignup: () => void;
	openUpgradePlan: () => void;
	openGetStarted: () => void;
	getEndpoint: (arg0: ActionContext) => void;
	getBucketName: (arg0: ActionContext) => void;
	getTotalUsage: (arg0: ActionContext) => void;
};

type ActionContext = CreateActionContext<
	State,
	Actions,
	typeof mutations,
	typeof getters
>;

const actions: Actions = {
	async getSnapshots({ commit }) {
		commit("setSnapshots", await backend.invoke("snapshots"));
	},

	async login(
		{ commit, dispatch }: ActionContext,
		{ accessKey, secretKey, endpoint, bucket, resticPassword }
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

	async backup({ dispatch, commit, getters }, { directories }) {
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

	async restore({ state }, { snapshotId, target }) {
		const snapshots = state.snapshots;

		if (snapshots === null) {
			throw new Error("Cannot restore snapshot before loaded");
		}

		const snapshot = snapshots.find(
			(snapshot) => snapshot.id === snapshotId
		);

		if (snapshot === undefined) {
			throw new Error(`Cannot find snapshot JSON.stringify(snapshotId)`);
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
};

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
		videosUsage: 0,
		picturesUsage: 0,
		documentsUsage: 0,
		othersUsage: 0,
		totalUsage: 0.8e11,
		preferences: true
	},
	getters,
	mutations,
	actions,
	modules: {}
});

(async () => {
	if (await backend.invoke("loginStatus")) {
		store.commit("login");
		store.dispatch("getBucketName");
		store.dispatch("getEndpoint");
	}
})();

export const useStore = () => baseUseStore(key) as ActionContext;
