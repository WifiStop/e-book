<template>
  <div id="app">
     <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less">
#app{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F0F0F0;
  }
</style>
