import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css';

// import VueResource from 'vue-resource';
// Vue.use(VueResource);

Vue.config.productionTip = false;

import store from './vuex/store';

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
});
