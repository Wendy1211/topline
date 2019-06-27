<template>
  <el-row :gutter="20" class="app-header">
    <el-col :span="20"><i class="el-icon-s-promotion"></i>  江苏传智播客教育科技股份有限公司</el-col>
    <el-col :span="4">
      <el-dropdown trigger="click">
       <span class="el-dropdown-link">
         <img :src="userInfo.photo" width="30">
         {{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right"></i>
       </span>
       <el-dropdown-menu slot="dropdown">
         <el-dropdown-item>账户设置</el-dropdown-item>
         <el-dropdown-item>退出</el-dropdown-item>
       </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'AppHearder',
  data () {
    return {
      userInfo: {}
    }
  },
  created () { // 登录成功时 存进本地存储的信息
    this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  }
}
</script>
<style lang="less" scoped>
.app-header {
  height: 60px;
  display: flex;
  align-items: center;
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #409eff;
  img {
    border-radius: 50%;
  }
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
