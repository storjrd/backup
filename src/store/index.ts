import { createStore } from "vuex";

const store = createStore({
	state: {
		snapshots: []
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
