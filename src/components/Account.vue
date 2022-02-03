<template>
	<div class="p-8">
		<div class="flex items-center space-x-2">
			<ArrowLeftIcon
				class="w-4 h-4 cursor-pointer"
				v-on:click="goBackToBackups"
			/>
			<h1 class="text-lg font-bold">Account</h1>
		</div>
		<div class="mt-5 border-b border-gray-100 pb-3">
			<h2 class="text-lg font-medium">Your satellite</h2>
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
			<div class="flex justify-start">
				<p class="text-gray-700 text-sm">{{ usingDisplay }}</p>
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
							width: `${videosUsagePercentage}%`
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
					<div
						v-bind:style="{
							width: `${picturesUsagePercentage}%`
						}"
						class="
							shadow-none
							flex flex-col
							text-center
							whitespace-nowrap
							text-white
							justify-center
							bg-yellow-400
						"
					></div>
					<div
						v-bind:style="{
							width: `${documentsUsagePercentage}%`
						}"
						class="
							shadow-none
							flex flex-col
							text-center
							whitespace-nowrap
							text-white
							justify-center
							bg-pink-500
						"
					></div>
					<div
						v-bind:style="{
							width: `${othersUsagePercentage}%`
						}"
						class="
							shadow-none
							flex flex-col
							text-center
							whitespace-nowrap
							text-white
							justify-center
							bg-green-400
						"
					></div>
				</div>
			</div>
			<div class="grid grid-cols-3">
				<div>
					<div class="flex space-x-2 items-center">
						<div class="h-3 w-3 rounded-sm bg-storjBlue"></div>
						<p class="text-sm">Videos</p>
					</div>
					<div class="flex space-x-2 items-center">
						<div class="h-3 w-3 rounded-sm bg-yellow-400"></div>
						<p class="text-sm">Pictures</p>
					</div>
				</div>
				<div>
					<div class="flex space-x-2 items-center">
						<div class="h-3 w-3 rounded-sm bg-pink-500"></div>
						<p class="text-sm">Documents</p>
					</div>
					<div class="flex space-x-2 items-center">
						<div class="h-3 w-3 rounded-sm bg-green-400"></div>
						<p class="text-sm">Others</p>
					</div>
				</div>
				<div>
					<div class="flex space-x-2 items-center">
						<div class="h-3 w-3 rounded-sm bg-gray-200"></div>
						<p class="text-sm">Available space</p>
					</div>
					<div></div>
				</div>
			</div>
		</div>
		<div class="mt-5 border-b border-gray-100 pb-3">
			<h2 class="text-lg font-medium">Charges</h2>
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
				font-medium
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
	videosUsage: Ref<number>;
	picturesUsage: Ref<number>;
	documentsUsage: Ref<number>;
	othersUsage: Ref<number>;
	videosUsagePercentage: Ref<number>;
	picturesUsagePercentage: Ref<number>;
	documentsUsagePercentage: Ref<number>;
	othersUsagePercentage: Ref<number>;
	usingDisplay: Ref<string>;
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

	const videosUsage = computed((): number => store.state.videosUsage);

	const picturesUsage = computed((): number => store.state.picturesUsage);

	const documentsUsage = computed((): number => store.state.documentsUsage);

	const othersUsage = computed((): number => store.state.othersUsage);

	const videosUsagePercentage = computed((): number => {
		return usagePercentage(videosUsage.value);
	});

	const picturesUsagePercentage = computed((): number => {
		return usagePercentage(picturesUsage.value);
	});

	const documentsUsagePercentage = computed((): number => {
		return usagePercentage(documentsUsage.value);
	});

	const othersUsagePercentage = computed((): number => {
		return usagePercentage(othersUsage.value);
	});

	const using = computed((): number => {
		return (
			videosUsage.value +
			picturesUsage.value +
			documentsUsage.value +
			othersUsage.value
		);
	});

	const usingDisplay = computed((): string => {
		return `Using ${prettyBytes(using.value)} of ${prettyBytes(
			plan.value
		)}`;
	});

	const availableSpace = computed((): number => plan.value - using.value);

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
		return (usage / plan.value) * 100;
	};

	const logout = (): void => {
		store.dispatch("logout");
	};

	const openUpgradePlanPage = (): void => {
		store.dispatch("openUpgradePlan");
	};

	return {
		endpoint,
		videosUsage,
		picturesUsage,
		documentsUsage,
		othersUsage,
		videosUsagePercentage,
		picturesUsagePercentage,
		documentsUsagePercentage,
		othersUsagePercentage,
		usingDisplay,
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
