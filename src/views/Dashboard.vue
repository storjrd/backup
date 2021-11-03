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
	<!-- <img class="bg-cover absolute z-0" src="@/assets/worldMap.svg" /> -->
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
					<img src="@/assets/settingsIcon.svg" />
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
					<img src="@/assets/accountIcon.svg" />
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
		<div v-if="displayBackups"></div>
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

export default defineComponent({
	name: "Dashboard",
	components: {
		MyBackupModal
	},
	data: () => ({
		modalOpen: false
	}),
	computed: {
		// where we would check if the user has created any backups
		noBackups(): boolean {
			return true;
		},

		displayWelcomeScreen(): boolean {
			return this.noBackups && !this.modalOpen;
		},

		displayBackups(): boolean {
			return !this.noBackups && !this.modalOpen;
		}
	},
	methods: {
		openModal(): void {
			this.modalOpen = true;
		},

		closeModal(): void {
			this.modalOpen = false;
		}
	}
});
</script>
