<script setup>
import { onMounted, ref } from 'vue';
import router from '../router';

const env = import.meta.env;
const showErrorLabelTag = ref(false);

const createTag = async () => {
    let labelName = document.getElementById('tag-label').value

    if (labelName.length < 4) {
        showErrorLabelTag.value = true;
        return;
    }

    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/tags/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            label: document.getElementById('tag-label').value
        }),
        credentials: 'include'
    });

    if (response.status == 201) {
        let res = await response.json();
        router.push({ path: '/tags' })
    }
}

onMounted(() => {
    document.querySelectorAll(".navbar__links").forEach(link => {
        const path = link.querySelector("a").href.split("/").slice(3, 4).join("/");
        if(link.querySelector("a").href === path) {
            link.classList.add("selected");
        }

        link.addEventListener("click", () => {
            if(document.querySelector(".selected")) {
                document.querySelector(".selected").classList.remove("selected");
            }
            link.classList.add("selected");
        });
    });
});

</script>

<template>
    <main>
        <div class="container">
            <div class="container-label">
                <label for="tag_label">Nom de votre tag</label>
                <input type="text" name="tag_label" id="tag-label" placeholder="Label de votre tag">
                <div v-show="showErrorLabelTag" class="error-message">
                    Le label de votre tag doit contenir au moins 4 caractères.
                </div>
                <button @click="createTag()">CREER</button>
                <div class="container-info">
                    <svg width="80px" height="80px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.5" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#1C274C"/>
                        <path d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z" fill="#1C274C"/>
                        <path d="M12 7C12.5523 7 13 7.44771 13 8C13 8.55229 12.5523 9 12 9C11.4477 9 11 8.55229 11 8C11 7.44771 11.4477 7 12 7Z" fill="#1C274C"/>
                    </svg>
                    <span class="info">
                        Les tags sont des tokens qui permettent de suivre en temps réel les actions des utilisateurs sur des éléments précis de votre site.
                        Vous pouvez créer autant de tags que vous le souhaitez.
                    </span>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-radius: 10px;
    }

    .container-label {
        display: flex;
        flex-direction: column;
        padding: 20px;
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
        margin-bottom: 5px;
    }
</style>