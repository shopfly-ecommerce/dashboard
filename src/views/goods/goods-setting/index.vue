<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="cachedViews">
      <router-view></router-view>
    </keep-alive>
  </transition>
</template>

<script>
  export default {
    name: 'goodsSetting'
  }
</script>
