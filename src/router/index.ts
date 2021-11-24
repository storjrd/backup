import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import Backups from "../components/Backups.vue";
import Settings from "../components/Settings.vue";
import Account from "../components/Account.vue";
import Restore from "../components/Restore.vue";

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
			},
			{
				name: "Account",
				path: "account",
				component: Account
			},
			{
				name: "Restore",
				path: "restore/:id",
				component: Restore
			}
		]
	}
];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

export default router;
