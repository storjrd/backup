<template>
	<div class="flex h-screen">
		<div class="m-auto bg-white rounded-lg shadow-lg z-50 h-3/4 w-3/4 p-7">
			<div class="">
				<div v-if="backupNameInputOpen">
					<div class="mb-2 flex space-x-2">
						<input
							type="text"
							name="backupName"
							id="backupName"
							v-model="temporaryBackupName"
							:class="backupNameInputClass"
							:placeholder="backupName"
						/>
						<div
							v-if="validBackupName"
							v-on:click="saveBackupNameChange"
							class="
								bg-green-100
								p-1
								rounded-full
								w-5
								h-5
								flex
								self-center
								cursor-pointer
							"
						>
							<CheckIcon class="w-3 h-3 text-green-700" />
						</div>
						<div
							v-else
							v-on:click="saveBackupNameChange"
							class="
								bg-gray-100
								p-1
								rounded-full
								w-5
								h-5
								flex
								self-center
								cursor-pointer
							"
						>
							<CheckIcon class="w-3 h-3 text-gray-700" />
						</div>
						<div
							v-on:click="cancelBackupNameChange"
							class="
								bg-red-100
								p-1
								rounded-full
								w-5
								h-5
								flex
								self-center
								cursor-pointer
							"
						>
							<XIcon class="w-3 h-3 text-red-700" />
						</div>
					</div>
				</div>
				<div v-else class="flex space-x-2">
					<h1 class="text-left font-inter-bold text-xl">
						{{ backupName }}
					</h1>
					<div
						v-on:click="changeBackupName"
						class="
							bg-gray-100
							p-1
							rounded-full
							w-5
							h-5
							flex
							self-center
							cursor-pointer
						"
					>
						<img src="@/assets/editIcon.svg" class="w-3 h-3" />
					</div>
				</div>
			</div>
			<div v-if="selectFolderView" class="h-3/4">
				<p class="mt-2 text-left">Select folder to sync:</p>
				<div class="h-2/5 w-auto overflow-scroll mt-1 space-y-2">
					<div
						v-if="foldersExist"
						v-for="folder in foldersArr"
						class="bg-gray-50 border border-gray-200 rounded-lg p-3"
					>
						<div class="flex justify-between">
							<div
								class="
									flex
									justify-center
									content-center
									items-center
									break-words
								"
							>
								<img
									class="w-5 h-5 fill-current text-black mr-2"
									src="@/assets/folderIcon.svg"
								/>
								<p class="text-lg">{{ folderName(folder) }}</p>
							</div>
							<p
								class="
									text-storjBlue
									cursor-pointer
									hover:underline
								"
								v-on:click="deleteFolder(folder)"
							>
								Delete
							</p>
						</div>
						<p class="text-left">
							{{ folderUploadMetaData(folder) }}
						</p>
					</div>
					<div
						v-if="!foldersExist"
						class="
							bg-gray-50
							border border-gray-200
							rounded-lg
							p-3
							flex
							justify-start
							content-center
							h-full
							w-auto
						"
					>
						<p class="text-base">Folder to backup...</p>
					</div>
				</div>
				<div class="mt-3 flex justify-start">
					<button
						v-on:click="addFolderButton"
						type="button"
						class="
							inline-flex
							items-center
							px-3
							py-2
							border border-gray-300
							shadow-sm
							text-sm
							leading-4
							font-inter-medium
							rounded-md
							text-gray-700
							bg-white
							hover:bg-gray-50
							focus:outline-none focus:ring-2 focus:ring-offset-2
						"
					>
						<PlusCircleIcon
							class="w-5 h-5 mr-2 font-inter-bold text-gray-500"
						/>
						Add folder
					</button>
				</div>
			</div>
			<div v-else>
				<p class="mt-2 text-left">
					Select how frequent you want Storj to sync folders:
				</p>
				<div class="w-1/2">
					<select
						id="location"
						name="location"
						class="
							mt-1
							block
							w-full
							pl-3
							pr-10
							py-2
							text-base
							border-gray-300
							focus:outline-none
							focus:ring-storjBlue
							focus:border-storjBluesm:text-sm
							rounded-md
						"
						v-model="selectedFrequency"
					>
						<option v-for="frequency in frequencyOptions">
							{{ frequency }}
						</option>
					</select>
				</div>
			</div>
			<div class="flex justify-start space-x-2 mt-2">
				<button
					v-on:click="closeModal"
					type="button"
					class="
						space-x-2
						inline-flex
						items-center
						px-3
						py-2
						border border-gray-300
						shadow-sm
						text-sm
						leading-4
						font-inter-medium
						rounded-md
						text-gray-700
						bg-white
						hover:bg-gray-50
						focus:outline-none focus:ring-2 focus:ring-offset-2
					"
				>
					Cancel
				</button>
				<button
					v-if="nextEnabled"
					v-on:click="nextButton"
					type="button"
					class="
						inline-flex
						items-center
						px-3
						py-2
						border border-transparent
						text-sm
						leading-4
						font-inter-medium
						rounded-md
						shadow-sm
						text-white
						bg-storjBlue
						focus:outline-none focus:ring-2 focus:ring-offset-2
					"
				>
					{{ nextButtonText }}
				</button>
				<button
					v-else
					type="button"
					class="
						inline-flex
						items-center
						px-3
						py-2
						border border-transparent
						text-sm
						leading-4
						font-inter-medium
						rounded-md
						shadow-sm
						text-white
						bg-blue-200
						cursor-not-allowed
						focus:outline-none
					"
				>
					Next
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	defineComponent,
	ref,
	reactive,
	Ref,
	computed,
	ComputedRef
} from "vue";

