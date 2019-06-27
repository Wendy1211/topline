<template>
  <div>
      <el-card class="filter-card">
        <div slot="header" class="clearfix">
          <span>筛选条件</span>
        </div>
        <el-form ref="form" :model="filterParams" label-width="80px">
        <el-form-item label="文章状态">
          <el-radio-group v-model="filterParams.status">
            <el-radio label="">全部</el-radio>
            <el-radio
            :label="index + ''"
            v-for = "(item, index) in statTypes"
            :key="item.label"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道列表">
          <el-select v-model="filterParams.channel_id" placeholder="请选择">
            <el-option
            :label="item.name"
            :value="item.id"
            :key="item.id"
            v-for="item in channels"
            ></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="时间选择">
            <el-date-picker
              v-model="begin_end_pubdate"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              @change="handleDateChange"
              end-placeholder="结束日期"
              >
            </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="articleLoading"
            @click="onSubmit">查询
          </el-button>
        </el-form-item>
        </el-form>
      </el-card>
      <el-card class="list-card">
        <div slot="header" class="clearfix">
          <span>共找到<strong>{{ totalCount }}</strong>条符合条件的内容</span>
        </div>
        <el-table
          :data="articles"
          stripe
          style="width: 100%"
          v-loading="articleLoading">
            <!-- v-loading element自带的加载属性 -->
          <el-table-column
            prop="cover.images[0]"
            label="封面"
            width="180">
            <template slot-scope="scope">
              <img width="40" :src="scope.row.cover.images[0]">
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="pubdate"
            label="发布日期">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].label }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="success" plain
              >编辑</el-button>
              <el-button type="danger" plain
              @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalCount"
            class="page"
            :disabled="articleLoading"
            :current-page="page"
            @current-change="handleCurrentChange"
            >
          </el-pagination>
      </el-card>
  </div>
</template>
<script>
// import { filter } from 'minimatch';
// const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
export default {
  name: 'ArticleList',
  data () {
    return {
      articles: [],
      page: 1,
      totalCount: 0,
      articleLoading: false,
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      channels: [],
      filterParams: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: ''
      },
      begin_end_pubdate: []
    }
  },
  created () {
    // this.$http({
    //   method: 'GET',
    //   url: '/articles',
    //   headers: {
    //     // Authorization: `Bearer ${userInfo.token}`
    //   }
    // }).then(data => {
    //   console.log(data)
    // })
    this.loadArticles()
    this.loadChannels()
  },
  methods: {
    loadArticles (page = 1) {
      this.articleLoading = true
      const filterData = {}
      for (let key in this.filterParams) {
        if (this.filterParams[key]) {
          filterData[key] = this.filterParams[key]
        }
      }
      console.log(filterData)
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page,
          per_page: 10,
          ...filterData // 对象拷贝
        }
      }).then(data => {
        this.articles = data.results
        this.totalCount = data.total_count
        this.articleLoading = false
      })
    },
    loadChannels () {
      this.$http({
        method: 'GET',
        url: '/channels'
      }).then(data => {
        this.channels = data.channels
      })
    },
    onSubmit () {
      // console.log('submit!')
      // this.page = 1
      this.loadArticles()
    },
    handleCurrentChange (page) {
      this.page = page
      this.loadArticles(page)
    },
    handleDelete (articles) {
      // this.$http({
      //   method: 'DELETE',
      //   url: `articles/${articles.id}`
      // }).then(data => {
      //   this.loadArticles(this.page)
      this.$confirm('确定删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          method: 'DELETE',
          url: `articles/${articles.id}`
        }).then(data => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDateChange (value) {
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
    }
  }
}
</script>
<style lang='less' scoped>
.filter-card {
    margin-bottom: 20px
}
.page {
    margin-top: 30px
}
</style>
