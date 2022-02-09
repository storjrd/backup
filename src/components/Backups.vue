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

		<div v-if="isLoading" class="flex h-screen justify-center items-center">
			<div class="flex justify-center items-center">
				<div
					class="
						animate-spin
						rounded-full
						h-32
						w-32
						border-b-2 border-gray-900
					"
				></div>
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
						class="
							max-h-60
							overflow-auto
							space-y-2
							pb-4
							pt-2
							px-7
							scrollbar-thin
							scrollbar-thumb-gray-300
							scrollbar-track-gray-100
							scrollbar-thumb-rounded-full
							scrollbar-track-rounded-full
							mr-2
						"
					>
						<backup-component
							v-for="backup in backups"
							v-bind:backup="backup"
							@handleBackupUpdate="handleBackupUpdate"
							:key="backup.name"
						></backup-component>
					</div>
				</div>
			</div>
			<div class="absolute inset-x-0 bottom-0 border-t">
				<div
					class="
						h-14
						flex
						items-center
						space-x-2
						mx-5
						justify-between
					"
				>
					<span class="flex items-center">
						<span class="group mr-1">
							<div
								class="
									hidden
									group-hover:flex
									text-sm text-gray-800
									absolute
									bg-gray-50
									rounded-lg
									border border-gray-200
									shadow
									p-2
									transform
									-translate-y-10
									w-40
								"
							>
								Total files backed up.
							</div>
							<img src="@/assets/syncIcon.png" class="w-8 h-8" />
						</span>
						<p class="text-sm text-gray-800 font-bold">
							{{ syncingFilesDisplay }}
						</p>
					</span>
					<button
						v-on:click="openModal"
						type="button"
						class="
							inline-flex
							items-center
							h-9
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
						<PlusCircleIcon
							class="w-5 h-5 mr-2 font-bold text-white"
						/>
						Add new job
					</button>
				</div>
			</div>
		</div>
		<div v-if="modalOpen" class="unclickable">
			<my-backup-modal
				v-bind:modalOpen="modalOpen"
				v-bind:modalConfig="modalConfig"
				v-on:closeModal="closeModal"
			></my-backup-modal>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from "vue";
import prettyBytes from "pretty-bytes";

import type {
	Snapshot,
	Backup,
	BackupStatusEvent,
	BackupSummaryEvent,
	ModalConfig
} from "@/types";
import MyBackupModal from "@/components/MyBackupModal.vue";
import BackupComponent from "@/components/Backup.vue";

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

interface Properties {
	backups: Ref<Backup[]>;

	isLoading: Ref<boolean>;
	backupsExist: Ref<boolean>;
	displayBackups: Ref<boolean>;
	modalOpen: Ref<boolean>;
	modalConfig: Ref<ModalConfig>;
	displayWelcomeScreen: Ref<boolean>;
	areFilesSyncing: Ref<boolean>;
	syncingFilesDisplay: Ref<string>;

	openModal: () => void;
	closeModal: () => void;
	handleBackupUpdate: (backupName: string) => void;
	goToSettingsPage: () => void;
	goToAccountPage: () => void;
}

const setupBackups = (): Properties => {
	const store = useStore();

	store.dispatch("getSnapshots");

	const snapshots = computed<Snapshot[]>(() =>
		store.state.snapshots === null ? [] : store.state.snapshots
	);

	const backups = computed<Backup[]>((): Backup[] => store.getters.backups);

	const isLoading = computed(() => store.state.snapshots === null);

	const backupsExist = computed(
		() => !isLoading.value && snapshots.value.length > 0
	);

	const modalOpen = ref(false);

	const modalConfig = ref({
		backupId: "",
		view: "SELECT_FOLDER"
	});

	const areFilesSyncing = computed(() => store.getters.backupStarted);

	const displayBackups = computed(
		() => areFilesSyncing.value || backupsExist.value
	);

	const displayWelcomeScreen = computed(
		() => !isLoading.value && !displayBackups.value && !modalOpen.value
	);

	const syncingFilesDisplay = computed(() => {
		const event: BackupStatusEvent | undefined =
			store.getters.lastStatusEvent;

		if (event === undefined) {
			return "Synced";
		}

		console.log("syncingfilesdisplay", event);

		return `${event.files_done} / ${event.total_files}`;
	});

	const openModal = () => {
		modalOpen.value = true;
	};

	const closeModal = () => {
		modalOpen.value = false;
		resetModalConfig();
	};

	const resetModalConfig = () => {
		modalConfig.value = {
			backupId: "",
			view: "SELECT_FOLDER"
		};
	};

	const handleBackupUpdate = (backupId: string) => {
		modalOpen.value = true;
		modalConfig.value = {
			backupId,
			view: "FREQUENCY"
		};
	};

	const goToSettingsPage = () => {
		router.push("/app/settings");
	};

	const goToAccountPage = () => {
		router.push("/app/account");
	};

	return {
		isLoading,
		backups,
		backupsExist,
		displayBackups,

		modalOpen,
		modalConfig,
		displayWelcomeScreen,
		areFilesSyncing,
		syncingFilesDisplay,

		openModal,
		closeModal,
		handleBackupUpdate,
		goToSettingsPage,
		goToAccountPage
	};
};

export default defineComponent({
	name: "Backups",
	components: {
		MyBackupModal,
		BackupComponent,

		PlusCircleIcon,
		ExclamationCircleIcon,
		XCircleIcon,
		ArrowCircleUpIcon,
		CogIcon,
		UserIcon
	},
	setup: (): Properties => ({
		...setupBackups()
	})
});
</script>
