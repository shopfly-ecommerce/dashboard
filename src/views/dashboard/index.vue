<template>
  <div class="dashboard-container" v-loading="loading">
    <!--商家基本信息-->
    <el-row :gutter="20" type="flex" justify="space-around" v-if="shop_info">
      <el-col  :span="24">
        <div class="grid-content bg-purple-light">
          <!--logo-->
          <div class="logo">
            <div class="shop-img-icon">
              <img v-if="shop_info.logo" :src="shop_info.logo">
              <img v-if="!shop_info.logo" src="../../assets/logo_images/icon-no-shop-logo.png">
            </div>
            <el-upload
              class="upload-demo"
              style="display: none;"
              :action="`${MixinUploadApi}?scene=shop`"
              :limit="1"
              :file-list="fileList"
              :before-upload="handleShopLogoBefore"
              :on-success="uploaded">
              <button style="visibility: hidden;" ref="uploadBtn"></button>
            </el-upload>
          </div>
          <!--文字信息-->
          <div class="shop-info">
            <div class="shop-info-basic">
              <span>{{ shop_info.site_name }}</span>
            </div>
            <div class="shop-info-credit">
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" type="flex" justify="space-around">
      <!--店铺 商品提示-->
      <el-col  :span="12">
        <el-card class="box-card">
          <div>
            <h1>店铺及商品提示</h1>
            <h2>您需要关注的店铺信息以及待处理事项</h2>
          </div>
          <div class="store-index-content">
            <p class="store-rompt" @click="toGoodsManager(1)">出售中的商品：
              <span style="color: red;">{{dashBoardData.market_goods}}</span>
            </p>
            <div>
              <el-tag type="success" @click.native="toGoodsManager(0)">仓库待上架货品  {{dashBoardData.pending_goods}}</el-tag>
              <el-tag type="success" @click.native="toConsumerMsg">待回复的咨询 {{dashBoardData.pending_member_ask}}</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <!--商城公告-->
      <el-col :span="12">
        <el-card class="box-card">
          <div>
            <h1>商城公告</h1>
            <h2>您可以关注商城公告，以便能更快的了解商城的信息</h2>
          </div>
          <p class="store-bulletin" v-for="row in shop_announcement">》
            <a @click="showArticleContext(row)" :title="row.content">{{row.article_name}}</a>
          </p>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" type="flex" justify="space-around">
      <!--交易提示-->
      <el-col  :span="12">
        <el-card class="box-card">
          <div>
            <h1>交易提示</h1>
            <h2>您需要立即处理的交易订单</h2>
          </div>
          <div class="store-index-content">
            <p class="store-rompt" @click="toOrderList('ALL')">所有的订单：<span style="color: red;">{{dashBoardData.all_orders_num}}</span></p>
            <div>
              <el-tag type="success" @click.native="toOrderList('WAIT_PAY')"> 待付款  {{dashBoardData.wait_pay_order_num}}</el-tag>
              <el-tag type="success" @click.native="toOrderList('WAIT_SHIP')">待发货  {{dashBoardData.wait_ship_order_num}}</el-tag>
              <el-tag type="success" @click.native="toOrderList('WAIT_ROG')"> 待收货  {{dashBoardData.wait_delivery_order_num}}</el-tag>
              <el-tag type="success" @click.native="toRefundOrderList()">     申请售后 {{dashBoardData.after_sale_order_num}}</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <!--平台联系方式-->
      <el-col :span="12">
        <el-card class="box-card">
          <div>
            <h1>平台联系方式</h1>
            <h2>可以致电平台联系电话或将建议、问题提交到平台邮箱中</h2>
          </div>
          <ul class="platform-concate">
            <li v-if="concat"><span>{{ concat.article_name }} </span>：<span v-html="concat.content"></span></li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="currentName" :visible.sync="isShowArticle" width="30%" align="center">
      <p v-html="currentContent.replace(/\n/g, '<br>')" class="current-content"></p>
    </el-dialog>
  </div>
</template>

