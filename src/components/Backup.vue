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
					<ArrowCircleDownIcon
						class="w-5 h-5 font-bold text-gray-700 cursor-pointer"
						v-on:click="restore"
					/>
					<ArrowCircleUpIcon
						class="w-5 h-5 font-bold text-gray-700 cursor-pointer"
						v-on:click="createBackup"
					/>
					<span class="group">
						<div
							class="
								hidden
								group-hover:flex
								text-sm text-gray-800
								absolute
								bg-gray-50
								rounded-lg
								border
								shadow
								p-2
								transform
								-translate-y-16 -translate-x-32
								w-40
							"
						>
							Restore this backup to your computer.
						</div>
						<ArrowCircleDownIcon
							class="
								w-5
								h-5
								font-bold
								text-gray-700
								cursor-pointer
							"
							v-on:click="restore"
						/>
					</span>
				</div>
			</div>
		</div>
		<div class="flex justify-between">
			<p class="text-left">
				{{ backupMetadata }}

				<br />

				<i>{{ backup.hostname }}</i>
			</p>
			<p
				class="text-storjBlue cursor-pointer hover:underline text-sm"
				v-on:click="updateBackup"
			>
				See details
			</p>
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
						width: `${backup.progress}%`
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
import { defineComponent, Ref, reactive, computed } from "vue";

import type { IBackup } from "@/types";
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
	backup: IBackup;
	backupMetadata: Ref<string>;
	restore: () => void;
	updateBackup: () => void;
	createBackup: () => void;
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

		const backup = reactive<IBackup>(props.backup);

		const backupMetadata = computed<string>(() =>
			backup.progress === 100 ? "Synced" : "Syncing"
		);

		const restore = () => {
			router.push(`/app/restore/${backup.id}`);
		};

		const updateBackup = () => emit("handleBackupUpdate", backup.id);

		const createBackup = () => {
			store.dispatch("backup", {
				directories: [backup.name]
			});
		};

		return {
			backup,
			backupMetadata,
			restore,
			updateBackup,
			createBackup
		};
	}
});
</script>
