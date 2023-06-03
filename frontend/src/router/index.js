import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Compte from "../views/Compte.vue";

const index = createRouter(
    {
        history: createWebHistory(),
        routes: [
            {
                path: '/',
                component: Home
            },
            {

                path: '/compte',
                component: Compte
            }
        ]
    });

export default index;