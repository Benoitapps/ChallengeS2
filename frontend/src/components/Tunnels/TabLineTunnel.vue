<script setup>
const env = import.meta.env;
import { ref, onMounted } from 'vue';

const userApi = ref('');
const tunnelName = ref('');
const disabled = ref(true);

const props = defineProps({
    tunnel: {
        type: Object,
    }
});

const getConnectedUser = async () => {
    try {
        const userData = localStorage.getItem('myUser');
        if (userData) {
            const parsedData = JSON.parse(userData);

            userApi.value = parsedData.apiToken;
        }else{
            router.push('/login');
        }
    } catch (error) {
        error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
    }
};

getConnectedUser();

const deleteLine = async (id) => {
    let message = confirm('Est tu sur de vouloir supprimer ce tunnel ?')
    if (message) {
        const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/tunnels/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        };

        document.querySelector(`#tunnel-${id}`).remove();
    }
}

const getStats = async (id) => {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/tunnels/stats/${id}`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
            userApi: userApi.value
        })
    });
    if (!response.ok) {
        throw new Error(`Erreur HTTP ! statut : ${response.status}`);
    };

    const data = await response.json();
}

const updateName = async () => {
    disabled.value = !disabled.value;
    if (!disabled.value) {
        document.querySelector(`#tunnel-${props.tunnel.id} input`).focus();
    }else{
        tunnelName.value = document.querySelector(`#tunnel-${props.tunnel.id} input`).value;
        const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/tunnels/update/${props.tunnel.id}`, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify({
                name: tunnelName.value
            })
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        };
    }
}

onMounted(() => {
    tunnelName.value = props.tunnel.name;
});
</script>

<template>
    <tr :id="'tunnel-' + props.tunnel.id">
        <td class="center">
            <input type="text" :value="tunnelName" style="text-align: center;" :disabled="disabled">
            <button @click="updateName()" class="edit-btn">edit</button>
        </td>
        <td class="center">
            <button @click="deleteLine(props.tunnel.id)" class="deleteBtn">SUPPRIMER</button>
            <!-- <button @click="getStats(props.tunnel.id)" disabled>Voir les stats</button> -->
        </td>
    </tr>
</template>

<style scoped>
.center {
    text-align: center;
}

tr:nth-child(even) {
    background-color: #eeeeee;
}

tr:nth-child(odd) {
    background-color: #fff;
}

td {
    padding: 10px 0;
}

.deleteBtn {
    background-color: #f52323;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
}

.deleteBtn:hover {
    background-color: #ee5e5e;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
}

.edit-btn {
    background-color: #5be27f;
    border: none;
    border-radius: 5px;
    padding: 2px 15px;
    cursor: pointer;
    margin-left: 5px;
}

.edit-btn:hover {
    background-color: #4fc76f;
    border: none;
    border-radius: 5px;
    padding: 2px 15px;
    cursor: pointer;
    margin-left: 5px;
}
</style>