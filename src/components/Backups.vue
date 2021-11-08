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
	<div class="bg-world-map bg-contain bg-no-repeat h-screen">
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
				>
					<CogIcon
						v-on:click="goToSettingsPage"
						class="text-gray-500"
					/>
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
				>
					<UserIcon
						v-on:click="goToAccountPage"
						class="text-gray-500"
					/>
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
				<div class="h-full">
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
			<!-- <div class="relative h-32 w-32"> -->
			<div
				v-if="areFilesSyncing"
				class="absolute inset-x-0 bottom-0 h-14 border"
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
			<!-- </div> -->
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
import { defineComponent } from "vue";
import MyBackupModal from "../components/MyBackupModal.vue";
import prettyBytes from "pretty-bytes";
import {
	PlusCircleIcon,
	ExclamationCircleIcon,
	XCircleIcon,
	ArrowCircleUpIcon,
	CogIcon,
	UserIcon
} from "@heroicons/vue/outline";

interface IBackup {
	name: string;
	progress: number;
	// size: number;
	hostname: string;
}

interface Snapshot {
	hostname: string;
	time: string;
	paths: string[];
}

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
	data: () => ({
		modalOpen: false
	}),
	computed: {
		// snapshots from restic
		snapshots(): Snapshot[] {
			// @ts-ignore
			const snapshots = this.$store.state.snapshots;

			return snapshots as Snapshot[];
		},

		// retrieve the backups from the store
		backups(): IBackup[] {
			return this.snapshots.map(
				(snapshot: Snapshot): IBackup => ({
					name: snapshot.paths.join(", "),
					progress: 100,
					hostname: snapshot.hostname
				})
			);
		},

		// where we would check if the user has created any backups
		backupsExist(): boolean {
			return this.backups.length > 0;
		},

		displayWelcomeScreen(): boolean {
			return !this.backupsExist && !this.modalOpen;
		},

		displayBackups(): boolean {
			return this.backupsExist && !this.modalOpen;
		},

		// check if files are syncing from store
		areFilesSyncing(): boolean {
			return true;
		},

		// get all files that are syncing from store
		syncingFilesDisplay(): string {
			const files: number = 239;
			return `Syncing ${files} ${files > 1 ? "files" : "file"}`;
		}
	},
	methods: {
		openModal(): void {
			this.modalOpen = true;
		},

		closeModal(): void {
			this.modalOpen = false;
		},

		backupMetadata(backup: IBackup): string {
			return `${backup.progress === 100 ? "Synced" : "Syncing"}`;
		},

		goToSettingsPage(): void {
			this.$router.push("/app/settings");
		},

		goToAccountPage(): void {
			this.$router.push("/app/account");
		}
	}
});
</script>
