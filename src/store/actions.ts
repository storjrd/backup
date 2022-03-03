import type { LoginResponse } from "@/api";
import { CreateActionContext } from "@/lib/typed-store";
import backend from "@/lib/backend";
import { Snapshot } from "@/types";

import { State } from "./state";
import { Mutations } from "./mutations";
import { Getters } from "./getters";

export type ActionContext = CreateActionContext<
	State,
	Actions,
	Mutations,
	Getters
>;

export type Actions = {
	getSnapshots: (arg0: ActionContext) => void;
	login: (
		arg0: ActionContext,
		arg1: {
			accessKey: string;
			secretKey: string;
			endpoint: string;
			bucket: string;
			resticPassphrase: string;
		}
	) => Promise<LoginResponse>;
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

export const actions: Actions = {
	async getSnapshots({ commit }) {
		commit("setSnapshots", await backend.invoke("snapshots"));
	},

	async login(
		{ commit, dispatch },
		{ accessKey, secretKey, endpoint, bucket, resticPassphrase }
	) {
		console.log({
			endpoint,
			bucket,
			accessKey,
			secretKey,
			resticPassphrase
		});

		const response = await backend.invoke("setup", {
			endpoint,
			bucket,
			accessKey,
			secretKey,
			resticPassphrase
		});

		if (response.success === true) {
			commit("login");
			dispatch("getBucketName");
		}

		return response;
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
