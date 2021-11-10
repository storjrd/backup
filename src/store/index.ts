import { InjectionKey } from "vue";
import { Store, createStore, useStore as baseUseStore } from "vuex";
import type { Snapshot } from "@/types";

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
		account: "david@gmail.com",
		plan: 1.5e11,
		accountType: "Free",
		accountTypes: {
			freeAccount: "Free"
		},
		videosUsage: 3e10,
		picturesUsage: 7.5e9,
		documentsUsage: 6e9,
		othersUsage: 4e9,
		backupLocation: "/Volumes/StorjBackup",
		localCachedDirectory: "/Volumes/StorjBackup",
		preferences: true
	},
	getters: {
		accountTypes(state) {
			return state.accountTypes;
		}
	},
	mutations: {
		setSnapshots(state, snapshots) {
			state.snapshots = snapshots;
		}
	},
	actions: {
		async getSnapshots({ commit }) {
			commit("setSnapshots", await backend.invoke("snapshots"));
		},

		async login(
			{ dispatch },
			{ email, password }: { email: string; password: string }
		) {
			const [endpoint, bucket] = email.split(",").map((x) => x.trim());
			const [accessKey, secretKey] = password
				.split(",")
				.map((x) => x.trim());

			console.log({
				email,
				password,
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
		},

		async backup({ dispatch }, { directories }: { directories: string[] }) {
			await backend.invoke("backup", {
				directories
			});

			dispatch("getSnapshots");
		}
	},
	modules: {}
});

export const useStore = () => baseUseStore(key);
