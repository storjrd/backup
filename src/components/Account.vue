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
			<h2 class="text-lg font-medium">Your account</h2>
			<div class="flex justify-between">
				<div class="flex items-center">
					<p class="text-gray-700 text-sm">{{ account }}</p>
				</div>
				<p
					class="text-storjBlue cursor-pointer text-sm"
					v-on:click="disconnectAccount"
				>
					Disconnect account
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
			v-on:click="upgradePlan"
		>
			Upgrade Plan
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "../store/index";
import { ArrowLeftIcon } from "@heroicons/vue/solid";
import prettyBytes from "pretty-bytes";

export default defineComponent({
	name: "Account",
	components: {
		ArrowLeftIcon
	},
	data: () => ({}),
	computed: {
		account(): string {
			return store.state.account;
		},

		accountType(): string {
			return store.state.accountType;
		},

		plan(): number {
			return store.state.plan;
		},

		videosUsage(): number {
			return store.state.videosUsage;
		},

		picturesUsage(): number {
			return store.state.picturesUsage;
		},

		documentsUsage(): number {
			return store.state.documentsUsage;
		},

		othersUsage(): number {
			return store.state.othersUsage;
		},

		videosUsagePercentage(): number {
			return this.usagePercentage(this.videosUsage);
		},

		picturesUsagePercentage(): number {
			return this.usagePercentage(this.picturesUsage);
		},

		documentsUsagePercentage(): number {
			return this.usagePercentage(this.documentsUsage);
		},

		othersUsagePercentage(): number {
			return this.usagePercentage(this.othersUsage);
		},

		using(): number {
			return (
				this.videosUsage +
				this.picturesUsage +
				this.documentsUsage +
				this.othersUsage
			);
		},

		usingDisplay(): string {
			return `Using ${prettyBytes(this.using)} of ${prettyBytes(
				this.plan
			)}`;
		},

		availableSpace(): number {
			return this.plan - this.using;
		},

		charges(): number {
			return 0;
		},

		chargesDisplay(): string {
			if (
				this.accountType === store.getters["accountTypes"].freeAccount
			) {
				return `${this.accountType} Account - no charges.`;
			} else {
				return `${this.accountType} - ${this.charges}`;
			}
		}
	},
	methods: {
		goBackToBackups(): void {
			this.$router.push("/app/backups");
		},

		usagePercentage(usage: number): number {
			return (usage / this.plan) * 100;
		},

		disconnectAccount(): void {},

		upgradePlan(): void {}
	}
});
</script>
