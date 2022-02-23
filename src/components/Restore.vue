<template>
	<div class="p-8">
		<div class="flex justify-between">
			<div class="flex items-center space-x-2">
				<ArrowLeftIcon
					class="w-4 h-4 cursor-pointer"
					v-on:click="goBackToBackups"
				/>
				<h1 class="text-lg font-inter-bold">Restore</h1>
			</div>
			<button
				v-if="restoreDisabled"
				type="button"
				class="
					cursor-not-allowed
					inline-flex
					items-center
					h-9
					px-4
					py-2
					border border-transparent
					text-sm
					font-inter-medium
					rounded-md
					shadow-sm
					text-white
					bg-gray-400
					focus:outline-none
				"
			>
				<DownloadIcon
					class="w-5 h-5 mr-2 font-inter-normal text-white"
				/>
				Restore
			</button>
			<button
				type="button"
				class="
					inline-flex
					items-center
					px-4
					py-2
					h-full
					border
					shadow-sm
					text-sm
					leading-4
					font-inter-semibold
					rounded-md
					text-white
					bg-storjBlue
					hover:storjBlue
					focus:outline-none
					focus:ring-2
					focus:ring-offset-2
					focus:ring-storjBlue
				"
				v-if="!restoreDisabled"
				v-on:click="restore"
			>
				<span v-if="!loading && !completed" class="flex space-x-2">
					<DownloadIcon
						class="w-5 h-5 mr-2 font-inter-normal text-white"
					/>
					Restore
				</span>
				<div
					v-if="loading"
					class="flex justify-center items-center space-x-2"
				>
					<div
						class="
							animate-spin
							rounded-full
							h-2
							w-2
							border-b-2 border-green
							mr-2
						"
					></div>
					Restoring
				</div>
				<div v-if="completed" class="flex justify-center items-center">
					<CheckIcon
						class="w-5 h-5 mr-2 font-inter-normal text-white"
					/>
					Restored!
				</div>
			</button>
		</div>

		<div class="my-3">
			<p class="text-lg font-inter-medium">Location</p>
			<p class="text-sm text-gray-700 mt-1">
				Folder where your backup will be restored to
			</p>
			<div
				class="
					flex
					justify-between
					content-center
					items-center
					overflow-ellipsis
					mt-1
					border
					p-4
					rounded-lg
				"
				v-if="location"
			>
				<div class="flex">
					<img
						class="w-5 h-5 fill-current text-black mr-2"
						src="@/assets/folderIcon.svg"
					/>
					<p class="text-gray-700 text-base">{{ folderName() }}</p>
				</div>
				<div>
					<a
						v-on:click.prevent="chooseLocation"
						href="#"
						class="text-storjBlue text-sm"
						>Change</a
					>
				</div>
			</div>
		</div>

		<div v-if="!location" class="flex items-end space-x-4 mt-2">
			<button
				type="button"
				class="
					inline-flex
					items-center
					px-3
					py-2
					h-full
					border border-gray-300
					shadow-sm
					text-sm
					leading-4
					font-inter-semibold
					rounded-md
					text-gray-700
					bg-white
					hover:bg-gray-50
					focus:outline-none focus:ring-2 focus:ring-offset-2
				"
				v-on:click="chooseLocation"
			>
				Choose Location
			</button>
		</div>
		<h3 class="text-lg font-inter-medium mt-4 mb-2">Version</h3>
		<div
			class="
				h-52
				overflow-auto
				shadow-sm
				border border-gray-200
				rounded-lg
				scrollbar-thin
				scrollbar-thumb-gray-300
				scrollbar-track-gray-100
				scrollbar-thumb-rounded-full
				scrollbar-track-rounded-full
			"
		>
			<ul class="space-y-2 divide-y divide-solid">
				<li
					v-for="backup in backups.historic"
					class="relative flex items-start py-2.5 pl-3"
				>
					<div class="flex items-center h-5">
						<input
							type="checkbox"
							class="
								focus:ring-storjBlue
								h-4
								w-4
								text-storjBlue
								border-gray-300
								rounded
							"
							v-bind:id="backup.id"
							v-bind:name="backup.id"
							v-bind:checked="backupToRestore === backup.id"
							v-on:click="selectBackup(backup.id)"
						/>
					</div>
					<div class="ml-3 text-sm">
						<label
							v-bind:for="backup.id"
							class="font-inter-semibold text-gray-700 text-sm"
							>{{ formatBackupDate(backup.time) }}</label
						>
						<p
							id="comments-description"
							class="text-gray-500 text-xs"
						>
							{{ formatBackupTime(backup.time) }}
						</p>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";

