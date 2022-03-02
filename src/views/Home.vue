<template>
	<div class="grid grid-cols-2 mt-9">
		<div class="mt-8 mr-10">
			<img
				class="absolute p-5 inset-0 h-auto w-20"
				src="@/assets/logo.png"
			/>
			<img class="w-auto h-auto mt-10" src="@/assets/artifacts.svg" />
		</div>
		<div>
			<div class="space-y-1 mb-4">
				<h1 class="text-lg font-inter-bold">{{ headerText }}</h1>
				<p class="text-sm font-inter">
					Or
					<!-- <span
						class="underline cursor-pointer"
						v-on:click="toggleView"
						>{{ subheadingText }} &#8594;</span
					> -->
					<span
						class="underline cursor-pointer"
						v-on:click="openHomepage"
						>{{ subheadingText }} &#8594;</span
					>
				</p>
			</div>
			<div class="space-y-3 max-w-lg mr-14 mb-2">
				<!-- <div>
					<label
						for="accessKey"
						class="block text-sm font-medium text-gray-700"
						>Access Key</label
					>
					<div class="mt-1">
						<input
							v-model="accessKey"
							type="text"
							name="accessKey"
							id="accessKey"
							class="
								shadow-sm
								focus:ring-indigo-500 focus:border-indigo-500
								block
								w-full
								sm:text-sm
								border-gray-300
								rounded-md
							"
							placeholder=""
						/>
					</div>
				</div>
				<div>
					<label
						for="secretKey"
						class="block text-sm font-medium text-gray-700"
						>Secret Key</label
					>
					<div class="mt-1">
						<input
							v-model="secretKey"
							type="text"
							name="secretKey"
							id="secretKey"
							class="
								shadow-sm
								focus:ring-indigo-500 focus:border-indigo-500
								block
								w-full
								sm:text-sm
								border-gray-300
								rounded-md
							"
							placeholder=""
						/>
					</div>
				</div>
				<div>
					<label
						for="endpoint"
						class="block text-sm font-medium text-gray-700"
						>Endpoint</label
					>
					<div class="mt-1">
						<input
							v-model="endpoint"
							type="text"
							name="endpoint"
							id="endpoint"
							class="
								shadow-sm
								focus:ring-indigo-500 focus:border-indigo-500
								block
								w-full
								sm:text-sm
								border-gray-300
								rounded-md
							"
							placeholder=""
						/>
					</div>
				</div>
				<div>
					<label
						for="bucket"
						class="block text-sm font-medium text-gray-700"
						>Bucket</label
					>
					<div class="mt-1">
						<input
							v-model="bucket"
							type="text"
							name="bucket"
							id="bucket"
							class="
								shadow-sm
								focus:ring-indigo-500 focus:border-indigo-500
								block
								w-full
								sm:text-sm
								border-gray-300
								rounded-md
							"
							placeholder=""
						/>
					</div>
				</div> -->
				<div class="isolate -space-y-px rounded-md shadow-sm">
					<div
						class="
							relative
							border border-gray-300
							rounded-md rounded-b-none
							px-3
							py-2
							focus-within:z-10
							focus-within:ring-1
							focus-within:ring-storjBlue
							focus-within:border-storjBlue
						"
					>
						<label
							for="accessKey"
							class="
								block
								text-xs
								font-inter-medium
								text-gray-700
							"
							>Access Key</label
						>
						<input
							v-model="accessKey"
							type="text"
							name="accessKey"
							id="accessKey"
							class="
								block
								w-full
								border-0
								p-0
								text-gray-900
								placeholder-gray-400
								focus:ring-0
								sm:text-sm
							"
							placeholder="iahsf8493hyhf9ahofj93"
						/>
					</div>
					<div
						class="
							relative
							border border-gray-300
							rounded-md rounded-t-none rounded-b-none
							px-3
							py-2
							focus-within:z-10
							focus-within:ring-1
							focus-within:ring-storjBlue
							focus-within:border-storjBlue
						"
					>
						<label
							for="secretKey"
							class="
								block
								w-full
								text-xs
								font-inter-medium
								text-gray-700
							"
							>Secret Key</label
						>
						<input
							v-model="secretKey"
							type="text"
							name="secretKey"
							id="secretKey"
							class="
								block
								w-full
								border-0
								p-0
								text-gray-900
								placeholder-gray-400
								focus:ring-0
								sm:text-sm
							"
							placeholder="kajwro83h49hqfjoij93q"
						/>
					</div>
					<div
						class="
							relative
							border border-gray-300
							rounded-md rounded-t-none rounded-b-none
							px-3
							py-2
							focus-within:z-10
							focus-within:ring-1
							focus-within:ring-storjBlue
							focus-within:border-storjBlue
						"
					>
						<label
							for="endpoint"
							class="
								block
								w-full
								text-xs
								font-inter-medium
								text-gray-700
							"
							>Endpoint</label
						>
						<input
							v-model="endpoint"
							type="text"
							name="endpoint"
							id="endpoint"
							class="
								block
								w-full
								border-0
								p-0
								text-gray-900
								placeholder-gray-400
								focus:ring-0
								sm:text-sm
							"
							placeholder="https://gateway.us1.storjshare.io"
						/>
					</div>
					<div
						class="
							relative
							border border-gray-300
							rounded-md rounded-t-none rounded-b-none
							px-3
							py-2
							focus-within:z-10
							focus-within:ring-1
							focus-within:ring-storjBlue
							focus-within:border-storjBlue
						"
					>
						<label
							for="bucket"
							class="
								block
								w-full
								text-xs
								font-inter-medium
								text-gray-700
							"
							>Bucket</label
						>
						<input
							v-model="bucket"
							type="text"
							name="bucket"
							id="bucket"
							class="
								block
								w-full
								border-0
								p-0
								text-gray-900
								placeholder-gray-400
								focus:ring-0
								sm:text-sm
							"
							placeholder="my-bucket"
						/>
					</div>
					<div
						class="
							relative
							border border-gray-300
							rounded-md rounded-t-none
							px-3
							py-2
							focus-within:z-10
							focus-within:ring-1
							focus-within:ring-storjBlue
							focus-within:border-storjBlue
						"
					>
						<label
							for="resticPassword"
							class="
								block
								w-full
								text-xs
								font-inter-medium
								text-gray-700
							"
							>Restic Password</label
						>
						<input
							v-model="resticPassword"
							type="password"
							name="resticPassword"
							id="resticPassword"
							class="
								block
								w-full
								border-0
								p-0
								text-gray-900
								placeholder-gray-400
								focus:ring-0
								sm:text-sm
							"
							placeholder="••••••••••••"
						/>
					</div>
				</div>
				<div class="flex">
					<button
						v-on:click="openGetStarted"
						type="button"
						class="
							mr-3
							inline-flex
							items-center
							justify-center
							px-4
							py-2
							border border-gray-300
							text-sm
							font-inter-medium
							rounded-md
							shadow-sm
							text-gray-700
							bg-white
							focus:outline-none focus:ring-2 focus:ring-offset-2
						"
					>
						How to Get Started
					</button>
					<button
						v-on:click="login"
						v-bind:disabled="isLoading"
						type="button"
						class="
							flex-1 flex
							items-center
							justify-center
							px-4
							py-2
							border border-transparent
							text-sm
							font-inter-medium
							rounded-md
							shadow-sm
							text-white
							bg-storjBlue
							focus:outline-none focus:ring-2 focus:ring-offset-2
						"
					>
						{{ buttonText }}

						<div
							v-if="isLoading"
							class="flex justify-center items-center"
						>
							<div
								class="
									animate-spin
									rounded-full
									h-2
									w-2
									border-b-2 border-green
									ml-3
								"
							></div>
						</div>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { useStore } from "@/store";

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

	const openHomepage = () => {
		store.dispatch("openSignup");
	};

	const openGetStarted = () => {
		store.dispatch("openGetStarted");
	};

	return {
		signInView,
		signUpView,
		headerText,
		subheadingText,
		buttonText,
		toggleView,
		openHomepage,
		openGetStarted
	};
};

const setupLogin = () => {
	const store = useStore();

	const accessKey = ref<string>("");
	const secretKey = ref<string>("");
	const endpoint = ref<string>("");
	const bucket = ref<string>("");
	const resticPassword = ref<string>("");

	const isLoading = ref<boolean>(false);

	const login = async () => {
		if (isLoading.value === true) {
			return;
		}

		isLoading.value = true;

		const response = await store.dispatch("login", {
			accessKey: accessKey.value,
			secretKey: secretKey.value,
			endpoint: endpoint.value,
			bucket: bucket.value,
			resticPassword: resticPassword.value
		});

		isLoading.value = false;

		if (response.success === false) {
			window.alert(response.error);
		}
	};

	return {
		accessKey,
		secretKey,
		endpoint,
		bucket,
		resticPassword,
		isLoading,
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
