<template>
	<div class="p-8">
		<div class="flex items-center space-x-2">
			<ArrowLeftIcon
				class="w-4 h-4 cursor-pointer"
				v-on:click="goToBackups"
			/>
			<h1 class="text-lg font-bold">Settings</h1>
		</div>
		<div class="mt-5 border-b border-gray-100 pb-3">
			<h2 class="text-lg">Bucket</h2>
			<div class="flex justify-between">
				<div class="flex items-center">
					<img class="mr-2 w-5 h-5" src="@/assets/buckets.svg" />
					<p class="text-gray-700 text-sm">
						{{ bucketName }}
					</p>
				</div>
				<p class="text-storjBlue cursor-pointer text-sm">Change</p>
			</div>
		</div>
		<div>
			<h1 class="text-lg mt-5">Preferences</h1>
			<div class="relative flex items-start mt-2">
				<div class="flex items-center h-5">
					<input
						id="preferences"
						aria-describedby="preferences"
						name="preferences"
						type="checkbox"
						class="
							focus:ring-storjBlue
							h-4
							w-4
							text-storjBlue
							border-gray-300
							rounded
						"
						v-model="preferences"
					/>
				</div>
				<div class="ml-3 text-sm">
					<p id="preferences" class="">
						Launch Storj Backup on system startup
					</p>
				</div>
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
			v-on:click="save"
		>
			Save
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, Ref, computed } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";

import { ArrowLeftIcon } from "@heroicons/vue/solid";

interface Properties {
	preferences: Ref<boolean>;
	bucketName: Ref<string>;
	goToBackups: () => void;
	save: () => void;
}

export default defineComponent({
	name: "Settings",
	components: {
		ArrowLeftIcon
	},
	setup: (): Properties => {
		const store = useStore();
		const router = useRouter();

		store.dispatch("changeBucketName", { bucket: "test" });

		return {
			bucketName: computed(() => {
				return store.state.bucket;
			}),

			preferences: computed(() => store.state.preferences),

			goToBackups: () => {
				router.push("/app/backups");
			},

			save: () => {}
		};
	}
});
</script>
