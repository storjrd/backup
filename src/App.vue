<template>
	<div>
		<img
			v-if="logoPath"
			class="absolute p-5 inset-0 h-auto w-1/3"
			src="@/assets/logo.svg"
		/>
		<router-view></router-view>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "App",
	computed: {
		logoPath(): boolean {
			const name: string = String(this.$route.name);
			return name === "Home" || name === "Backups";
		}
	}
});
</script>