import { ArrowLeftIcon } from "@heroicons/vue/solid";
import { CheckIcon, DownloadIcon } from "@heroicons/vue/outline";

import type { Backup } from "@/types";

interface Properties {
	locationInputElement: Ref<null | HTMLInputElement>;

	location: Ref<string>;
	loading: Ref<boolean>;
	restoreDisabled: Ref<boolean>;
	completed: Ref<boolean>;

	chooseLocation: () => void;
	goBackToBackups: () => void;
	backups: Ref<Backup>;
	backupToRestore: Ref<string | undefined>;
	selectBackup: (id: string) => void;
	restore: () => void;
	formatBackupDate: (dateTime: string) => string;
	formatBackupTime: (dateTime: string) => string;
	folderName: () => string;
}

export default defineComponent({
	name: "Restore",
	components: {
		ArrowLeftIcon,
		CheckIcon,
		DownloadIcon
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

			const filePath = response.filePaths[0];

			if (typeof filePath === "string") {
				location.value = filePath;
				completed.value = false;
			}
		};

		const backups = computed<Backup>((): Backup => {
			const allBackups: Backup[] = store.getters.backups;

			const currentBackups = allBackups.find((backup: Backup) => {
				let name = route.params.name;
				const regex = /\./g;

				if (typeof name === "object") {
					name = name.join("");
				}

				return backup.name === name?.replace(regex, "/");
			});

			if (typeof currentBackups === "undefined") {
				throw new Error("Backups for current restore not found.");
			}

			return currentBackups;
		});

		const backupToRestore = ref(backups.value.historic[0]?.id);

		const selectBackup = (id: string) => {
			backupToRestore.value = id;
		};

		const restore = async () => {
			console.log("restore()");
			completed.value = false;
			loading.value = true;

			await store.dispatch("restore", {
				snapshotId: backupToRestore.value,
				target: location.value
			});

			loading.value = false;
			completed.value = true;
		};

		const goBackToBackups = () => {
			router.push("/app/backups");
		};

		const formatBackupDate = (dateTime: string) => {
			const date = new Date(dateTime);
			return `${date.toDateString()}`;
		};

		const formatBackupTime = (dateTime: string) => {
			const date = new Date(dateTime);
			return `${date.toTimeString()}`;
		};

		const folderName = () => {
			const folder = location.value;

			if (!folder) {
				return "";
			}

			if (folder.length <= 64) {
				return folder;
			}

			const folders = folder.split("/");

			const lastFolder = folders.slice(-1)[0];

			if (typeof lastFolder === "undefined") {
				throw new Error("Unable to truncate folder name.");
			}

			if (lastFolder.length >= 61) {
				return `.../${lastFolder.substring(0, 60)}`;
			}

			const beginning = folder.substring(0, 60 - lastFolder.length);

			return `${beginning}.../${lastFolder}`;
		};

		return {
			location,
			loading,
			completed,
			restoreDisabled,
			locationInputElement,
			chooseLocation,
			goBackToBackups,
			backups,
			backupToRestore,
			selectBackup,
			restore,
			formatBackupDate,
			formatBackupTime,
			folderName
		};
	}
});
</script>
