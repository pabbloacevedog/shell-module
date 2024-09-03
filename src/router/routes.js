// import { microfrontends } from '../microfrontends';
import { defineAsyncComponent } from "vue";
const Test = defineAsyncComponent(() => import(/* @vite-ignore */  "authApp/Test"));
const Login = defineAsyncComponent(() => import(/* @vite-ignore */  "authApp/Login"));
const Register = defineAsyncComponent(() => import(/* @vite-ignore */  "authApp/Register"));
const microfrontendCache = {};

// Función para cargar microfrontend
const loadMicrofrontend = async (app) => {
    console.log('Loading microfrontend', app);
    if (microfrontendCache[app.component]) {
        return microfrontendCache[app.component];
    }

    try {
        const { default: container } = await import(/* @vite-ignore */ `${app.remoteEntry}`);

        if (!container || typeof container.get !== 'function') {
            throw new Error(`Container is not valid or doesn't have a 'get' method`);
        }

        const factory = await container.get(app.component);
        const Module = factory();

        microfrontendCache[app.component] = Module;
        return Module;
    } catch (error) {
        console.error(`Error loading ${app.component}:`, error);
        return () => import('components/ErrorLoadingMicrofrontend.vue');
    }
};
const generateRoutes = () => {
    const routes = [
        {
            path: '/',
            component: () => import('layouts/NavBarWeb.vue'),
            children: [
                { path: '', component: () => import('pages/Home.vue') },
                { path: 'test', component: () => Test },
                { path: 'login', component: () => Login },
                { path: 'Register', component: () => Register },
            ],
        },
        {
            path: '/:catchAll(.*)*',
            component: () => import('pages/ErrorNotFound.vue')
        }
    ]

    // Object.keys(microfrontends).forEach(appName => {
    //     const app = microfrontends[appName];
    //     app.routes.forEach(route => {
    //         routes.push({
    //             path: route.path,
    //             component: () => loadMicrofrontend({ ...route, remoteEntry: app.remoteEntry }),
    //         });
    //     });
    // });

    return routes;
};

const routes = generateRoutes();

export default routes;
