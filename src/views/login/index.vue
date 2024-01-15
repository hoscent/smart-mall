<template>
  <div class="login">
    <van-nav-bar title="登录" left-arrow @click-left="onClickLeft" />
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input v-model="phone" class="inp" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input v-model="picCode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <img v-show="picUrl" :src="picUrl" @click="getPicCode" alt="">
        </div>
        <div class="form-item">
          <input v-model="code" class="inp" placeholder="请输入短信验证码" type="text">
          <button @click="getCode" :disabled="isSend">{{ seconds === totalSeconds ? '获取验证码' : '重新发送(' + seconds + '秒)' }}</button>
        </div>
      </div>

      <div class="login-btn" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
import { getPicCode, getMsgCode, codeLogin } from '@/api/login'
export default {
  name: 'LoginIndex',
  data () {
    return {
      // 验证码
      picUrl: '',
      picKey: '',
      phone: '',
      picCode: '',
      code: '',
      totalSeconds: 60,
      seconds: 60,
      timer: null,
      isSend: false
    }
  },
  methods: {
    onClickLeft () {
      this.$router.back() // 返回上一页
    },
    async getPicCode () {
      const res = await getPicCode()
      this.picUrl = res.data.base64
      this.picKey = res.data.key
    },
    async getCode () {
      if (!this.validFn()) return
      // /captcha/sendSmsCaptcha
      if (!this.timer && this.seconds === this.totalSeconds) {
        await getMsgCode(this.picCode, this.picKey, this.phone)
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            this.timer = null
            this.seconds = this.totalSeconds
            this.isSend = false
          }
        }, 1000)
        this.isSend = true
        this.$toast('获取验证码成功')
      }
    },
    async login () {
      if (!this.validFn()) return
      if (!/^\d{6}$/.test(this.code)) {
        this.$toast('请输入正确的验证码')
        return
      }

      const res = await codeLogin(this.phone, this.code)
      this.$store.commit('user/setUserInfo', res.data)
      this.$toast('登录成功')
      // 判断有无回跳地址
      const url = this.$route.query.backUrl || '/'
      this.$router.replace(url) // 跳转回原页面
    },
    // 校验输入框内容
    validFn () {
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast('请输入正确的图形验证码')
        return false
      }
      return true
    }
  },
  created () {
    this.getPicCode() // 获取验证码
  },
  destroyed () {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
    button:disabled {
      color: #888;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg, #ff5722, #ee0a24);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
