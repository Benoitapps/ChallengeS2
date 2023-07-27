<script setup>
import { onMounted, ref } from 'vue';
import router from '../router';

const env = import.meta.env;
let tags = ref([]);
let tagsSelected = ref([]);
let tagFormed = ref([]);
const showErrorLabelTag = ref(false);
const errorMessage = ref('');

onMounted(async () => {
    let response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/tags`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    let res = await response.json();
    tags.value = res;

});

const updateTagSelected = () => {
    tagsSelected.value = [];
    let checkedTags = document.querySelectorAll('#tunnel-tags:checked');
    checkedTags.forEach(tag => {
        tagsSelected.value.push({
            id: tag.dataset.id,
            name: tag.dataset.name,
        });
    });
}

const createTunnel = async () => {
    let containerPosition = document.getElementById('tag-position');
    let tagsOrder = containerPosition.querySelectorAll('[id^=tag-order-]');
    tagsOrder.forEach(tagOrder => {
        tagFormed.value.push({
            id: tagOrder.dataset.id,
            position: tagOrder.value
        });
    });

    let tunnelName = document.getElementById('tunnel-name').value;
    if (tunnelName.length < 3) {
        showErrorLabelTag.value = true;
        errorMessage.value = "Le tunnel doit contenir au moins 4 caractères.";
        return;
    }

    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/tunnels/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tunnel: tunnelName,
            tags: tagFormed.value
        }),
        credentials: 'include'
    });

    if (response.status == 201) {
        router.push({ path: '/tags' })
    }
}

</script>

<template>
    <main>
        <div class="container">
            <div class="container-label">
                <label for="tunnel_name">Nom de votre tunnel</label>
                <input type="text" name="tunnel_name" id="tunnel-name" placeholder="Nom de votre tunnel">
                <div>
                    <span>
                        Tags
                    </span>
                    <br>
                    <label v-for="tag in tags" :key="tag.id" @click="updateTagSelected()" style="margin-right: 15px;">
                        <input type="checkbox" name="tunnel_tags" id="tunnel-tags" placeholder="Tag" :data-id="tag.id" :data-name="tag.name">
                        {{ tag.name }}
                    </label>
                </div>
                <div class="container-info">
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.5" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#1C274C"/>
                        <path d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z" fill="#1C274C"/>
                        <path d="M12 7C12.5523 7 13 7.44771 13 8C13 8.55229 12.5523 9 12 9C11.4477 9 11 8.55229 11 8C11 7.44771 11.4477 7 12 7Z" fill="#1C274C"/>
                    </svg>
                    <span class="info">
                        Les tunnels vous permettent tracker un ensemble de tags.
                    </span>
                </div>
            </div>
            <div class="container-label" id="tag-position">
                <span>Ordre de vos tags</span>
                <div v-for="(tag, index) in tagsSelected" :key="index">
                    <span>{{ tag.name }}</span>
                    <input type="number" name="tag_order" :id="'tag-order-' + id" :data-id="tag.id" placeholder="Position">
                </div>
            </div>
            
        </div>
        <div style="width: 100%; padding: 0 10px;">
            <div v-show="showErrorLabelTag" class="error-message">
                {{ errorMessage }}
            </div>
            <button style="width: 100%; margin-top: 10px;" @click="createTunnel()">CREER</button>
        </div>
    </main>
</template>

<style scoped>
    .container {
        display: flex;
        justify-content: space-between;
        border-radius: 10px;
    }

    .container-label {
        display: flex;
        flex-direction: column;
        padding: 20px;
        margin: 10px;
        height: auto;
        width: 50%;
        background-color: #fff;
        border-radius: 10px;
    }

    input {
        margin: 10px 0;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
    }

    button {
        padding: 10px;
        border-radius: 5px;
        border: none;
        background-color: var(--primary);
        color: #fff;
        cursor: pointer;
        font-weight: bold;
    }

    button:hover {
        background-color: var(--primary-hover);
    }

    .container-info {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        background-color: rgb(191, 234, 247);
        border-radius: 8px;
        padding: 14px;
    }

    .info {
        margin-left: 14px;
    }

    .error-message {
        color: red;
        margin-top: 5px;
    }
</style>