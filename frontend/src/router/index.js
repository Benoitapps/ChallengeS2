import { createRouter, createWebHistory } from 'vue-router';
import KPI from '../views/KPI.vue';
import Charts from "../views/Charts.vue";
import Heatmap from "../views/Heatmap.vue";
import Settings from "../views/Settings.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import HomeConnect from "../views/HomeConnect.vue";
import Admin from "../views/Admin.vue";
import Profil from "../views/Profil/Profil.vue";
import ProfilModify from "../views/Profil/ProfilModify.vue";

const index = createRouter(
    {
        history: createWebHistory(),
        routes: [
            {
                path: '/',
                component: KPI
            },
            {
                path: '/charts',
                component: Charts
            },
            {
                path: '/heatmap',
                component: Heatmap
            },
            {
                path: '/settings',
                component: Settings
            },
            {
                path: '/register',
                component: Register
            },

            {
                path: '/login',
                component: Login
            },

            {
                path: '/connecter',
                component: HomeConnect
            },

            {
                path: '/admin',
                component: Admin
            },
            {
                path: '/profil',
                component: Profil
            },
            {
                path: '/profil/modifier',
                component: ProfilModify
            },
        ]
    });

export default index;