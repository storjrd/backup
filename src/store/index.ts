import { InjectionKey } from "vue";
import { Store, createStore, useStore as baseUseStore } from "vuex";

import backend from "@/lib/backend";
import { State, state } from "./state";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { ActionContext, actions } from "./actions";

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
	state,
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
