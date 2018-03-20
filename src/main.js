import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import routes from "./routes";
import VueResource from "vue-resource";
import VueLocalStorage from "vue-ls";
import store from "./store.js";
import VueFlashMessage from 'vue-flash-message';
require('vue-flash-message/dist/vue-flash-message.min.css');
Vue.use(VueFlashMessage, {
  messageOptions: {
    timeout: 3000
  }
});
Vue.use(VueResource);
//Vue.http.options.root = 'http://localhost:3000/api';
Vue.http.options.root = 'http://www.yvdesign.de:3000/api';
Vue.use(VueRouter);
Vue.use(VueLocalStorage);

const router = new VueRouter({
  mode:'history',
  routes
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
