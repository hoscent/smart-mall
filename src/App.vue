<template>
  <div id="app">
    <keep-alive :include="['LayoutIndex']">
      <router-view/>
    </keep-alive>
  </div>
</template>

<style lang="less">
</style>
