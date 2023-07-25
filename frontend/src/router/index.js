import { createRouter, createWebHistory } from 'vue-router';
import KPI from '../views/Dashboard/KPI.vue';
import Charts from "../views/Dashboard/Charts.vue";
import Heatmap from "../views/Dashboard/Heatmap.vue";
import Heatmap2 from "../views/Dashboard/Heatmap2.vue";
import Register from "../views/Connexion/Register.vue";
import Login from "../views/Connexion/Login.vue";
import HomeConnect from "../views/Connexion/HomeConnect.vue";
import Admin from "../views/Admin.vue";
import AdminHome from "../views/AdminHome.vue";
import Profil from "../views/Profil/Profil.vue";
import ProfilModify from "../views/Profil/ProfilModify.vue";
import Logout from "../views/Connexion/Logout.vue";
import Tags from "../views/Tags.vue";
import Test from "../views/Test.vue";

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
                path: '/heatmap2',
                component: Heatmap2
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
                path: '/adminHome',
                component: AdminHome
            },
            {
                path: '/profil',
                component: Profil
            },
            {
                path: '/profil/modifier',
                component: ProfilModify
            },
            {
                path: '/logout',
                component: Logout
            },
            {
                path: '/tags',
                component: Tags
            },
            {
                path: '/test',
                component: Test
            },

        ]
    });

export default index;