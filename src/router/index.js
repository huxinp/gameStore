import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/Index';
import Games from '@/components/Games';

Vue.use(Router);

export default new Router({
    routes: [
	    {
	        path: '/',
	        name: 'Index',
	        component: Index
	    },
		{
			path: '/:gameName',
			name: 'Games',
			component: Games
		}
    ]
});
