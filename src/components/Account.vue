<template>
	<div class="p-8">
		<div class="flex items-center space-x-2">
			<ArrowLeftIcon
				class="w-4 h-4 cursor-pointer"
				v-on:click="goBackToBackups"
			/>
			<h1 class="text-lg font-inter-bold">Account</h1>
		</div>
		<div class="mt-5 border-b border-gray-100 pb-3">
			<h2 class="text-lg font-inter-medium">Your satellite</h2>
			<div class="flex justify-between">
				<div class="flex items-center">
					<p class="text-gray-700 text-sm">{{ endpoint }}</p>
				</div>
				<p
					class="text-storjBlue cursor-pointer text-sm"
					v-on:click="logout"
				>
					Logout
				</p>
			</div>
		</div>
		<div class="mt-5 border-b border-gray-100 pb-3">
			<h2 class="text-lg font-medium">Storage usage</h2>
			<div class="flex justify-between mb-1">
				<p class="text-gray-700 text-sm">{{ totalUsageDisplay }}</p>
				<p class="text-gray-700 text-sm">{{ totalUsageLeftDisplay }}</p>
			</div>
			<div class="relative pt-1">
				<div
					class="
						overflow-hidden
						h-2
						mb-4
						text-xs
						flex
						rounded
						bg-gray-200
					"
				>
					<div
						v-bind:style="{
							width: `${totalUsagePercentage}%`
						}"
						class="
							shadow-none
							flex flex-col
							text-center
							whitespace-nowrap
							text-white
							justify-center
							bg-storjBlue
						"
					></div>
				</div>
			</div>
		</div>
		<div class="mt-5 border-b border-gray-100 pb-3">
			<h2 class="text-lg font-inter-medium">Charges</h2>
			<div class="flex justify-start">
				<p class="text-gray-700 text-sm">{{ chargesDisplay }}</p>
			</div>
		</div>

		<button
			type="button"
			class="
				inline-flex
				items-center
				px-3
				py-2
				mt-8
				border border-transparent
				text-sm
				leading-4
				font-inter-medium
				rounded-md
				shadow-sm
				text-white
				bg-storjBlue
				hover:storjBlue
				focus:outline-none
				focus:ring-2
				focus:ring-offset-2
				focus:ring-storjBlue
			"
			v-on:click="openUpgradePlanPage"
		>
			Upgrade Plan
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from "vue";
import { useStore } from "@/store";
import router from "@/router";

import { ArrowLeftIcon } from "@heroicons/vue/solid";
import prettyBytes from "pretty-bytes";

interface Properties {
	endpoint: Ref<string>;
	totalUsagePercentage: Ref<number>;
	totalUsageDisplay: Ref<string>;
	totalUsageLeftDisplay: Ref<string>;
	chargesDisplay: Ref<string>;
	goBackToBackups: () => void;
	usagePercentage: (arg0: number) => number;
	logout: () => void;
	openUpgradePlanPage: () => void;
}

const setupAccount = (): Properties => {
	const store = useStore();

	const endpoint = computed((): string => store.state.endpoint);

	const accountType = computed((): string => store.state.accountType);

	const plan = computed((): number => store.state.plan);

	const totalUsage = computed((): number => store.state.totalUsage);

	const totalUsagePercentage = computed((): number => {
		return usagePercentage(totalUsage.value);
	});

	const totalUsageAvailablePercentage = computed((): number => {
		return 100 - totalUsagePercentage.value;
	});

	const totalUsageDisplay = computed((): string => {
		return `Using ${prettyBytes(totalUsage.value)} of ${prettyBytes(
			plan.value
		)}`;
	});

	const totalUsageLeftDisplay = computed((): string => {
		return `${totalUsageAvailablePercentage.value}% Available`;
	});

	// retrieve this info from store
	const charges = computed((): number => 0);

	const chargesDisplay = computed((): string => {
		if (accountType.value === store.getters["accountTypes"].freeAccount) {
			return `${accountType.value} Account - no charges.`;
		} else {
			return `${accountType.value} - ${charges.value}`;
		}
	});

	const goBackToBackups = (): void => {
		router.push("/app/backups");
	};

	const usagePercentage = (usage: number): number => {
		return parseFloat(((usage / plan.value) * 100).toFixed(2));
	};

	const logout = (): void => {
		store.dispatch("logout");
	};

	const openUpgradePlanPage = (): void => {
		store.dispatch("openUpgradePlan");
	};

	return {
		endpoint,
		totalUsagePercentage,
		totalUsageDisplay,
		totalUsageLeftDisplay,
		chargesDisplay,
		goBackToBackups,
		usagePercentage,
		logout,
		openUpgradePlanPage
	};
};

export default defineComponent({
	name: "Account",
	components: {
		ArrowLeftIcon
	},
	setup: (): Properties => ({
		...setupAccount()
	})
});
</script>