import prettyBytes from "pretty-bytes";
import { CheckIcon, XIcon } from "@heroicons/vue/solid";
import { PlusCircleIcon } from "@heroicons/vue/outline";

import { useStore } from "@/store";
import type { ModalConfig } from "@/types";

interface IMediaTypes {
	photosOrVideos: number;
	otherFiles: number;
}

interface IFolder {
	absolutePath: string;
	fileCount: number;
}

interface Properties {
	frequencyOptions: Array<string>;
	backupName: Ref<string>;
	temporaryBackupName: Ref<string>;
	backupNameInputOpen: Ref<boolean>;
	selectedFrequency: Ref<string>;

	foldersArr: ComputedRef<string[]>;
	foldersExist: ComputedRef<boolean>;
	selectFolderView: ComputedRef<boolean>;
	frequencyView: ComputedRef<boolean>;
	nextEnabled: ComputedRef<boolean>;
	validBackupName: ComputedRef<boolean>;
	backupNameInputClass: ComputedRef<string>;
	nextButtonText: ComputedRef<string>;

	folderName: (arg0: string) => string;
	cancelBackupNameChange: () => void;
	saveBackupNameChange: () => void;
	changeBackupName: (arg0: string) => void;
	closeModal: () => void;
	nextButton: () => void;
	addFolderButton: () => void;
	folderUploadMetaData: (arg0: string) => void;
	deleteFolder: (arg0: string) => void;
}

