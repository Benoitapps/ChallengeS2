<script setup>

import { inject, onMounted, onUnmounted, ref } from "vue";
import { reactive, watch, watchEffect  } from "vue";
const userId = ref('');
const userApi = ref('');
const clics = ref("");
const sessions = ref("");
const moysessions = ref("");
const moySessionVisiteur = ref("");


const map1 = ref([]);
const map = ref([]);

const map1mouse = ref([]);
const mapmouse = ref([]);

const error = ref("");

const chemin = ref("");
const srcbase = ref("");
const src = ref("");
const choiceType = ref("");

onMounted(() => {
  const sdk = inject('sdk');
  sdk.trackMouseMovement();

  onUnmounted(() => {
    sdk.stopTrackingMouseMovement();
  });
});


const getConnectedUser = async () => {
  try {
    const userData = localStorage.getItem('myUser');;
    if (userData) {
      const parsedData = JSON.parse(userData);

      srcbase.value = parsedData.website;

      console.log("mon website est le : "+ srcbase.value)
    }
  } catch (error) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
};


const getHeatmapClick = async () => {

  console.log("je passe ");
try {
  const response = await fetch(`http://localhost:3000/heatmap/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  

  if (response.ok) {
    const data = await response.json();
    map.value= data;
    //console.log(map.value);
    map1.value = map.value.resPage;
    //console.log(map1.value);
    //chemin.value = map1[0].path;

   // clics.value = data.totalClicks;

  } else {
    const data = await response.json();
    error.value = data.error;
  }
} catch (e) {
  error.value ="Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
}
};
////////////////////////////////////////////////////////////////////////////////////////////////////
const getHeatmapMouse = async () => {

console.log("je passe ");
try {
const response = await fetch(`http://localhost:3000/heatmap/mouse`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
});


if (response.ok) {
  const data = await response.json();
  mapmouse.value= data;
  console.log(mapmouse.value);
  map1mouse.value = mapmouse.value.resPageMouse;
  //console.log(map1.value);
  //chemin.value = map1[0].path;

 // clics.value = data.totalClicks;

} else {
  const data = await response.json();
  error.value = data.error;
}
} catch (e) {
error.value ="Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
}
};


getConnectedUser();
getHeatmapClick();
getHeatmapMouse();

function changePath(path,type){

  choiceType.value = type
  chemin.value=path;

src.value = "http://"+srcbase.value+chemin.value

console.log("chamin :", src.value)
}


</script>

<template>
  <main>
    <div class="type">
      <div class="type2">
        <h4>Heatmap Clics page :</h4>
         <div class="interieur">
          <div class="titre" v-for="item in map.resPage" >
            <button class="bouton" v-on:click="changePath(item.path, 'clic' )">{{ item.path }}</button>

          </div>
        </div>
      </div>
      <div class="type2">
        <h4>Heatmap Suivis page :</h4>
        <div class="interieur">
          <div class="titre" v-for="item in mapmouse.resPageMouse" >
            <button class="bouton" v-on:click="changePath(item.path,'mouse' )">{{ item.path }}</button>
          </div>
        </div>
      </div>
    </div>


    <div class="heatmap">
      <iframe :src="src" width="95%" height="95%"></iframe>

      <div v-if="choiceType == 'clic'">
        <div v-for="item in map.resPage">
          <div v-if="item.path == chemin" v-for="item in item.coordinates">
            <span class="heatmap-point" :style="{ top: item.x/2 + 'px', left: item.y/2 + 'px', backgroundColor: item.color }"></span>
          </div>
        </div>
      </div>
      <div v-if="choiceType == 'mouse'">
        <div v-for="item in mapmouse.resPageMouse">
          <div v-if="item.path == chemin" v-for="item in item.coordinates">
            <span class="heatmap-point" :style="{ top: item.x/2 + 'px', left: item.y/2 + 'px', backgroundColor: item.color }"></span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">

.bouton{
  padding: 2px;
  width: 90px;
  white-space: nowrap;    
  overflow: hidden;       
  text-overflow: ellipsis;
}
  .type{
    display: flex;
    justify-content: space-around;
  }
  .type2 {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  background-color: #ffff;
  border: #000 solid 2px;
  margin-bottom: 10px;
  flex-wrap: nowrap; /* Empêche le contenu de passer à la ligne automatiquement */
  max-width: 500px;
  overflow-wrap: break-word; /* Permet au texte de passer à la ligne si nécessaire */
}


  .interieur{
    display: flex;
  }

  .titre{
    display: flex;
  }
  .heatmap{
    position: relative;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 50%;
  }

  .heatmap iframe {
    border: #000 solid 2px;
    pointer-events: none;
  }
  .heatmap-point {
    position: absolute;
    top: 0; 
    left: 0; 
    padding: 15px;
    opacity: 70%;
    border-radius: 50%;
  }
</style>