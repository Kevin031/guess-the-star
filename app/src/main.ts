import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import vant from "vant";
import { Lazyload } from "vant";
import "vant/lib/index.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vant);
app.use(Lazyload);
app.mount("#app");
