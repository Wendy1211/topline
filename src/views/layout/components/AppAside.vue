<template>
  <el-menu
    default-active="2"
    @open="handleOpen"
    @close="handleClose"
    router
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-s-order"></i>
        <span>内容</span>
      </template>
      <el-menu-item index="/publish">
        <i class="el-icon-edit-outline"></i>
        <span slot="title">发布</span>
      </el-menu-item>
      <el-menu-item index="/article">
        <i class="el-icon-document"></i>
        <span slot="title">内容列表</span>
      </el-menu-item>
    </el-submenu>
    <el-menu-item index="/commen">
      <i class="el-icon-s-comment"></i>
      <span slot="title">评论</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="el-icon-shopping-cart-full"></i>
      <span slot="title">素材</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="el-icon-umbrella"></i>
      <span slot="title">粉丝</span>
    </el-menu-item>
    <el-menu-item index="/account">
      <i class="el-icon-setting"></i>
      <span slot="title">账户</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  name: 'AppAside',
  data () {
    return {}
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style lang="less" scoped>
.el-menu {
  height: 100%
}
</style>
