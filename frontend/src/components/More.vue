<script setup>
const emit = defineEmits(["toggleFavorite"]);

function openPopup(elem) {
  closeAllPopups();
  elem.$el.querySelector(".more__popup").style.setProperty("display", "block");
  elem.$el.classList.add("opened");
}

function closePopup(elem) {
  elem.$el.querySelector(".more__popup").style.removeProperty("display");
  elem.$el.classList.remove("opened");
}

function closeAllPopups() {
  document.querySelectorAll(".more").forEach((elem) => {
    if(elem.classList.contains("opened")) {
      elem.querySelector(".more__popup").style.removeProperty("display");
      elem.classList.remove("opened");
    }
  });
}

function toggleFavorite() {
  emit("toggleFavorite");
}

window.addEventListener("click", () => {
  closeAllPopups();
});
</script>

<template>
  <div class="more">
    <button class="more__button" @click.stop="openPopup(this)">
      <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
        <path d="M479.858-160Q460-160 446-174.142q-14-14.141-14-34Q432-228 446.142-242q14.141-14 34-14Q500-256 514-241.858q14 14.141 14 34Q528-188 513.858-174q-14.141 14-34 14Zm0-272Q460-432 446-446.142q-14-14.141-14-34Q432-500 446.142-514q14.141-14 34-14Q500-528 514-513.858q14 14.141 14 34Q528-460 513.858-446q-14.141 14-34 14Zm0-272Q460-704 446-718.142q-14-14.141-14-34Q432-772 446.142-786q14.141-14 34-14Q500-800 514-785.858q14 14.141 14 34Q528-732 513.858-718q-14.141 14-34 14Z"/>
      </svg>
    </button>

    <ul class="more__popup">
      <li @click.stop="closePopup(this); toggleFavorite()">
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
          <path d="m323-205 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Zm247-355Z"/>
        </svg>
        <p>Favori</p>
      </li>
      <li @click.stop="closePopup(this)">
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
          <path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/>
        </svg>
        <p>Supprimer</p>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.more {
  position: relative;
  z-index: 1;

  svg {
    path {
      fill: var(--text-color);
    }
  }

  &__button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    outline: none;
    width: 30px;
  }

  &__popup {
    display: none;
    position: absolute;
    z-index: 3;
    right: 0;
    width: 170px;
    border-radius: 10px;
    background-color: var(--background);
    overflow: hidden;

    li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px 20px;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        background-color: var(--accent) !important;
      }

      svg {
        width: 25px;
      }

      &:last-child {
        svg {
          path {
            fill: var(--error);
          }
        }

        p {
          color: var(--error) !important;
        }
      }
    }
  }
}
</style>