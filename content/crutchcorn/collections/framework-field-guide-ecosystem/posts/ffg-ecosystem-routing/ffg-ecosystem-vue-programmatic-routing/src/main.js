import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";
import App from "./App.vue";
import Home from "./Home.vue";
import Other from "./Other.vue";

const routes = [
	{ path: "/", component: Home },
	{ path: "/other", component: Other },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

createApp(App).use(router).mount("#app");
