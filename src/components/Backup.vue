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
				<p class="text-lg">{{ backup.name }}</p>
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
				{{ backupMetadata }}

				<br />

				<i>{{ backup.historic[0].hostname }}</i>
			</p>
			<!-- <p
				class="text-storjBlue cursor-pointer hover:underline text-sm"
				v-on:click="updateBackup"
			>
				See details
			</p> -->
		</div>
		<div class="relative pt-1">
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

		const backupMetadata = computed<string>(() =>
			backup.historic[0]?.progress === 100 ? "Synced" : "Syncing"
		);

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
