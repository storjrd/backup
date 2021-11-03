<template>
	<div class="flex h-screen">
		<div class="m-auto bg-white rounded-lg shadow-lg z-50 h-3/4 w-3/4 p-7">
			<div class="">
				<div v-if="backupNameInputOpen">
					<div class="mb-2 flex space-x-2">
						<input type="text" name="backupName" id="backupName" v-model="temporaryBackupName" :class="backupNameInputClass" :placeholder="backupName" />
						<div
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
					<h1 class="text-left font-bold text-xl">{{ backupName }}</h1>
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
				<p class="mt-2 text-left">Select folder(s) to sync:</p>
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
									justify-start
									content-center
									items-center
								"
							>
								<img
									class="w-5 h-5 fill-current text-black mr-2"
									src="@/assets/folderIcon.svg"
								/>
								<p class="text-xl">{{ folder }}</p>
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
						<p class="text-left">{{ folderUploadMetaData(folder) }}</p>
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
						<p class="text-base">Folders to backup...</p>
					</div>
				</div>
				<div class="mt-3 flex justify-start">
					<input
						ref="folderInput"
						type="file"
						aria-roledescription="folder-upload"
						hidden
						webkitdirectory
						mozdirectory
						multiple
						v-on:change="upload"
					/>
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
							font-medium
							rounded-md
							text-gray-700
							bg-white
							hover:bg-gray-50
							focus:outline-none focus:ring-2 focus:ring-offset-2
						"
					>
						<img
							src="@/assets/addIcon.svg"
							class="w-5 h-5 mr-2 font-bold"
						/>
						Add folder
					</button>
				</div>
			</div>
			<div v-else>
				<p class="mt-2 text-left">Select how frequent you want Storj to sync folders:
				</p>
				<div class="w-1/2">
					<select id="location" name="location" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-storjBlue focus:border-storjBluesm:text-sm rounded-md" v-model=selectedFrequency>
						<option v-for="frequency in
						frequencyOptions">{{ frequency }}</option>
					</select>
				</div>
				<div class="flex justify-between mt-6">
					<p class="text-left">Create a passphrase to encrypt it:
					</p>
					<p class="text-sm text-gray-300">(optional)</p>
				</div>
				<div class="mt-1 h-24">
					<input type="text" name="passphrase" id="passphrase" class="shadow-sm focus:ring-storjBlue focus:border-storjBlue block w-full sm:text-sm border-gray-300 rounded-md placeholder-gray-300" placeholder="Ex: secureP4ssphrase678#" />
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
						font-medium
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
						font-medium
						rounded-md
						shadow-sm
						text-white
						bg-storjBlue
						focus:outline-none focus:ring-2 focus:ring-offset-2
					"
				>
					Next
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
						font-medium
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
import { defineComponent } from "vue";
import prettyBytes from "pretty-bytes";
import { CheckIcon, XIcon } from '@heroicons/vue/solid'

interface IMediaTypes {
	photosOrVideos: number;
	otherFiles: number;
}

interface IFolder {
	mediaTypes: IMediaTypes;
	displaySize: number;
	filesAlreadyAdded: {};
	absolutePath: string;
}

