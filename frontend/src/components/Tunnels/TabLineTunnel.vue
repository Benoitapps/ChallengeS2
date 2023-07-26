<script setup>
const env = import.meta.env;

const props = defineProps({
    tunnel: {
        type: Object,
    }
});

const deleteLine = async (id) => {
    console.log(id)
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
</script>

<template>
    <tr :id="'tunnel-' + props.tunnel.id">
        <td class="center">{{ props.tunnel.name }}</td>
        <td class="center">
            <button @click="deleteLine(props.tunnel.id)" class="deleteBtn">SUPPRIMER</button>
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
</style>