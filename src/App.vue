<template>
	<div class="overflow-hidden h-screen">
		<img
			v-if="logoPath"
			class="absolute p-5 inset-0 h-auto w-1/3"
			src="@/assets/logo.svg"
		/>
		<router-view></router-view>
	</div>
</template>

<script lang="ts">
import { defineComponent, Ref, computed, reactive, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "./store";

interface Properties {
	logoPath: Ref<boolean>;
}

export default defineComponent({
	name: "App",
	setup: (): Properties => {
		const router = useRouter();
		const route = reactive(useRoute());
		const store = useStore();

		// if user becomes logged in, redirect
		const loginStatus = computed<boolean>(() => store.state.loginStatus);

		watch(loginStatus, () => {
			router.push(loginStatus.value ? "/app/backups" : "/");
		});

		const logoPath = computed<boolean>(() =>
			typeof route.name === "string" && ["Home", "Backups"].includes(route.name)
		);

		return {
			logoPath
		};
	}
});
</script>
