
const routes = [
    {
        path: '/',
        // component: () => import('layouts/MainLayout.vue'),
		// component: () => import('pages/Home.vue'),
		component: () => import('layouts/NavBarWeb.vue'),
        children: [
            { path: '', component: () => import('pages/Home.vue') },
            // { path: 'login', component: () => import('components/Login.vue') },
            // { path: 'register', component: () => import('components/Register.vue') },
            // { path: 'protected', component: () => import('pages/ProtectedPage.vue'), meta: { requiresAuth: true } },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue')
    }
]

export default routes
