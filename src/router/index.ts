import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import Backups from "../components/Backups.vue";
import Settings from "../components/Settings.vue";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		component: Home
	},
	{
		path: "/app",
		name: "Dashboard",
		component: Dashboard,
		children: [
			{
				name: "Backups",
				path: "backups",
				component: Backups
			},
			{
				name: "Settings",
				path: "settings",
				component: Settings
			}
		]
	}
];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

export default router;
