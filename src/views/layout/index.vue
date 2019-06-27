<template>
      <!-- <AppHeader/>
      <AppAside/> -->
      <!-- 这里是内容 -->
  <el-container>
    <el-aside width="200px"><AppAside/></el-aside>
    <el-container>
      <el-header><AppHeader/></el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'

export default {
  name: 'AppLayout',
  components: {
    AppAside,
    AppHeader
  },
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
.el-container {
    height: 100%
}
.el-aside {
    background-color: rgb(200, 222, 233)
}
.el-header {
    background-color: rgb(176, 203, 226);
}
.el-main {
    background-color: rgb(236, 238, 236);
}
</style>
