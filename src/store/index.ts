import { createStore } from "vuex";

const store = createStore({
	state: {
		snapshots: [],
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
	actions: {},
	modules: {}
});

export default store;

setTimeout(async () => {
	// @ts-ignore
	store.commit("setSnapshots", await window.backend.invoke("snapshots"));
	console.log(store.state);
}, 500);
