<template>
	<div class="p-8">
		<div class="flex items-center space-x-2">
			<ArrowLeftIcon
				class="w-4 h-4 cursor-pointer"
				v-on:click="goBackToBackups"
			/>
			<h1 class="text-lg font-bold">Restore</h1>
		</div>

		<div class="mt-5" v-if="location">
			<p class="text-lg font-medium">Location</p>
			<p class="text-xs font-normal text-gray-700 -mt-1">
				Where your backup will be restored to
			</p>
			<p class="text-gray-700 text-sm mt-2">{{ location }}</p>
		</div>

		<div class="space-x-4">
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
				v-on:click="chooseLocation"
			>
				Choose Location
			</button>

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
					bg-blue-200
					focus:outline-none
					cursor-not-allowed
				"
				v-if="restoreDisabled"
			>
				Restore
			</button>

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
				v-else
				v-on:click="restore"
			>
				Restore
			</button>
		</div>
		<div class="mt-4">
			<p v-if="loading">Restoring...</p>
			<p v-if="completed">Restore complete!</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";

import { ArrowLeftIcon } from "@heroicons/vue/solid";

interface Properties {
	locationInputElement: Ref<null | HTMLInputElement>;

	location: Ref<string>;
	loading: Ref<boolean>;
	restoreDisabled: Ref<boolean>;
	completed: Ref<boolean>;

	chooseLocation: () => void;
	goBackToBackups: () => void;
	restore: () => void;
}

export default defineComponent({
	name: "Restore",
	components: {
		ArrowLeftIcon
	},
	setup: (): Properties => {
		const store = useStore();
		const router = useRouter();
		const route = useRoute();

		const location = ref("");
		const loading = ref(false);
		const completed = ref(false);
		const locationInputElement = ref<null | HTMLInputElement>(null);

		const restoreDisabled = computed(() => location.value === "");

		const chooseLocation = async () => {
			const response: {
				canceled: boolean;
				filePaths: string[];
			} = await store.dispatch("getDirectory");

			location.value = response.filePaths[0];
			completed.value = false;
		};

		const restore = async () => {
			console.log("restore()");
			loading.value = true;

			await store.dispatch("restore", {
				snapshotId: route.params.id,
				target: location.value
			});

			loading.value = false;
			completed.value = true;
		};

		const goBackToBackups = () => {
			router.push("/app/backups");
		};

		return {
			location,
			loading,
			completed,
			restoreDisabled,
			locationInputElement,
			chooseLocation,
			goBackToBackups,
			restore
		};
	}
});
</script>
