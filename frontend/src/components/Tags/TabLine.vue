<script setup>
const env = import.meta.env;
import { ref, onMounted } from 'vue';

const tagName = ref('');
const disabled = ref(true);

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

const updateName = async () => {
    disabled.value = !disabled.value;
    if (!disabled.value) {
        document.querySelector(`#tag-${props.tag.id} input`).focus();
    }else{
        tagName.value = document.querySelector(`#tag-${props.tag.id} input`).value;
        const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/tags/update/${props.tag.id}`, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify({
                name: tagName.value
            })
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        };
    }
}

onMounted(() => {
    tagName.value = props.tag.name;
});
</script>

<template>
    <tr :id="'tag-' + props.tag.id">
        <td class="center">
            <input type="text" :value="tagName" style="text-align: center;" :disabled="disabled">
            <button @click="updateName()" class="edit-btn">edit</button>
        </td>
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