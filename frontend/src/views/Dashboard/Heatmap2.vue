
  
<script setup>
import { onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import h337 from '@mars3d/heatmap.js'
const env = import.meta.env

const heatmapRef = ref(null);
const heatmapContainerRef = ref(null);
const imageInput = ref(null);
const tabimage = ref([]);
const nameImage = ref("");

const userApi = ref("");

const map1 = ref([]);
const map = ref([]);

const map1mouse = ref([]);
const mapmouse = ref([]);

const error = ref("");

const chemin = ref("");
const srcbase = ref("");
const src = ref("");
const srcImage = ref("");
const choiceType = ref("");
const res = ref([]);
const testres = ref([]);

const getConnectedUser = async () => {
  try {
    const userData = localStorage.getItem('myUser');;
    if (userData) {
      const parsedData = JSON.parse(userData);

      userId.value = parsedData.userId;
      userApi.value = parsedData.apiToken;
    }
  } catch (error) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
};
getConnectedUser();

watch(map1, async (newRes) => {
  console.log("watchclic", newRes);
  if (!heatmapRef.value) {
    return;
  }
  heatmapRef.value.setData({
    min: 0,
    max: 10,
    data: newRes
  });
});

watch(map1mouse, async (newRes) => {
  console.log("watchmouse", newRes);
  if (!heatmapRef.value) {
    return;
  }
  heatmapRef.value.setData({
    min: 0,
    max: 10,
    data: newRes
  });
});

watchEffect(async () => {
  console.log("je passe ");
  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/heatmap/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({apiToken : userApi.value})

      
    });
    if (response.ok) {
      const data = await response.json();
      map.value = data;
      console.log("map",map.value.resPage);
      map1.value = map.value.resPage[0].coordinates;
      console.log("map1",map1.value);
      console.log(map.value)

     // console.log("after then", res.value);
    } else {
      const data = await response.json();
      error.value = data.error;
    }
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
});

watchEffect(async () => {

console.log("je passe mouse");
try {
const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/heatmap/mouse`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({apiToken : userApi.value})

});

if (response.ok) {
  const data = await response.json();
      mapmouse.value = data;
      console.log("map",mapmouse.value.resPagemouse);
      map1mouse.value = mapmouse.value.resPagemouse[0].coordinates;
      console.log("map1",map1mouse.value);
      console.log(mapmouse.value)
} else {
  const data = await response.json();
  error.value = data.error;
}
} catch (e) {
error.value ="Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
}
});

const getUrl = async (name) => {
  console.log("get>UlOK")
try {
  const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/heatmap/upload/getOne`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
        name: name ,
        apiToken: userApi.value,
      }),
  });
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    srcImage.value = data; // Update the kpiData variable with the fetched data
    console.log(srcImage)

  } else {
    const errorData = await response.json();
    error.value = errorData.error;
  }
} catch (e) {
  error.value = "Une erreur s'est produite lors de la récupération des KPI";
}
}

onMounted(() => {
  heatmapRef.value = h337.create({
    container: heatmapContainerRef.value
  });
  heatmapRef.value.setDataMin(0);
  heatmapRef.value.setDataMax(1000);
});

onUnmounted(() => {
});

function changePath(key,coordinates, type) {
  getUrl(key);
  src.value = key;
  srcImage.value = "testimage;" 
  console.log(type);
  if (type == "clic") {
    console.log("coordinate",coordinates)
    map1.value=coordinates
  }
   if(type == "mouse"){
    console.log("coordinate",coordinates)
    map1mouse.value=coordinates
  }
  console.log("chemin :", key);
}



