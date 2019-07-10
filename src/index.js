import './css/index.scss';

import 'bootstrap'; // js
import BootstrapVue from 'bootstrap-vue';

import Vue from 'vue';
import App from './App.vue';
import AsyncComputed from 'vue-async-computed';
import Element from 'element-ui';

Vue.config.productionTip = false;
Vue.use(AsyncComputed);
Vue.use(BootstrapVue);
Vue.use(Element);

new Vue({
    el: '#app',
    data : {
    },
    render: h => h(App)
});