export default defineComponent({
	name: "Dashboard",
	props: ["modalOpen"],
	components: {
		CheckIcon,
		XIcon
	},
	data: () => ({
		backupName: "My Backup",
		temporaryBackupName: "My Backup",
		backupNameInputOpen: false,
		folders: {},
		view: "SELECT_FOLDER",
		frequencyOptions: [
			"Daily",
			"Weekly",
			"Bi-weekly",
			"Monthly",
			"Quarterly",
			"Yearly"
		],
		selectedFrequency: "Daily"
	}),
	computed: {
		foldersArr(): string[] {
			return Object.keys(this.folders);
		},

		foldersExist(): boolean {
			return this.foldersArr.length > 0;
		},

		selectFolderView(): boolean {
			return this.view === "SELECT_FOLDER";
		},

		frequencyView(): boolean {
			return this.view === "FREQUENCY";
		},

		nextEnabled(): boolean {
			return this.foldersExist || this.frequencyView;
		},

		validBackupName(): boolean {
			return this.temporaryBackupName.length > 0;
		},

		backupNameInputClass(): string {
			return this.validBackupName ? "shadow-sm focus:ring-storjBlue focus:border-storjBlue block sm:text-sm border-gray-300 rounded-md w-1/3" : "shadow-sm focus:ring-red-400 focus:border-red-400 ring-red-400 border-red-400 block sm:text-sm border-gray-300 rounded-md w-1/3";
		}
	},
	methods: {
		saveBackupNameChange(): void {
			if (this.temporaryBackupName.length > 0) {
				this.backupName = this.temporaryBackupName;
				this.cancelBackupNameChange();
			}
		},

		cancelBackupNameChange(): void {
			this.temporaryBackupName = this.backupName;
			this.backupNameInputOpen = false;
		},

		changeBackupName(name: string): void {
			this.backupNameInputOpen = true;
		},

		closeModal(): void {
			this.$emit("closeModal");
		},

		nextButton(): void {
			if (this.selectFolderView) {
				this.view = "FREQUENCY";
			} else {
				this.closeModal();
			}
		},

		addFolderButton(): void {
			const folderInputElement = this.$refs
				.folderInput as HTMLInputElement;
			folderInputElement.click();
		},

		upload(e: Event): void {
			const target = e.target as HTMLInputElement;
			const files = target.files as FileList;

			[...files].forEach((file: any) => {
				const relativePath: string = file.webkitRelativePath;

				// get the first directory from the current file
				const folderNameKey: string = relativePath.split("/")[0];

				// get the absolute path to the current file
				const path: string = file.path
					.split("/")
					.slice(0, -1)
					.join("/");

				// if the current directory is unique within the list of folders, add the new folder
				if (!(this.folders as any)[folderNameKey]) {
					const initialFolder: IFolder = {
						mediaTypes: {
							photosOrVideos: 0,
							otherFiles: 0
						},
						displaySize: 0,
						filesAlreadyAdded: {},
						absolutePath: path
					};

					(this.folders as any)[folderNameKey] = initialFolder;
				}

				const folder = (this.folders as any)[folderNameKey];

				// if the current file hasn't already been accounted for display
				if (!folder.filesAlreadyAdded[relativePath]) {
					folder.filesAlreadyAdded[relativePath] = true;

					// aggregate the data
					if (
						file.type.includes("image") ||
						file.type.includes("video")
					) {
						folder.mediaTypes.photosOrVideos += 1;
					} else {
						folder.mediaTypes.otherFiles += 1;
					}

					folder.displaySize += file.size;
				}
			});

			(e.target as any)["value"] = "";
		},

		folderUploadMetaData(folderName: string): string {
			const folder: IFolder = (this.folders as any)[folderName];
			const photosOrVideos: number = folder.mediaTypes.photosOrVideos;
			const otherFiles: number = folder.mediaTypes.otherFiles;

			return `${prettyBytes(folder.displaySize)} - ${photosOrVideos} ${
				photosOrVideos > 1 ? "photos or videos" : "photo or video"
			}, ${otherFiles} ${otherFiles > 1 ? "other files" : "other file"}`;
		},

		// finalUpload() {
		//   const target = e.target as HTMLInputElement;
		//   const files: FileList = (target.files as FileList);

		//   const items = e.dataTransfer
		// 		? e.dataTransfer.items
		// 		: e.target.files;
		// 	async function* traverse(item, path = "") {
		// 		if (item.isFile) {
		// 			const file = await new Promise(item.file.bind(item));
		// 			yield { path, file };
		// 		} else if (item instanceof File) {
		// 			yield { path: item.webkitRelativePath, file: item };
		// 		} else if (item.isDirectory) {
		// 			const dirReader = item.createReader();

		// 			const entries = await new Promise(
		// 				dirReader.readEntries.bind(dirReader)
		// 			);

		// 			for (const entry of entries) {
		// 				yield* traverse(entry, path + item.name + "/");
		// 			}
		// 		} else if (typeof item.length === "number") {
		// 			for (const i of item) {
		// 				yield* traverse(i);
		// 			}
		// 		} else {
		// 			throw new Error("Item is not directory or file");
		// 		}
		// 	}

		// 	const iterator =
		// 		items instanceof FileList
		// 			? [...items]
		// 			: [...items].map(
		// 					(item) =>
		// 						item.webkitGetAsEntry() || item.getAsEntry()
		// 			  );
		// 	const fileNames = state.files.map((file) => file.Key);

		// 	function getUniqueFileName(fileName) {
		// 		for (let count = 1; fileNames.includes(fileName); count++) {
		// 			if (count > 1) {
		// 				fileName = fileName.replace(
		// 					/\((\d+)\)(.*)/,
		// 					`(${count})$2`
		// 				);
		// 			} else {
		// 				fileName = fileName.replace(
		// 					/([^.]*)(.*)/,
		// 					`$1 (${count})$2`
		// 				);
		// 			}
		// 		}

		// 		return fileName;
		// 	}

		// 	for await (const { path, file } of traverse(iterator)) {
		// 		const directories = path.split("/");
		// 		const uniqueFirstDirectory = getUniqueFileName(directories[0]);
		// 		directories[0] = uniqueFirstDirectory;

		// 		let fileName = getUniqueFileName(
		// 			directories.join("/") + file.name
		// 		);

		// 		const params = {
		// 			Bucket: state.bucket,
		// 			Key: state.path + fileName,
		// 			Body: file
		// 		};

		// 		const upload = state.s3.upload(
		// 			{ ...params },
		// 			{ partSize: 64 * 1024 * 1024 }
		// 		);

		// 		upload.on("httpUploadProgress", (progress) => {
		// 			commit("setProgress", {
		// 				Key: params.Key,
		// 				progress: Math.round(
		// 					(progress.loaded / progress.total) * 100
		// 				)
		// 			});
		// 		});

		// 		commit("pushUpload", {
		// 			...params,
		// 			upload,
		// 			progress: 0
		// 		});

		// 		commit("addUploadToChain", async () => {
		// 			if (
		// 				state.uploading.findIndex(
		// 					(file) => file.Key === params.Key
		// 				) === -1
		// 			) {
		// 				// upload cancelled or removed
		// 				return -1;
		// 			}

		// 			try {
		// 				await upload.promise();
		// 			} catch (e) {
		// 				// An error is raised if the upload is aborted by the user
		// 				console.log(e);
		// 			}

		// 			await dispatch("list");

		// 			const uploadedFiles = state.files.filter(
		// 				(file) => file.type === "file"
		// 			);

		// 			if (uploadedFiles.length === 1) {
		// 				const [{ Key }] = uploadedFiles;

		// 				if (state.openModalOnFirstUpload === true) {
		// 					commit("openModal", params.Key);
		// 				}
		// 			}

		// 			commit("finishUpload", params.Key);
		// 		});
		// 	}
		// },

		deleteFolder(folderName: string): void {
			delete (this.folders as any)[folderName];
		},
	}
});
</script>
