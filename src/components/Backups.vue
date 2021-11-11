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
	<div class="bg-world-map bg-contain bg-no-repeat h-full overflow-hidden">
		<div class="absolute top-0 right-0 mt-5 mr-5">
			<div class="flex space-x-3">
				<div
					class="
						bg-white
						rounded-full
						shadow-lg
						w-8
						h-8
						p-2
						cursor-pointer
					"
					v-on:click="goToSettingsPage"
				>
					<CogIcon class="text-gray-500" />
				</div>
				<div
					class="
						bg-white
						rounded-full
						shadow-lg
						w-8
						h-8
						p-2
						cursor-pointer
					"
					v-on:click="goToAccountPage"
				>
					<UserIcon class="text-gray-500" />
				</div>
			</div>
		</div>
		<div
			v-if="displayWelcomeScreen"
			class="flex h-screen justify-center items-center"
		>
			<div class="m-auto">
				<h1 class="text-2xl font-bold text-center mb-2">
					Welcome to Storj
				</h1>
				<p class="text-center">
					Backup your files to the decentralized cloud.
				</p>
				<p class="text-center mb-8">
					Choose a folder on your computer to get started.
				</p>
				<div class="flex justify-center">
					<button
						v-on:click="openModal"
						type="button"
						class="
							inline-flex
							items-center
							px-4
							py-2
							border border-transparent
							text-sm
							font-medium
							rounded-md
							shadow-sm
							text-white
							bg-storjBlue
							focus:outline-none focus:ring-2 focus:ring-offset-2
						"
					>
						<img
							class="-ml-1 mr-2 w-5 h-5"
							src="@/assets/whiteFolderIcon.svg"
						/>
						Create Backup
					</button>
				</div>
			</div>
		</div>
		<div v-if="displayBackups" class="flex h-screen">
			<div class="w-screen m-auto mt-20 h-screen">
				<div class="h-full overflow-hidden">
					<h1 class="px-7">Last activities</h1>
					<div
						class="max-h-60 overflow-auto space-y-2 pb-4 pt-2 px-7"
					>
						<div
							v-for="backup in backups"
							class="bg-white shadow-lg rounded-lg p-3"
						>
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
										class="
											w-5
											h-5
											fill-current
											text-black
											mr-2
										"
										src="@/assets/folderIcon.svg"
									/>
									<p class="text-lg">{{ backup.name }}</p>
								</div>
								<div class="self-center">
									<div class="flex space-x-1">
										<ExclamationCircleIcon
											class="
												w-5
												h-5
												font-bold
												text-gray-700
											"
										/>
										<XCircleIcon
											class="
												w-5
												h-5font-bold
												text-gray-700
											"
										/>
										<ArrowCircleUpIcon
											class="
												w-5
												h-5
												font-bold
												text-gray-700
											"
										/>
									</div>
								</div>
							</div>
							<div class="flex justify-between">
								<p class="text-left">
									{{ backupMetadata(backup) }}

									<br />

									<i>{{ backup.hostname }}</i>
								</p>
								<p
									class="
										text-storjBlue
										cursor-pointer
										hover:underline
										text-sm
									"
									v-on:click=""
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
					</div>
					<div class="flex justify-start ml-7 mt-4">
						<button
							v-on:click="openModal"
							type="button"
							class="
								inline-flex
								items-center
								px-4
								py-2
								border border-transparent
								text-sm
								font-medium
								rounded-md
								shadow-sm
								text-white
								bg-storjBlue
								focus:outline-none
								focus:ring-2
								focus:ring-offset-2
							"
						>
							<PlusCircleIcon
								class="w-5 h-5 mr-2 font-bold text-white"
							/>
							Add new job
						</button>
					</div>
				</div>
			</div>
			<div
				v-if="areFilesSyncing"
				class="absolute inset-x-0 bottom-0 border-t"
			>
				<div
					class="h-14 flex content-center items-center space-x-2 mx-5"
				>
					<img src="@/assets/syncIcon.png" class="w-8 h-8" />
					<p class="text-sm text-gray-800 font-bold">
						{{ syncingFilesDisplay }}
					</p>
				</div>
			</div>
		</div>
		<div v-if="modalOpen" class="unclickable">
			<my-backup-modal
				v-bind="modalOpen"
				v-on:closeModal="closeModal"
			></my-backup-modal>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import prettyBytes from "pretty-bytes";

import type { Snapshot, BackupStatusEvent, BackupSummaryEvent } from "@/types";
import MyBackupModal from "@/components/MyBackupModal.vue";

import {
	PlusCircleIcon,
	ExclamationCircleIcon,
	XCircleIcon,
	ArrowCircleUpIcon,
	CogIcon,
	UserIcon
} from "@heroicons/vue/outline";

import router from "@/router";
import { useStore } from "@/store";

interface IBackup {
	name: string;
	progress: number;
	// size: number;
	hostname: string;
}

const setupBackups = () => {
	const store = useStore();

	store.dispatch("getSnapshots");

	const snapshots = computed(
		() => store.state.snapshots as Snapshot[] | null
	);

	const backups = computed((): IBackup[] => {
		const arr: IBackup[] = [];

		if (store.getters.lastStatusEvent !== undefined) {
			arr.push({
				name: "",
				progress: store.getters.lastStatusEvent.percent_done * 100,
				hostname: ""
			});
		}

		if (snapshots.value !== null) {
			arr.push(
				...snapshots.value
					.map(
						(snapshot: Snapshot): IBackup => ({
							name: snapshot.paths.join(", "),
							progress: 100,
							hostname: snapshot.hostname
						})
					)
					.reverse()
			);
		}

		return arr as IBackup[];
	});

	const backupsExist = computed(
		() => snapshots.value !== null && snapshots.value.length > 0
	);

	const modalOpen = ref<boolean>(false);

	const areFilesSyncing = computed(() => store.getters.backupStarted);

	const displayBackups = computed(
		() =>
			areFilesSyncing.value ||
			snapshots.value === null ||
			backupsExist.value
	);

	const displayWelcomeScreen = computed(
		() => !displayBackups.value && !modalOpen.value
	);

	const syncingFilesDisplay = computed(() => {
		const event: BackupStatusEvent | undefined =
			store.getters.lastStatusEvent;

		if (event === undefined) {
			return 0;
		}

		console.log("syncingfilesdisplay", event);

		return `${event.files_done} / ${event.total_files}`;
	});

	const openModal = () => {
		modalOpen.value = true;
	};

	const closeModal = () => {
		modalOpen.value = false;
	};

	const backupMetadata = (backup: IBackup): string => {
		return `${backup.progress === 100 ? "Synced" : "Syncing"}`;
	};

	const goToSettingsPage = () => {
		router.push("/app/settings");
	};

	const goToAccountPage = () => {
		router.push("/app/account");
	};

	return {
		backups,
		backupsExist,
		displayBackups,

		modalOpen,
		displayWelcomeScreen,
		areFilesSyncing,
		syncingFilesDisplay,

		openModal,
		closeModal,
		backupMetadata,
		goToSettingsPage,
		goToAccountPage
	};
};

export default defineComponent({
	name: "Backups",
	components: {
		MyBackupModal,
		PlusCircleIcon,
		ExclamationCircleIcon,
		XCircleIcon,
		ArrowCircleUpIcon,
		CogIcon,
		UserIcon
	},
	setup: () => ({
		...setupBackups()
	})
});
</script>
