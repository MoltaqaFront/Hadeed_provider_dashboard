<template>
  <v-app>
    <transition name="fadeInUp" mode="out-in">
      <router-view />
    </transition>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
