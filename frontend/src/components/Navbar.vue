<script setup>
import { onMounted, ref,watch } from 'vue'
import { useRoute } from 'vue-router';

const props = defineProps({
  admin: {
    type: Boolean,
    default: false
  }
})

const route = useRoute();

const setLinkSelected = (link) => {
  const linkHref = link.querySelector('a').getAttribute('href');

  if (
      linkHref !== "/" &&
      !route.fullPath.match("/tunnels") &&
      route.fullPath.match(linkHref)
  ) {
    document.querySelector(".selected")?.classList.remove("selected");
    link.classList.add('selected');
  } else if (
      linkHref === "/" &&
      linkHref === route.fullPath
  ) {
    document.querySelector(".selected")?.classList.remove("selected");
    link.classList.add('selected');
  } else if (
      route.fullPath.match("/tunnels")
  ) {
    document.querySelector(".selected")?.classList.remove("selected");
    document.querySelector("a[href*='/tags']").closest(".navbar__links").classList.add('selected');
  }
};

onMounted(() => {
  const navbarLinks = document.querySelectorAll('.navbar__links');
  navbarLinks.forEach((link) => {
    setLinkSelected(link);
  });
});

watch(
    () => route.fullPath,
    (newVal) => {
      const navbarLinks = document.querySelectorAll('.navbar__links');
      navbarLinks.forEach((link) => {
        setLinkSelected(link);
      });
    }
);
</script>