function handleImageUpload(files, path) {
  console.log("Le files est passé et est :", files);
  console.log("Le path est passé et est :", path);

  // Créer un objet Blob à partir du fichier
  const imageBlob = new Blob(files, { type: files[0].type });

  const reader = new FileReader();
  reader.onloadend = () => {
    const rawImg = reader.result;
    uploadImage(rawImg, path);
  };

  reader.readAsDataURL(imageBlob);
}




  async function uploadImage(base64Data,path) {
    console.log("path2", path)
    try {
    const userData = localStorage.getItem('myUser');;
    if (userData) {
      const parsedData = JSON.parse(userData);

      userApi.value = parsedData.apiToken;

      console.log("mon api est le : "+ userApi.value)
    }
  } catch (error) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
  try {
    //console.log("imagebody",base64Data)
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/heatmap/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        image: base64Data ,
        token: userApi.value,
        name : path
      }),
    });
   
    console.log("imagechemin",response);
    if (response.ok) {
      getImage();
      document.getElementById('input[type=file]').value = '';

      // Image uploaded successfully
      // You may show a success message or refresh the heatmap, etc.
      console.log("Image uploaded successfully");
    } else {
      const data = await response.json();
      // Handle the error response
      error.value ="Image upload failed:", data.error;
    }
  } catch (e) {
    error.value = "An error occurred during image upload:";
  }
}

async function getImage() {
  console.log("getImage est apl");
    try {
    const userData = localStorage.getItem('myUser');;
    if (userData) {
      const parsedData = JSON.parse(userData);

      userApi.value = parsedData.apiToken;

      console.log("mon api est le getimage: "+ userApi.value)
    }
  } catch (error) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
  console.log("getimagetokenok");
  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/heatmap/upload/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({apiToken : userApi.value}),
    });
   
    console.log("imagechemin",response);
    if (response.ok) {
      const data = await response.json();
      console.log("imagerecuperer en bdd",data);
      tabimage.value =data;
      imageInput.value ="";

    } else {
      const data = await response.json();
      const errorData = await response.json();
      error.value = errorData.error;
    }
  } catch (e) {
    error.value = "An error occurred during image upload:";
  }
}

getImage();

</script>

<template>
  <main>
    <div class="bodypage">
    <div class="type">
      <div class="type2">
        <h4>Heatmap Clics page :</h4>
         <div class="interieur">
          <div class="titre" v-for="item in map.resPage" :key="item.id" >
            <button class="bouton" v-on:click="changePath(item.path,item.coordinates , 'clic' )">{{ item.path }}</button>
          </div>
        </div>
      </div>
      <div class="type2">
        <h4>Heatmap Suivis page :</h4>
        <div class="interieur">
          <div class="titre" v-for="item in mapmouse.resPageMouse" :key="item.id" >
            <button class="bouton" v-on:click="changePath(item.path,item.coordinates,'mouse' )">{{ item.path }}</button>
          </div>
        </div>
      </div>
    </div>  
    <div ref="heatmapContainerRef" id="heatmapContainer">
    
      <img class="image" :src="srcImage.src" alt="Image décodée" />
    </div>

    <div v-for="item in mapmouse.resPageMouse" :key="item.id" >
      <p>Ajouter une image pour la page : {{ item.path }}</p>
    <input type="file" @change="(e) => handleImageUpload(e.target.files, item.path)" />
  </div>

<!--     
    <div v-if="tabimage && tabimage.image && tabimage.image.length > 0">
      <h4>Images depuis la base de données :</h4>
      <div v-for="(image, index) in tabimage.image" :key="index">
        <div v-if="src == image.name"></div>
        <img :src="image.src" alt="Image décodée" />
      </div>
    </div> -->
  </div>
  </main>
</template>
  
<style scoped lang="scss">
#heatmapContainer {
  // width: 20em;
  // height: 20em;
  border: black solid 5px;
  background: rgba(0, 0, 0, .4);
  width: 100em;
  height: 50em;
  margin-top: 2px;
  overflow: hidden;
}

.image{
  object-fit: contain;
  opacity: 50%;

}

.bodypage{
  display: flex;
  flex-direction: column;
  align-items: center;
}

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
  