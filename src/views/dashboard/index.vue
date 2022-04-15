<template>
  <div class="dashboard-container" v-loading="loading">
    <el-row :gutter="20" type="flex" justify="space-around">
      <!--Store merchandise tips-->
      <el-col  :span="12">
        <el-card class="box-card">
          <div>
            <h1>Shop and merchandise tips</h1>
            <h2>The store information you need to pay attention to and the pending issues</h2>
          </div>
          <div class="store-index-content">
            <p class="store-rompt" @click="toGoodsManager(1)">Goods on sale：
              <span style="color: red;">{{dashBoardData.market_goods}}</span>
            </p>
            <div>
              <el-tag type="success" @click.native="toGoodsManager(0)">The warehouse is ready to stock{{dashBoardData.pending_goods}}</el-tag>
              <el-tag type="success" @click.native="toConsumerMsg">Inquiries to be replied to{{dashBoardData.pending_member_ask}}</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <!--notes-->
      <el-col :span="12">
        <el-card class="box-card">
          <div>
            <h1>notes</h1>
            <h2>You can pay attention to the mall announcement, in order to be able to understand the mall information faster</h2>
          </div>
          <p class="store-bulletin" v-for="row in shop_announcement">》
            <a @click="showArticleContext(row)" :title="row.content">{{row.article_name}}</a>
          </p>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" type="flex" justify="space-around">
      <!--Trading tips-->
      <el-col  :span="12">
        <el-card class="box-card">
          <div>
            <h1>Trading tips</h1>
            <h2>The transaction order that you need to process immediately</h2>
          </div>
          <div class="store-index-content">
            <p class="store-rompt" @click="toOrderList('ALL')">All orders：<span style="color: red;">{{dashBoardData.all_orders_num}}</span></p>
            <div>
              <el-tag type="success" @click.native="toOrderList('WAIT_PAY')"> For the payment{{dashBoardData.wait_pay_order_num}}</el-tag>
              <el-tag type="success" @click.native="toOrderList('WAIT_SHIP')">To send the goods{{dashBoardData.wait_ship_order_num}}</el-tag>
              <el-tag type="success" @click.native="toOrderList('WAIT_ROG')"> For the goods{{dashBoardData.wait_delivery_order_num}}</el-tag>
              <el-tag type="success" @click.native="toRefundOrderList()">     Apply for after sales{{dashBoardData.after_sale_order_num}}</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <!--Platform contact Information-->
      <el-col :span="12">
        <el-card class="box-card">
          <div>
            <h1>Platform contact Information</h1>
            <h2>You can call the platform to contact the number or will advise、The problem is submitted to the platform mailbox</h2>
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
    /** Get home page statistics*/
    this.GET_DashBoard()

    /** Get home mall announcement*/
    this.GET_Notice()

    /** Get home contact information*/
    this.GET_Concate()

    window.onresize = this.countTableHeight
  },
  data() {
    return {
      /** In the load*/
      loading: false,

      /** Basic information of merchants*/
      shop_info: this.$store.getters.shopInfo,

      /** Home page statistics*/
      dashBoardData: {},

      /** notes*/
      shop_announcement: [],

      /** Platform contact Information*/
      concat: null,

      /** Merchants icon*/
      fileList: [],

      /** Height of the view*/
      tableHeight: (document.body.clientHeight - 84 - 80 - 80 - 20 - 20 - 4) / 2,

      /** The current mall announcement name*/
      currentName: '',

      /** Current mall announcement content*/
      currentContent: '',

      /** Display Mall bulletin By default, the bulletin is not displayed*/
      isShowArticle: false
    }
  },
  computed: {
    /** The user information*/
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
    /** Calculated when the window is zoomedtablehighly*/
    countTableHeight() {
      this.tableHeight = (document.body.clientHeight - 84 - 80 - 80 - 20 - 20 - 4) / 2
    },

    /** Get home page statistics*/
    GET_DashBoard() {
      this.loading = true
      API_Dashboard.getDashboardData().then(response => {
        this.loading = false
        this.dashBoardData = response
      })
    },

    /** Get home mall announcement*/
    GET_Notice() {
      this.loading = true
      const category_type = 'NOTICE'
      API_Dashboard.getNotice(category_type, {}).then((response) => {
        this.loading = false
        this.shop_announcement = response
      })
    },

    /** Get home platform contact information*/
    GET_Concate() {
      this.loading = true
      API_Dashboard.getConcate({ position: 'CONTACT_INFORMATION' }).then((response) => {
        this.loading = false
        this.concat = response
      })
    },

    /** The storeLOGOupload*/
    // toChangeShopIcon() {
    //   this.$refs.uploadBtn.click()
    // },

    /** Verify images before uploading*/
    handleShopLogoBefore(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      if (!isImage) {
        this.$message.error('Profile pictures can only be uploadedJPG、JPEGorPNGFormat!')
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
              this.$message.error('The image width must be within200~300between！')
              reject()
            }
            if (height > 100 || height < 50) {
              this.$message.error('The image height must be within50~100between！')
              reject()
            }
            resolve()
          }
          image.src = event.target.result
        }
        reader.readAsDataURL(file)
      })
    },

    /** After a successful upload the hook replaces the picture empty storage array*/
    uploaded(response) {
      this.shop_info.shop_logo = response.url
      this.fileList = []
      API_shop.updateShopLogo({ logo: response.url }).then(() => {
        this.$message.success('The storeLOGOModify the success')
        this.$store.dispatch('getShopInfoAction')
      })
    },

    /** Jump to the list of items*/
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
        this.$message.error('Insufficient permissions to view')
      }
    },

    /** Jump buyer message to reply to the consultation*/
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
        this.$message.error('Insufficient permissions to view')
      }
    },
    /** Jump to order list*/
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
        this.$message.error('Insufficient permissions to view')
      }
    },

    /** Jump rights order*/
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
        this.$message.error('Insufficient permissions to view')
      }
    },

    /** Display Mall Announcement*/
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

  /*Basic information of merchants*/
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

    /*Business information*/
    .shop-info {
      flex-grow: 40;
      padding-top: 30px;
      /*Merchants Main information*/
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

  /* Store merchandise tips/Trade Order Reminder*/
  h1 {
    border-left: 3px solid #28b779;
    font: 16px/18px "microsoft yahei";
    height: 18px;
    margin-bottom: 4px;
    padding-left: 6px;
  }
  /*subtitle*/
  h2 {
    color: #aaa;
    font: 12px/16px "microsoft yahei";
    margin: 10px 0;
  }
  /* The store/Content of Trade Notice*/
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
    /** The label*/
    .el-tag {
      cursor: pointer;
    }
  }
  /*notes*/
  .store-bulletin {
    color: #aaa;
    cursor: pointer;
    font: 12px/16px "microsoft yahei";
    margin: 10px 0;
    &:hover a {
      color: #337ab7;
    }
  }

  /*Platform contact Information*/
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
