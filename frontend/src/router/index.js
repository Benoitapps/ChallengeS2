import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";

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
            }
        ]
    });

export default index;