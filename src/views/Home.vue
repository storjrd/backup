<template>
	<div class="home bg-gray-400 h-screen p-2">
		<div class="grid grid-cols-2 bg-white rounded-lg w-3/4 h-3/4 m-auto overflow-hidden">
			<div>
				<div class="p-5">
					<img class="h-auto w-4/6" src="@/assets/logo.svg" />
				</div>
				<div class="mt-20 mr-10">
					<img src="@/assets/artifacts.svg" />
				</div>
			</div>
			<div class="mt-20">
				<div class="space-y-1 mb-4">
					<h1 class="font-bold text-lg">{{headerText}}</h1>
					<p class="text-sm">Or <span class="underline cursor-pointer" v-on:click="toggleView">{{subheadingText}} &#8594;</span></p>
				</div>
				<div class="space-y-5">
					<div class="mr-14">
						<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
						<div class="mt-1">
							<input v-model="email" type="email" name="email" id="email" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="you@example.com" />
						</div>
					</div>
					<div class="mr-14">
						<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
						<div class="mt-1">
							<input v-model="password" type="password" name="password" id="password" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="••••" />
						</div>
					</div>
					<button v-on:click="buttonClick" type="button" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-storjBlue focus:outline-none focus:ring-2 focus:ring-offset-2">
						{{buttonText}}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "Home",
	data: () => ({
		view: "SIGN_IN",
		email: "",
		password: ""
	}),
	computed: {
		signInView() {
			return this.view === "SIGN_IN";
		},

		signUpView() {
			return this.view === "SIGN_UP";
		},

		headerText() {
			if (this.signInView) {
				return "Create account";
			} else if (this.signUpView) {
				return "Sign in";
			}
		},

		subheadingText() {
			if (this.signInView) {
				return "sign in";
			} else if (this.signUpView) {
				return "create your account";
			}
		},

		buttonText() {
			if (this.signInView) {
				return "Create my account";
			} else if (this.signUpView) {
				return "Sign in";
			}
		}
	},
	methods: {
		toggleView() {
			if (this.signInView) {
				this.view = "SIGN_UP";
			} else if (this.signUpView) {
				this.view = "SIGN_IN";
			}
		},

		buttonClick() {
			console.log("Submitted");
		}
	}
});
</script>
