<template>
<div>
  <app-header></app-header>
  <div id="view-wrapper">
  <router-view></router-view>
  </div>
  <app-footer></app-footer>
</div>
</template>

<script>
import Header from "./components/shared/Header.vue";
import Footer from "./components/shared/Footer.vue";
export default {
  components:{
    appHeader:Header,
    appFooter:Footer
  }
}
</script>

<style>
div{
  color:#1d1d1d;
}
#view-wrapper{
  min-height: 90vh;
}
</style>