export default defineComponent({
	name: "Dashboard",
	props: ["modalConfig"],
	components: {
		CheckIcon,
		XIcon,
		PlusCircleIcon
	},
	setup: (props, { emit }): Properties => {
		const frequencyOptions = [
			"Daily",
			"Weekly",
			"Bi-weekly",
			"Monthly",
			"Quarterly",
			"Yearly"
		];

		const folders = reactive<{ [key: string]: IFolder }>({});
		const modalConfig = reactive<ModalConfig>(props.modalConfig);

		const backupName = ref("My Backup");
		const temporaryBackupName = ref("My Backup");
		const backupNameInputOpen = ref(false);
		const view = ref(props.modalConfig.view);
		const selectedFrequency = ref("Daily");

		const foldersArr = computed(() => Object.keys(folders));
		const foldersExist = computed(() => foldersArr.value.length > 0);
		const selectFolderView = computed(() => view.value === "SELECT_FOLDER");
		const frequencyView = computed(() => view.value === "FREQUENCY");

		const nextEnabled = computed(
			() => foldersExist.value || frequencyView.value
		);

		const validBackupName = computed(
			() => temporaryBackupName.value.trim().length > 0
		);

		const backupNameInputClass = computed(() =>
			validBackupName
				? ` shadow-sm
					focus:ring-storjBlue
					focus:border-storjBlue
					block sm:text-sm
					border-gray-300
					rounded-md
					w-1/3
				`
				: `	shadow-sm
					focus:ring-red-400
					focus:border-red-400
					ring-red-400
					border-red-400
					block sm:text-sm
					border-gray-300
					rounded-md
					w-1/3
				`
		);

		const nextButtonText = computed(() =>
			selectFolderView.value === true ? "Next" : "Done"
		);

		const folderName = (folder: string) => {
			if (folder.length <= 42) {
				return folder;
			}

			const folders = folder.split("/");
			const lastFolder = folders.slice(-1)[0];

			if (typeof lastFolder === "undefined") {
				throw new Error("Unable to truncate folder name.");
			}

			if (lastFolder.length >= 38) {
				return `.../${lastFolder.substring(0, 37)}`;
			}

			const beginning = folder.substring(0, 37 - lastFolder.length);

			return `${beginning}.../${lastFolder}`;
		};

		const cancelBackupNameChange = () => {
			temporaryBackupName.value = backupName.value;
			backupNameInputOpen.value = false;
		};

		const saveBackupNameChange = () => {
			if (validBackupName.value) {
				backupName.value = temporaryBackupName.value.trim();
				cancelBackupNameChange();
			}
		};

		const changeBackupName = (name: string) => {
			backupNameInputOpen.value = true;
		};

		const closeModal = () => {
			emit("closeModal");
		};

		const store = useStore();

		const nextButton = () => {
			if (selectFolderView.value === true) {
				view.value = "FREQUENCY";
			} else {
				if (modalConfig.backupId) {
					// this is a backup job update and not a new folder backup.
				} else {
					store.dispatch("backup", {
						directories: Object.values(folders).map(
							(folder: IFolder) => folder.absolutePath
						)
					});
				}

				closeModal();
			}
		};

		const addFolderButton = async () => {
			const response: {
				canceled: boolean;
				filePaths: string[];
			} = await store.dispatch("getDirectory");

			// Replace the first folder for backup with the newly selected one if attempting to add more than one folder for backup.
			const [key] = Object.keys(folders);

			if (typeof key === "string") {
				delete folders[key];
			}

			const path = response.filePaths[0];

			if (typeof path === "string") {
				const { count } = await store.dispatch("getFileCount", {
					path
				});

				folders[path] = {
					absolutePath: path,
					fileCount: count
				};
			}
		};

		const folderUploadMetaData = (folderName: string) => {
			const folder = folders[folderName] as unknown as IFolder;
			const fileCount = folder.fileCount;
			return `${fileCount} ${fileCount > 1 ? "files" : "file"}`;
		};

		const deleteFolder = (folderName: string) => {
			delete folders[folderName];
		};

		return {
			frequencyOptions,
			backupName,
			temporaryBackupName,
			backupNameInputOpen,
			selectedFrequency,

			foldersArr,
			foldersExist,
			selectFolderView,
			frequencyView,
			nextEnabled,
			validBackupName,
			backupNameInputClass,
			nextButtonText,

			folderName,
			cancelBackupNameChange,
			saveBackupNameChange,
			changeBackupName,
			closeModal,
			nextButton,
			addFolderButton,
			folderUploadMetaData,
			deleteFolder
		};
	}
});
</script>
