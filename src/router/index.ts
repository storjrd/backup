import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		component: Home
	},
	{
		path: "/app",
		name: "Dashboard",
		component: Dashboard
	}
];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

export default router;