<template>
  <header>
    <nav>
      <ul class="navbar">
        <li class="navbar__links">
          <router-link to="/">
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
              <path d="M280.082-424.309q-23.082 0-39.428-16.264-16.345-16.264-16.345-39.345 0-23.082 16.264-39.428 16.264-16.345 39.345-16.345 23.082 0 39.428 16.264 16.345 16.264 16.345 39.345 0 23.082-16.264 39.428-16.264 16.345-39.345 16.345ZM280-260.001q-91.538 0-155.768-64.231-64.23-64.23-64.23-155.768t64.23-155.768q64.23-64.231 155.768-64.231 67.769 0 119.653 34 51.885 34 78.173 98.385h363.02l94.921 94.921-144.306 133.384-79.922-58.615-82.23 59.384-70.769-53.846h-80.618q-22.307 57.692-73.692 95.038-51.384 37.347-124.23 37.347Zm0-45.384q58.769 0 105.654-38.115 46.884-38.116 60.04-94.269h129.461l54.769 42.692 82.615-58.769 75.846 57.384 81.922-77.846-47.922-47.923H445.769q-11.615-53.307-57.809-92.846-46.194-39.538-107.86-39.538-72.792 0-123.754 50.9-50.961 50.9-50.961 123.654 0 72.753 50.918 123.715Q207.221-305.385 280-305.385Z"/>
            </svg>
            KPI
          </router-link>
        </li>
        <li class="navbar__links">
          <router-link to="/charts">
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
              <path d="M130.001-130.001v-62.922l45.383-45.383v108.305h-45.383Zm163.846 0v-222.922l45.383-45.383v268.305h-45.383Zm163.461 0v-268.305l45.384 46.383v221.922h-45.384Zm163.846 0v-221.922l45.384-45.383v267.305h-45.384Zm163.462 0v-382.922l45.383-45.383v428.305h-45.383ZM130.001-372.54v-63.844L400-705.153l160 160 269.999-270.614v64.229L560-480.924l-160-160L130.001-372.54Z"/>
            </svg>
            Graphiques
          </router-link>
        </li>
      
        <li class="navbar__links">
          <router-link to="/heatmap">
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
              <path d="M462.23-260.771q-85.614-7.308-143.921-69.769-58.308-62.461-58.308-149.46 0-92.051 63.974-156.025Q387.949-699.999 480-699.999q86.999 0 149.46 58.115 62.461 58.115 69.769 144.345l-48.383-15q-11.353-61.307-58.708-101.692Q544.782-654.615 480-654.615q-72.692 0-123.654 50.961Q305.385-552.692 305.385-480q0 64.307 40.577 112.077 40.577 47.769 101.499 59.153l14.769 47.999Zm48 159.154q-7.557 1-15.115 1.308-7.557.308-15.115.308-78.85 0-148.199-29.92-69.35-29.92-120.65-81.21-51.3-51.291-81.225-120.629-29.925-69.337-29.925-148.173t29.92-148.204q29.92-69.369 81.21-120.682 51.291-51.314 120.629-81.247 69.337-29.933 148.173-29.933t148.204 29.925q69.369 29.925 120.682 81.225 51.314 51.3 81.247 120.65Q859.999-558.85 859.999-480q0 7.461-.308 14.923-.308 7.461-1.308 14.923l-43.768-13.385V-480q0-139.692-97.461-237.154Q619.692-814.615 480-814.615t-237.154 97.461Q145.385-619.692 145.385-480t97.461 237.154Q340.308-145.385 480-145.385h16.461l13.769 43.768Zm295.384 7.384-181.385-181.77-43.461 131.383L480-480l335.38 100.768-131.383 43.461 181.77 181.385-60.153 60.153Z"/>
            </svg>
            Heatmap
          </router-link>
        </li>
        <li class="navbar__links">
          <router-link to="/tags">
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
              <path d="M559-97q-18 18-43.5 18T472-97L97-472q-10-10-13.5-21T80-516v-304q0-26 17-43t43-17h304q12 0 24 3.5t22 13.5l373 373q19 19 19 44.5T863-401L559-97Zm-41-41 304-304-378-378H140v304l378 378ZM245-664q21 0 36.5-15.5T297-716q0-21-15.5-36.5T245-768q-21 0-36.5 15.5T193-716q0 21 15.5 36.5T245-664ZM140-820Z"/>
            </svg>
            Tags
          </router-link>
        </li>
        <li class="navbar__links" v-if="props.admin">
          <router-link to="/AdminHome">
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
              <path d="M480-450q-58 0-97.5-39.5T343-587q0-58 39.5-97.5T480-724q58 0 97.5 39.5T617-587q0 58-39.5 97.5T480-450Zm0-60q34 0 55.5-21.5T557-587q0-34-21.5-55.5T480-664q-34 0-55.5 21.5T403-587q0 34 21.5 55.5T480-510Zm0 429q-140-35-230-162.5T160-523v-238l320-120 320 120v238q0 152-90 279.5T480-81Zm0-399Zm0-337-260 98v196q0 63 17.5 120.5T287-296q46-25 93.5-37.5T480-346q52 0 99.5 12.5T673-296q32-49 49.5-106.5T740-523v-196l-260-98Zm0 531q-39 0-78 10t-77 30q32 35 71 61.5t84 41.5q45-15 84-41.5t71-61.5q-38-20-77-30t-78-10Z"/>
            </svg>
            Admin
          </router-link>
        </li>
        <li class="navbar__links">
          <router-link to="/download">
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
              <path d="M220-160q-24 0-42-18t-18-42v-143h60v143h520v-143h60v143q0 24-18 42t-42 18H220Zm260-153L287-506l43-43 120 120v-371h60v371l120-120 43 43-193 193Z"/>
            </svg>
            Télécharger le SDK
          </router-link>
        </li>
        <li class="navbar__links">
          <router-link to="/profil">
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
              <path d="M222-255q63-44 125-67.5T480-346q71 0 133.5 23.5T739-255q44-54 62.5-109T820-480q0-145-97.5-242.5T480-820q-145 0-242.5 97.5T140-480q0 61 19 116t63 109Zm257.814-195Q422-450 382.5-489.686q-39.5-39.686-39.5-97.5t39.686-97.314q39.686-39.5 97.5-39.5t97.314 39.686q39.5 39.686 39.5 97.5T577.314-489.5q-39.686 39.5-97.5 39.5Zm.654 370Q398-80 325-111.5q-73-31.5-127.5-86t-86-127.266Q80-397.532 80-480.266T111.5-635.5q31.5-72.5 86-127t127.266-86q72.766-31.5 155.5-31.5T635.5-848.5q72.5 31.5 127 86t86 127.032q31.5 72.532 31.5 155T848.5-325q-31.5 73-86 127.5t-127.032 86q-72.532 31.5-155 31.5ZM480-140q55 0 107.5-16T691-212q-51-36-104-55t-107-19q-54 0-107 19t-104 55q51 40 103.5 56T480-140Zm0-370q34 0 55.5-21.5T557-587q0-34-21.5-55.5T480-664q-34 0-55.5 21.5T403-587q0 34 21.5 55.5T480-510Zm0-77Zm0 374Z"/>
            </svg>
            Profil
          </router-link>
        </li>
        <li class="navbar__links">
          <router-link to="/logout">
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
              <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h291v60H180v600h291v60H180Zm486-185-43-43 102-102H375v-60h348L621-612l43-43 176 176-174 174Z"/>
            </svg>
            Déconnexion
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
  header,
  nav {
    display: flex;
    height: 100%;
    width: 200px;
  }

  header {
    border-right: var(--border);
    padding: 20px 0;
    background: var(--background);
    height: 100vh;

    .navbar {
      display: flex;
      flex-direction: column;
      gap: 15px;
      width: 100%;
      height: 100%;
      position: relative;

      &__links {
        display: flex;
        align-items: center;
        width: 100%;
        height: 50px;
        border-radius: 0 50px 50px 0;
        overflow: hidden;

        &:last-child {
          position: absolute;
          bottom: 0;
          left: 0;
        }

        a {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          height: 100%;
          font-weight: 500;
          padding-left: 20px;

          &:hover {
            background-color: var(--accent);
          }

          svg {
            height: 30px;

            path {
              fill: var(--text-color);
            }
          }
        }

        &.selected {
          background-color: var(--primary);

          a {
            &:hover {
              background-color: var(--primary) !important;
            }
          }
        }
      }
    }
  }
</style>