<script setup>
const env = import.meta.env;

const props = defineProps({
    tag: {
        type: Object,
    }
});

const deleteLine = async (id) => {
    let message = confirm('Est tu sur de vouloir supprimer ce tag ?')
    if (message) {
        const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/tags/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        };

        document.querySelector(`#tag-${id}`).remove();
    }
}
</script>

<template>
    <tr :id="'tag-' + props.tag.id">
        <td class="center">{{ props.tag.name }}</td>
        <td class="center">{{ props.tag.token }}</td>
        <td class="center">
            <button @click="deleteLine(props.tag.id)" class="deleteBtn">SUPPRIMER</button>
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