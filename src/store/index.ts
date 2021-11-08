import { createStore } from "vuex";

const store = createStore({
	state: {
		snapshots: [],
		account: "david@gmail.com",
		plan: 1.5e+11,
		accountType: "Free",
		accountTypes: {
			freeAccount: "Free"
		},
		videosUsage: 3e+10,
		picturesUsage: 7.5e+9,
		documentsUsage: 6e+9,
		othersUsage: 4e+9,
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
