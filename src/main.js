import Vue from "vue";
import App from "./App.vue";
import "./assets/icons/iconfont.css";
import "./assets/icons/iconfont.js";
import "./assets/message-box.scss";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { Message } from "element-ui";
Vue.prototype.message = Message;
Vue.config.productionTip = false;
Vue.use(ElementUI);
new Vue({
  render: (h) => h(App)
}).$mount("#app");
