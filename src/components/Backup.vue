<style scoped>
.unclickable {
	display: block;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.35);
	text-align: center;
}
</style>

<template>
	<div class="bg-white shadow-lg rounded-lg p-3">
		<div class="flex justify-between items-center">
			<div
				class="
					flex
					justify-start
					content-center
					items-center
					overflow-ellipsis
				"
			>
				<img
					class="w-5 h-5 fill-current text-black mr-2"
					src="@/assets/folderIcon.svg"
				/>
				<img
					v-if="backupInProgress"
					class="w-3 h-3 fill-current text-black -mb-3 -ml-4"
					src="@/assets/arrow-up-pink-circle.svg"
				/>
				<img
					v-else
					class="w-3 h-3 fill-current text-black -mb-3 -ml-4"
					src="@/assets/check-green-circle.svg"
				/>
				<p class="text-lg ml-2">{{ folderName }}</p>
			</div>
			<div class="self-center">
				<div class="flex space-x-1">
					<!-- <ExclamationCircleIcon
						class="w-5 h-5 font-bold text-gray-700"
					/>
					<XCircleIcon class="w-5 h-5font-bold text-gray-700" /> -->
					<div class="relative">
						<div
							v-if="backupTooltip"
							class="
								absolute
								text-sm text-gray-800
								bg-gray-50
								rounded-lg
								border
								shadow
								p-2
								-my-4
								-mx-40
								w-40
							"
						>
							Backup this directory.
						</div>
						<ArrowCircleUpIcon
							class="
								w-5
								h-5
								font-inter-bold
								text-gray-700
								cursor-pointer
							"
							v-on:click="createBackup"
							@mouseover="backupArrowOver"
							@mouseleave="backupArrowLeave"
						/>
					</div>
					<div class="relative">
						<div
							v-if="restoreTooltip"
							class="
								absolute
								text-sm text-gray-800
								bg-gray-50
								rounded-lg
								border
								shadow
								p-2
								transform
								-my-4
								-mx-40
								w-40
							"
						>
							Restore this backup to your computer.
						</div>
						<ArrowCircleDownIcon
							class="
								w-5
								h-5
								font-inter-bold
								text-gray-700
								cursor-pointer
							"
							v-on:click="restore"
							@mouseover="restoreArrowOver"
							@mouseleave="restoreArrowLeave"
						/>
					</div>
				</div>
			</div>
		</div>
		<div class="flex justify-between">
			<p class="text-left">
				<!-- {{ backupMetadata }}

				<br /> -->

				<span class="">{{ backupMetadata }}</span>
			</p>
			<!-- <p
				class="text-storjBlue cursor-pointer hover:underline text-sm"
				v-on:click="updateBackup"
			>
				See details
			</p> -->
		</div>
		<div v-if="backupInProgress" class="relative pt-1">
			<div
				class="
					overflow-hidden
					h-2
					text-xs
					flex
					rounded
					bg-gray-100
					shadow-inner
				"
			>
				<div
					v-bind:style="{
						width: `${backup.historic[0].progress}%`
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
</template>

<script lang="ts">
import { defineComponent, Ref, ref, reactive, computed } from "vue";

import type { Backup } from "@/types";
import MyBackupModal from "@/components/MyBackupModal.vue";

import {
	PlusCircleIcon,
	ExclamationCircleIcon,
	XCircleIcon,
	ArrowCircleDownIcon,
	ArrowCircleUpIcon,
	CogIcon,
	UserIcon
} from "@heroicons/vue/outline";

import router from "@/router";
import { useStore } from "@/store";

interface Properties {
	backup: Backup;
	backupMetadata: Ref<string>;
	backupInProgress: Ref<boolean>;
	folderName: Ref<string>;
	backupTooltip: Ref<boolean>;
	restoreTooltip: Ref<boolean>;
	restore: () => void;
	updateBackup: () => void;
	createBackup: () => void;
	backupArrowOver: () => void;
	backupArrowLeave: () => void;
	restoreArrowOver: () => void;
	restoreArrowLeave: () => void;
}

export default defineComponent({
	name: "Backups",
	components: {
		MyBackupModal,
		PlusCircleIcon,
		ExclamationCircleIcon,
		XCircleIcon,
		ArrowCircleDownIcon,
		ArrowCircleUpIcon,
		CogIcon,
		UserIcon
	},
	props: ["backup"],
	emits: ["handleBackupUpdate"],
	setup: (props, { emit }): Properties => {
		const store = useStore();

		const backup = reactive<Backup>(props.backup);

		const backupTooltip = ref(false);

		const restoreTooltip = ref(false);

		const backupMetadata = computed<string>(() => {
			const currentBackup = backup.historic[0];
			const hostname = currentBackup?.hostname;
			const fileCount = currentBackup?.fileCount;
			const word =
				typeof fileCount !== "undefined" && fileCount > 1
					? "files"
					: "file";

			if (hostname) {
				return hostname;
			} else {
				return `${fileCount ? fileCount : ""} ${
					fileCount ? word : ""
				} uploading`;
			}
		});

		const backupInProgress = computed(
			() => (backup?.historic[0]?.progress || 100) < 100
		);

		const folderName = computed(() => {
			const folder = backup.historic[0]?.name;

			if (!folder) {
				return "";
			}

			if (folder.length <= 55) {
				return folder;
			}

			const folders = folder.split("/");
			const lastFolder = folders.slice(-1)[0];

			if (typeof lastFolder === "undefined") {
				throw new Error("Unable to truncate folder name.");
			}

			if (lastFolder.length >= 51) {
				return `.../${lastFolder.substring(0, 50)}`;
			}

			const beginning = folder.substring(0, 50 - lastFolder.length);

			return `${beginning}.../${lastFolder}`;
		});

		const restore = () => {
			const regex = /\//g;
			router.push(`/app/restore/${backup.name.replace(regex, ".")}`);
		};

		const updateBackup = () =>
			emit("handleBackupUpdate", backup.historic[0]?.id);

		const createBackup = () => {
			store.dispatch("backup", {
				directories: [backup.name]
			});
		};

		const backupArrowOver = () => {
			backupTooltip.value = true;
		};

		const backupArrowLeave = () => {
			backupTooltip.value = false;
		};

		const restoreArrowOver = () => {
			restoreTooltip.value = true;
		};

		const restoreArrowLeave = () => {
			restoreTooltip.value = false;
		};

		return {
			backup,
			backupTooltip,
			restoreTooltip,
			backupMetadata,
			backupInProgress,
			folderName,
			restore,
			updateBackup,
			createBackup,
			backupArrowOver,
			backupArrowLeave,
			restoreArrowOver,
			restoreArrowLeave
		};
	}
});
</script>
