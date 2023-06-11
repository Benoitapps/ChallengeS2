import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import HomeConnect from "../views/HomeConnect.vue";
import Admin from "../views/Admin.vue";
const index = createRouter(
    {
        history: createWebHistory(),
        routes: [
            {
                path: '/',
                component: Home
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
            }
        ]
    });

export default index;