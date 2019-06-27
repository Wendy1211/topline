<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form">
        <!-- <el-form ref="form" :model="form">
          <el-form-item> -->
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <!-- <el-form-item> -->
          <el-form-item prop='code'>
            <!-- 支持栅格布局，一共是24列 -->
            <el-col :span="10">
              <el-input v-model="form.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="4">
              <!-- !!timer-转成布尔值 timer为0-false 不为0-true -->
              <el-button
              @click='handleSendCode'
              :disabled="!!timer || codeLoading"
              >
               {{ timer ? `剩余${seconds}秒` : '获取验证码' }}
              </el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="form.agree"></el-checkbox>
            <span>我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
          </el-form-item>
          <el-form-item>
            <!-- 给组件加 class，会作用到它的根元素 -->
            <!-- <el-button class="btn-login" type="primary" @click="onSubmit">登录</el-button> -->
            <!-- <el-button class="btn-login" type="primary" @click="handleLogin">登录</el-button> -->
            <el-button
              class="btn-login"
              type="primary"
              @click="handleLogin"
              :loading="loginLoading"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
// import axios from 'axios'
import '@/vendor/gt'
const initseconds = 60

export default {
  name: 'AppLogin',
  data () {
    return {
      form: { // 表单数据
        mobile: '17815340384',
        code: '246810',
        agree: '' // 是否同意用户协议
      },
      // rules: {
      loginLoading: false, // 登录按钮的 loading 状态
      rules: { // 表单验证规则 prop配置到每项
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '长度必须为11个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '长度必须为6个字符', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议', trigger: 'change' },
          { pattern: /true/, message: '请同意用户协议', trigger: 'change' }
        ]
      },
      captchaObj: null,
      seconds: initseconds,
      timer: null,
      sendMobile: '', // 保存初始化验证码之后发送短信的手机号
      codeLoading: false
    }
  },
  methods: {
    // onSubmit () {
    //   console.log('submit!')
    handleLogin () { // 二 登录功能 💗
      // 表单组件有一个方法 validate 可以用于获取当前表单的验证状态
      this.$refs['ruleForm'].validate(valid => { // 2.1 判断是否验证通过
        if (!valid) { // valid验证结果
          return // 不通过 终止
        }
        // 表单验证通过，提交登录
        this.submitLogin()
      })
    },
    submitLogin () {
      this.loginLoading = true
      console.log(this.form)
      this.$http({
        method: 'POST',
        url: 'authorizations',
        data: this.form
      }).then(data => {
        console.log(data)
        window.localStorage.setItem('user_info', JSON.stringify(data))
        // >= 200 && < 400 的状态码都会进入这里
        // Element 提供的 Message 消息提示组件，这也是组件调用的一种形式 通过js调用
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.loginLoading = false
        // 建议路由跳转都使用 name 去跳转，路由传参非常方便
        this.$router.push({
          name: 'home'
        })
      }).catch(err => { // >= 400 的 HTTP 状态码都会进入 catch 中
        if (err.response.status === 400) {
          this.$message.error('登录失败，手机号或验证码错误')
        }
        this.loginLoading = false
      })
    },
    handleSendCode () { // 一 发送验证码 功能💗
      this.$refs['ruleForm'].validateField('mobile', errorMessage => { // 表示手机号正确的时候 errorMessage为空
        if (errorMessage.trim().length > 0) {
          return
        }
        // 手机验证通过
        if (this.captchaObj) {
          if (this.form.mobile !== this.sendMobile) {
            document.body.removeChild(document.querySelector('.geetest_panel'))
            this.showGeetest()
          } else {
            this.captchaObj.verify()
          }
        } else {
          this.showGeetest()
        }
      })
    },
    showGeetest () {
      // es6解构写法
      // const { mobile } = this.form
      // if (this.captchaObj) {
      //   return this.captchaObj.verify() // 如果人机验证实例已经存在 就直接让其显示 并终止发送验证码的函数
      // }
      this.codeLoading = true
      this.$http({ // 1💗 向后台发送人机验证请求  1.2引入gt.js文件
        method: 'GET',
        url: `captchas/${this.form.mobile}`
      }).then(data => {
        // console.log(res.data)
        // const data = res.data.data
        window.initGeetest({ // 2💗 通过1后台返回的数据 作为极验的initGeetest函数 的参数 调用函数得到人机验证实例captchaObj
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind'
        }, (captchaObj) => { // 调用 人机验证实例captchaObj的方法
          this.captchaObj = captchaObj // 箭头函数内部的 this 指向外部作用域中的 this
          captchaObj.onReady(() => { // 在captchaObj是ready的状态下
            this.sendMobile = this.form.mobile
            captchaObj.verify() // 显示人机验证 弹框  verify-人机验证实例的显示方法
            this.codeLoading = false
          }).onSuccess(() => { // 3 💗人机验证成功后 将返回的数据 当作查询字符串参数 传给获取短信的接口 发送短信
            // console.log('验证成功了')
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } =
            captchaObj.getValidate() // 解构赋值 改名
            // 调用 获取短信验证码 (极验 API2）接口，发送短信
            this.$http({
              method: 'GET',
              url: `sms/codes/${this.form.mobile}`,
              params: { // 专门用来传递 query 查询字符串参数
                challenge,
                seccode,
                validate
              }
            }).then(data => {
              // console.log(res.data) // 4💗 返回手机号 则是发送短信成功 接收与否无关
              this.countDown() // 发送短信之后 开始倒计时
            })
          })
        })
      })
    },
    countDown () {
    // 倒计时函数
      this.timer = window.setInterval(() => {
        this.seconds--
        if (this.seconds <= 0) {
          this.seconds = initseconds
          window.clearInterval(this.timer)
          this.timer = null
        }
      }, 1000)
    }
  }
}

</script>
<style lang='less' scoped>
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center; // 缩减宽度 内容撑开宽高
  align-items: center;// 缩减高度
  background-color: #ccc;
  background: url('./login_bg.jpg');
  .login-head {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    img {
      width: 200px;
    }
  }
  .login-form-wrap {
    // width:400px;
    background-color: #fff;
    padding: 50px;
    border-radius: 10px;
    .btn-login {
      width: 100%;
    }
  }
}
</style>
