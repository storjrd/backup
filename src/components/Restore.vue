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
		<div>
			<input
				ref="locationInputElement"
				type="file"
				aria-roledescription="folder-restore-location"
				hidden
				webkitdirectory
				mozdirectory
				v-on:change="locationChosen"
			/>
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
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from "vue";
import { useStore } from "@/store";
import router from "@/router";

import { ArrowLeftIcon } from "@heroicons/vue/solid";

interface Properties {
	location: Ref<string>;
	spinner: Ref<boolean>;
	locationInputElement: Ref<null | HTMLInputElement>;
	chooseLocation: () => void;
	locationChosen: (arg0: Event) => void;
	goBackToBackups: () => void;
}

export default defineComponent({
	name: "Restore",
	components: {
		ArrowLeftIcon
	},
	setup: (): Properties => {
		const location = ref("hi/test/go");
		const spinner = ref(false);
		const locationInputElement = ref<null | HTMLInputElement>(null);

		const chooseLocation = () => {
			if (locationInputElement.value !== null) {
				locationInputElement.value.click();
			} else {
				throw new Error("locationInputElement null");
			}
		};

		const locationChosen = (e: Event) => {
			const target = e.target as HTMLInputElement;
			const path: string = (target.files as unknown as any[])[0].path;
			const folderPath: string = path.split("/").slice(0, -1).join("/");
			location.value = folderPath;
		};

		const goBackToBackups = () => {
			router.push("/app/backups");
		};

		return {
			location,
			spinner,
			locationInputElement,
			chooseLocation,
			locationChosen,
			goBackToBackups
		};
	}
});
</script>