<script>
import * as API_Dashboard from '@/api/dashboard'
import * as API_shop from '@/api/shop'
export default {
  name: 'dashboard',
  mounted() {
    /** 获取首页统计信息 */
    this.GET_DashBoard()

    /** 获取首页商城公告 */
    this.GET_Notice()

    /** 获取首页联系方式 */
    this.GET_Concate()

    window.onresize = this.countTableHeight
  },
  data() {
    return {
      /** 加载中*/
      loading: false,

      /** 商家基本信息 */
      shop_info: this.$store.getters.shopInfo,

      /** 首页统计数据*/
      dashBoardData: {},

      /** 商城公告*/
      shop_announcement: [],

      /** 平台联系方式*/
      concat: null,

      /** 商家图标*/
      fileList: [],

      /** 视图高度*/
      tableHeight: (document.body.clientHeight - 84 - 80 - 80 - 20 - 20 - 4) / 2,

      /** 当前商城公告名称 */
      currentName: '',

      /** 当前商城公告内容 */
      currentContent: '',

      /** 是否显示商城公告 默认不显示 */
      isShowArticle: false
    }
  },
  computed: {
    /** 用户信息 */
    user_info() {
      return this.$store.getters.user
    }
  },
  beforeRouteEnter(to, form, next) {
    next(vm => {
      vm.$store.dispatch('getShopInfoAction')
    })
  },
  activated() {
    this.shop_info = this.$store.getters.shopInfo
  },
  methods: {
    /** 窗口缩放时计算table高度 */
    countTableHeight() {
      this.tableHeight = (document.body.clientHeight - 84 - 80 - 80 - 20 - 20 - 4) / 2
    },

    /** 获得首页统计信息*/
    GET_DashBoard() {
      this.loading = true
      API_Dashboard.getDashboardData().then(response => {
        this.loading = false
        this.dashBoardData = response
      })
    },

    /** 获取首页 商城公告 */
    GET_Notice() {
      this.loading = true
      const category_type = 'NOTICE'
      API_Dashboard.getNotice(category_type, {}).then((response) => {
        this.loading = false
        this.shop_announcement = response
      })
    },

    /** 获取首页 平台联系方式 */
    GET_Concate() {
      this.loading = true
      API_Dashboard.getConcate({ position: 'CONTACT_INFORMATION' }).then((response) => {
        this.loading = false
        this.concat = response
      })
    },

    /** 店铺LOGO上传 */
    // toChangeShopIcon() {
    //   this.$refs.uploadBtn.click()
    // },

    /** 图片上传之前的校验 */
    handleShopLogoBefore(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      if (!isImage) {
        this.$message.error('上传头像图片只能是 JPG、JPEG或PNG格式!')
        return isImage
      }
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = (event) => {
          let image = new Image()
          image.onload = () => {
            let width = image.width
            let height = image.height
            if (width > 300 || width < 200) {
              this.$message.error('图片宽度必须在200~300之间！')
              reject()
            }
            if (height > 100 || height < 50) {
              this.$message.error('图片高度必须在50~100之间！')
              reject()
            }
            resolve()
          }
          image.src = event.target.result
        }
        reader.readAsDataURL(file)
      })
    },

    /** 上传成功后的钩子 更换图片 置空存储数组*/
    uploaded(response) {
      this.shop_info.shop_logo = response.url
      this.fileList = []
      API_shop.updateShopLogo({ logo: response.url }).then(() => {
        this.$message.success('店铺LOGO修改成功')
        this.$store.dispatch('getShopInfoAction')
      })
    },

    /** 跳转商品列表*/
    toGoodsManager(goodsStatus) {
      const result = this.$store.getters.addRouters.some(key => {
        if (key.name === 'goods' && key.children) {
          return key.children.some(item => item.name === 'goodsList')
        }
        return false
      })
      if (result) {
        this.$router.push({ path: '/goods/goodsList', query: { market_enable: goodsStatus }})
      } else {
        this.$message.error('权限不足，无法查看')
      }
    },

    /** 跳转买家留言 待回复的咨询 */
    toConsumerMsg() {
      const result = this.$store.getters.addRouters.some(key => {
        if (key.name === 'member' && key.children) {
          return key.children.some(item => item.name === 'goodsComment')
        }
        return false
      })
      if (result) {
        this.$router.push({ path: '/member/goodsComment/goods-ask-list' })
      } else {
        this.$message.error('权限不足，无法查看')
      }
    },
    /** 跳转订单列表*/
    toOrderList(orderStatus) {
      const result = this.$store.getters.addRouters.some(key => {
        if (key.name === 'order' && key.children) {
          return key.children.some(item => item.name === 'orderList')
        }
        return false
      })
      if (result) {
        this.$router.push({ path: '/order/orderList', query: { order_status: orderStatus }})
      } else {
        this.$message.error('权限不足，无法查看')
      }
    },

    /** 跳转维权订单*/
    toRefundOrderList() {
      const result = this.$store.getters.addRouters.some(key => {
        if (key.name === 'order' && key.children) {
          return key.children.some(item => item.name === 'refundList')
        }
        return false
      })
      if (result) {
        this.$router.push({ path: '/order/refundList' })
      } else {
        this.$message.error('权限不足，无法查看')
      }
    },

    /** 显示商城公告 */
    showArticleContext(row) {
      this.currentName = row.article_name
      this.currentContent = row.content
      this.isShowArticle = true
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>

  .dashboard-container {
    height: 100%;
    background-color: #fff;
    /deep/ .el-card__body {
      min-height: 300px;
      padding: 10px;
    }
  }

  /deep/ .el-row {
    position: relative;
    margin: 0 3px 20px 3px !important;
  }
  .el-col {
    border-radius: 4px;
  }

  /*商家基本信息*/
  div.grid-content {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;

    /*logo*/
    .logo {
      flex-grow: 1;
      padding: 15px;
      position: relative;
      box-sizing: content-box;
      div.shop-img-icon {
        width: 200px;
        &:hover span.to-change-shop-icon {
          display: block;
        }
        span.to-change-shop-icon {
          display: none;
          position: absolute;
          left: 16px;
          bottom: 20px;
          z-index: 10;
          width: 200px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 12px;
          font-weight: normal;
          background: rgba(33, 33, 33, .6);
          color: #fff;
          cursor: pointer;
        }
        img {
          width: 200px;
          height: 80px;
          cursor: pointer;
          border: 1px solid #999;
        }
      }
    }

    /*商家信息*/
    .shop-info {
      flex-grow: 40;
      padding-top: 30px;
      /*商家主营信息*/
      .shop-info-basic {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        span:first-child {
          color: #333;
          font: 18px/36px "microsoft yahei";
          letter-spacing: normal;
          vertical-align: bottom;
          word-spacing: normal;
        }
        span:last-child {
          color: #999;
          font-size: 12px;
          letter-spacing: normal;
          line-height: 28px;
          margin-left: 12px;
          vertical-align: bottom;
          word-spacing: normal;
        }
      }
    }

  }

  /* 店铺商品提示/交易订单提示*/
  h1 {
    border-left: 3px solid #28b779;
    font: 16px/18px "microsoft yahei";
    height: 18px;
    margin-bottom: 4px;
    padding-left: 6px;
  }
  /*副标题*/
  h2 {
    color: #aaa;
    font: 12px/16px "microsoft yahei";
    margin: 10px 0;
  }
  /* 店铺/交易提示内容 */
  .store-index-content {
    margin: 20px 0;
    overflow: hidden;
    .store-rompt {
      clear: both;
      display: block;
      overflow: hidden;
      margin-bottom: 10px;
      padding: 10px;
      background-color: #fcf8e3;
      border: 1px solid #fbeed5;
      cursor: pointer;
    }
    /** 标签 */
    .el-tag {
      cursor: pointer;
    }
  }
  /*商城公告*/
  .store-bulletin {
    color: #aaa;
    cursor: pointer;
    font: 12px/16px "microsoft yahei";
    margin: 10px 0;
    &:hover a {
      color: #337ab7;
    }
  }

  /*平台联系方式*/
  .platform-concate {
    padding: 0;
    li {
      list-style: none;
      margin: 0;
      color: #aaa;
      font: 12px/16px "microsoft yahei";
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      span {
        display: inline-block;
        /deep/ p {
          margin: 0;
        }
      }
    }
  }
  .current-content {
    word-break: break-all;
    text-align: left;
    text-indent: 20px;
  }
</style>
