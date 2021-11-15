<template>
	<div class="grid grid-cols-2 mt-20">
		<div class="mt-8 mr-10">
			<img class="w-auto h-auto" src="@/assets/artifacts.svg" />
		</div>
		<div>
			<div class="space-y-1 mb-4">
				<h1 class="font-bold text-lg">{{ headerText }}</h1>
				<p class="text-sm">
					Or
					<span
						class="underline cursor-pointer"
						v-on:click="toggleView"
						>{{ subheadingText }} &#8594;</span
					>
				</p>
			</div>
			<div class="space-y-5 max-w-lg mr-14">
				<div>
					<label
						for="email"
						class="block text-sm font-medium text-gray-700"
						>Email</label
					>
					<div class="mt-1">
						<input
							v-model="email"
							type="email"
							name="email"
							id="email"
							class="
								shadow-sm
								focus:ring-indigo-500 focus:border-indigo-500
								block
								w-full
								sm:text-sm
								border-gray-300
								rounded-md
							"
							placeholder="you@example.com"
						/>
					</div>
				</div>
				<div>
					<label
						for="password"
						class="block text-sm font-medium text-gray-700"
						>Password</label
					>
					<div class="mt-1">
						<input
							v-model="password"
							type="password"
							name="password"
							id="password"
							class="
								shadow-sm
								focus:ring-indigo-500 focus:border-indigo-500
								block
								w-full
								sm:text-sm
								border-gray-300
								rounded-md
							"
							placeholder="••••"
						/>
					</div>
				</div>
				<button
					v-on:click="login"
					type="button"
					class="
						inline-flex
						items-center
						justify-center
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
					{{ buttonText }}
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";

const setupViews = () => {
	const store = useStore();

	const signInView = ref<boolean>(true);

	const signUpView = computed(() => !signInView.value);

	const headerText = computed(() =>
		signInView.value ? "Sign in" : "Create account"
	);

	const subheadingText = computed(() =>
		signInView.value ? "create your account" : "sign in"
	);

	const buttonText = computed(() =>
		signInView.value ? "Sign in" : "Create my account"
	);

	const toggleView = () => {
		signInView.value = !signInView.value;
	};

	return {
		signInView,
		signUpView,
		headerText,
		subheadingText,
		buttonText,
		toggleView
	};
};

const setupLogin = () => {
	const store = useStore();
	const router = useRouter();

	const email = ref<string>("");
	const password = ref<string>("");

	const login = async () => {
		await store.dispatch("login", {
			email: email.value,
			password: password.value
		});

		router.push("/app/backups");
	};

	return {
		email,
		password,
		login
	};
};

export default defineComponent({
	name: "Home",

	setup: () => ({
		...setupViews(),
		...setupLogin()
	})
});
</script>
