<template>
  <div class="bg-group-buy">
    <el-form ref="gruopBuyForm" :model="gruopBuyForm" :rules="rules" label-width="120px" status-icon>
      <!--团购活动-->
      <el-form-item label="团购活动" prop="act_id">
        <el-select v-model="gruopBuyForm.act_id" placeholder="选择要参加的团购活动及时间段">
          <el-option
            v-for="item in gruopBuyActivitys"
            :key="item.act_id"
            :label="item.activity_desc"
            :value="item.act_id">
          </el-option>
        </el-select>
        <span class="activity-tip">选择要参加的团购活动及时间段</span>
      </el-form-item>
      <!--团购名称-->
      <el-form-item label="团购名称" prop="gb_name">
        <el-input
          v-model="gruopBuyForm.gb_name"
          :style="{ width:inputLength +'px' }"
          maxlength="30"
          @change="() => { gruopBuyForm.gb_name = gruopBuyForm.gb_name.trim() }"
          placeholder="团购标题名称长度最多可输入30个字符">
        </el-input>
        <span class="activity-tip">团购标题名称长度最多可输入30个字符</span>
      </el-form-item>
      <!--团购标题-->
      <el-form-item label="团购标题">
        <el-input
          v-model="gruopBuyForm.gb_title"
          :style="{ width:inputLength +'px' }"
          maxlength="200"
          placeholder="团购标题针对团购特殊说明,限200字">
        </el-input>
        <span class="activity-tip">团购标题针对团购特殊说明</span>
      </el-form-item>
      <!--团购商品-->
      <el-form-item label="团购商品" prop="goods_name">
        <el-button v-if="gruopBuyForm.goods_name" type="primary" @click="chooseGroupBuyGoods" >
          {{ gruopBuyForm.goods_name }}
        </el-button>
        <el-button v-else type="primary" @click="chooseGroupBuyGoods" >
          选择商品
        </el-button>
        <span class="activity-tip">
          点击上方输入框从已发布商品中选择要参加团购的商品，如没有找到您想要参加团购的商品，请重新发布该商品后再选择。
        </span>
      </el-form-item>
      <!--店铺价格-->
      <el-form-item label="店铺价格" v-if="gruopBuyForm.original_price">
        <span>{{ gruopBuyForm.original_price | unitPrice('￥')}}</span>
      </el-form-item>
      <!--团购价格-->
      <el-form-item label="团购价格" prop="price">
        <el-input
          type="text"
          :style="{ width:inputLength +'px' }"
          v-model="gruopBuyForm.price">
        </el-input>
        <span class="activity-tip">
          团购价格为该商品参加活动时的促销价格必须是0.01~1000000000之间的数字(单位：元)
        </span>
      </el-form-item>
      <!--团购图片-->
      <el-form-item label="团购图片" prop="img_url">
        <el-upload
          class="upload-demo"
          :action="`${MixinUploadApi}?scene=goods`"
          :file-list="fileList"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-upload="handleImagesGbBefore"
          list-type="picture">
          <span v-model="gruopBuyForm.img_url"></span>
          <el-button type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">建议上传图片尺寸为正方形，且宽高误差应在0～50之间</div>
        </el-upload>
      </el-form-item>
      <!--商品库存数-->
      <el-form-item label="商品库存数" v-if="gruopBuyForm.goods_stock || gruopBuyForm.quantity">
        <span>{{ gruopBuyForm.goods_stock || gruopBuyForm.quantity }}</span>
      </el-form-item>
      <!--商品总数-->
      <el-form-item label="商品总数" prop="goods_num">
        <el-input :style="{ width:inputLength +'px' }"  v-model="gruopBuyForm.goods_num"></el-input>
        <span class="activity-tip">团购商品总数应等于或小于该商品库存数量，请提前确认要参与活动的商品库存数量足够充足</span>
      </el-form-item>
      <!--团购分类-->
	    <el-form-item label="团购分类" prop="cat_id">
        <el-select v-model="gruopBuyForm.cat_id" placeholder="请选择">
          <el-option
            v-for="item in groupBuyCategorys"
            :key="item.cat_id"
            :label="item.cat_name"
            :value="item.cat_id">
          </el-option>
        </el-select>
        <span class="activity-tip">请选择团购商品的所属类别</span>
      </el-form-item>
      <!--虚拟数量-->
      <el-form-item label="虚拟数量" prop="visual_num">
        <el-input
          v-model="gruopBuyForm.visual_num"
          :style="{ width:inputLength +'px' }"
          placeholder="虚拟购买数量，只用于前台显示，不影响成交记录"></el-input>
        <span class="activity-tip">虚拟购买数量，只用于前台显示，不影响成交记录</span>
      </el-form-item>
      <!--限购数量-->
      <el-form-item label="限购数量" prop="limit_num">
        <el-input
          v-model="gruopBuyForm.limit_num"
          :style="{ width:inputLength +'px' }"
          placeholder="每个ID单笔订单可团购的最大数量，不限数量请填 '0'"></el-input>
        <span class="activity-tip">每个ID单笔订单可团购的最大数量，不限数量请填 '0'</span>
      </el-form-item>
      <!--团购介绍-->
      <el-form-item label="团购介绍">
        <UE ref="UE" :defaultMsg ="gruopBuyForm.remark"></UE>
      </el-form-item>
      <!--查看用户注册协议-->
      <el-form-item prop="is_allow_agreement">
        <el-checkbox
          :checked="gruopBuyForm.is_allow_agreement"
          v-model="gruopBuyForm.is_allow_agreement"
          class="is-allow-agreement">
          我已阅读<el-button type="text" @click="lookAgreement">《团购服务协议》</el-button>并同意
        </el-checkbox>
      </el-form-item>
      <!--操作-->
      <el-form-item>
        <el-button type="primary" @click="handleSaveGroupBuyGoods">提交</el-button>
      </el-form-item>
    </el-form>
    <!--商品选择器-->
    <en-goods-picker
      type="seller"
      goods-type="NORMAL"
      :show="showDialog"
      :api="goodsApi"
      :categoryApi="categoryApi"
      :multipleApi="multipleApi"
      :limit="maxsize"
      @confirm="refreshFunc"
      @close="showDialog = false"/>
    <!--用户注册协议-->
    <el-dialog
      title="团购服务协议"
      :visible.sync="showAgreement"
      width="50%"
      center
      :before-close="handleAgreementClose">
      <div v-html="agreement_content"></div>
      <span slot="footer" class="dialog-footer">
    <el-button type="danger" @click="allowContinue">同意并继续</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_groupBuy from '@/api/groupBuy'
  import * as API_Dashboard from '@/api/dashboard'
  import { unixToDate } from '@/utils/index'
  import { RegExp } from '~/ui-utils'
  import { UE } from '@/components'
  export default {
    name: 'addGroupBuyGoods',
    components: {
      [UE.name]: UE
    },
    data() {
      const checkGroupBuyPrice = (rule, value, callback) => {
        if (!value) {
          callback(new Error('团购价格不能为空'))
        } else if (!RegExp.money.test(value)) {
          callback(new Error('请输入正确的价格'))
        } else if (this.gruopBuyForm.original_price && parseFloat(value) >= parseFloat(this.gruopBuyForm.original_price)) {
          callback(new Error('团购价格须不得超过或者等于商品原价'))
        } else if (value < 0.01 || value > 1000000000) {
          callback(new Error('团购价格须在0.01～1000000 之间'))
        } else {
          callback()
        }
      }
      const checkGoodsSummary = (rule, value, callback) => {
        if (!value) {
          callback(new Error('商品总数不能为空'))
        } else if (!RegExp.integer.test(value)) {
          callback(new Error('请输入正整数'))
        } else if (parseInt(value) < 1) {
          callback(new Error('商品总数不得小于1'))
        } else if (parseInt(value) > parseInt(this.gruopBuyForm.goods_stock)) {
          callback(new Error('商品总数不能大于商品库存数'))
        } else {
          callback()
        }
      }
      const checkGroupImage = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请上传团购图片'))
        } else {
          callback()
        }
      }
      const checkVisualNum = (rule, value, callback) => {
        if (!RegExp.integer.test(value) && value !== 0) {
          callback(new Error('请输入整数'))
        } else {
          callback()
        }
      }
      const checkLimitNum = (rule, value, callback) => {
        if (value && !/^[0-9]\d*$/g.test(value)) {
          callback(new Error('请输入整数'))
        } else if (parseInt(value) > parseInt(this.gruopBuyForm.goods_num)) {
          callback(new Error('限购数量不能大于商品总数数'))
        } else {
          callback()
        }
      }
      const checkAgreement = (rule, value, callback) => {
        if (!this.gruopBuyForm.is_allow_agreement) {
          callback(new Error('请阅读用户注册协议，并自行决定是否勾选'))
        } else {
          callback()
        }
      }

      return {
        /** 团购图片尺寸宽高误差 */
        IMG_SIZE_ERROR: 50,

        /** input框长度*/
        inputLength: 300,

        /** 是否同意协议*/
        allowAgreement: false,

        /** 显示用户注册协议框*/
        showAgreement: false,

        /** 商品选择器最大长度*/
        maxsize: 1,

        /** 商品选择器列表api*/
        goodsApi: 'seller/goods?market_enable=1&is_auth=1',

        /** 商城分类api */
        categoryApi: 'seller/goods/category/0/children',

        /** 获取多个商品的api */
        multipleApi: 'seller/goods/@ids/details',

        /** 显示/隐藏商品选择器 */
        showDialog: false,

        /** 团购类别*/
        groupBuyCategorys: [],

        /** 团购活动*/
        gruopBuyActivitys: [],

        /** 上传的图片*/
        fileList: [],

        /** 团购活动表单*/
        gruopBuyForm: {
          /** 活动ID */
          act_id: '',

          /** 团购名称 */
          gb_name: '',

          /** 团购副标题 */
          gb_title: '',

          /** 团购商品ID */
          goods_id: '',

          /** 团购商品名称 */
          goods_name: '',

          /** 店铺价格 */
          original_price: '',

          /** 团购价格 */
          price: '',

          /** 团购图片 */
          img_url: [],

          /** 商品库存数 */
          goods_stock: '',

          /** 商品总数 */
          goods_num: '',

          /** 团购类别 */
          cat_id: '',

          /** 虚拟数量 */
          visual_num: 0,

          /** 限购数量 */
          limit_num: 0,

          /** 团购介绍 */
          remark: '',

          /** 是否同意协议 */
          is_allow_agreement: false
        },

        /** 团购服务协议 */
        agreement_content: '',

        /** 表单校验规则 */
        rules: {
          /** 团购活动id */
          act_id: [
            { required: true, message: '请选择团购活动', trigger: 'change' }
          ],

          /** 团购名称 */
          gb_name: [
            { required: true, message: '请填写团购名称', trigger: 'blur' }
          ],

          /** 团购价格 */
          price: [
            { required: true, validator: checkGroupBuyPrice, trigger: 'blur' }
          ],

          /** 团购图片 */
          img_url: [
            { validator: checkGroupImage, trigger: 'change' },
            { required: true, message: '请上传团购图片', trigger: 'change' }
          ],

          /** 团购商品 */
          goods_name: [{ required: true, message: '请上传团购商品', trigger: 'blur' }],

          /** 商品总数 */
          goods_num: [
            { required: true, message: '请填写商品总数', trigger: 'blur' },
            { validator: checkGoodsSummary, trigger: 'blur' }
          ],

          /** 团购分类 */
          cat_id: [{ required: true, message: '请填写团购分类', trigger: 'blur' }],

          /** 虚拟数量 */
          visual_num: [
            { validator: checkVisualNum, trigger: 'change' }
          ],

          /** 限制数量 */
          limit_num: [
            { validator: checkLimitNum, trigger: 'blur' }
          ],

          /** 是否统一协议 */
          is_allow_agreement: [
            { validator: checkAgreement, trigger: 'change' }
          ]
        }
      }
    },
    created() {
      /** 获取团购服务协议 */
      API_Dashboard.getConcate({ position: 'GROUP_BUY_AGREEMENT' }).then((response) => {
        this.agreement_content = response.content
      })
    },
    mounted() {
      setTimeout(() => { this.$refs['gruopBuyForm'].resetFields() })
      this.$route.params.goods_id && this.GET_GroupBuyGoodsDetails(this.$route.params.goods_id)
      this.GET_AllGroupBuyActivitys()
      this.GET_GroupCateGories()
    },
    activated() {
      this.$route.params.goods_id && this.GET_GroupBuyGoodsDetails(this.$route.params.goods_id)
      this.GET_AllGroupBuyActivitys()
      this.GET_GroupCateGories()
    },
    beforeRouteUpdate(to, from, next) {
      to.params.goods_id && this.GET_GroupBuyGoodsDetails(to.params.goods_id)
      this.GET_AllGroupBuyActivitys()
      this.GET_GroupCateGories()
      next()
    },
    methods: {
      /** 获取团购活动列表*/
      // GET_AllGroupBuyActivitys() {
      //   API_groupBuy.getGroupBuyActivesIds(this.$route.query.act_id).then(response => {
      //     this.gruopBuyActivitys = response
      //     this.$set(response, 'activity_desc', `${response.act_name}  ${unixToDate(response.start_time, 'yyyy-MM-dd')}~${unixToDate(response.end_time, 'yyyy-MM-dd')}`)
      //     this.gruopBuyForm.act_id = response.act_id
      //   })
      // },
      /** 获取团购活动列表*/
      GET_AllGroupBuyActivitys() {
        API_groupBuy.getGroupBuyActivityList().then(response => {
          this.gruopBuyActivitys = response
          this.gruopBuyActivitys.forEach(key => {
            this.$set(key, 'activity_desc', `${key.act_name}  ${unixToDate(key.start_time, 'yyyy-MM-dd')}~${unixToDate(key.end_time, 'yyyy-MM-dd')}`)
          })
        })
      },

      /** 获取团购分类 */
      GET_GroupCateGories() {
        API_groupBuy.getGroupCateGoriesList().then(response => {
          this.groupBuyCategorys = response.data
        })
      },

      /** 获取团购商品详情*/
      GET_GroupBuyGoodsDetails(id) {
        API_groupBuy.getGroupBuyGoodsDetails(id, {}).then(response => {
          this.gruopBuyForm = { ...response }
          this.fileList = [{ url: this.gruopBuyForm.img_url }]
        })
      },

      /** 显示商品选择器*/
      chooseGroupBuyGoods() {
        this.showDialog = true
      },

      /** 保存商品选择器选择的商品 */
      refreshFunc(val) {
        let _val = null
        if (Array.isArray(val)) {
          _val = val[0]
        } else {
          _val = val
        }
        if (_val && _val.goods_name) {
          this.gruopBuyForm.goods_id = _val.goods_id
          this.gruopBuyForm.goods_name = _val.goods_name
          this.gruopBuyForm.original_price = _val.price
          this.gruopBuyForm.goods_stock = _val.quantity
        }
      },

      /** 图片上传之前的校验 */
      handleImagesGbBefore(file) {
        return new Promise((resolve, reject) => {
          let reader = new FileReader()
          reader.onload = (event) => {
            let image = new Image()
            image.onload = () => {
              let width = image.width
              let height = image.height
              if (Math.abs(width - height) > this.IMG_SIZE_ERROR) {
                this.$message.warning(`图片尺寸宽高相差误差须小于${this.IMG_SIZE_ERROR}！`)
              }
              resolve()
            }
            image.src = event.target.result
          }
          reader.readAsDataURL(file)
        })
      },

      /** 图片上传成功时的钩子 上传成功校验*/
      handleSuccess(response) {
        this.fileList.shift()
        this.fileList.push(response)
        this.gruopBuyForm.img_url = response.url
        this.$refs['gruopBuyForm'].validateField('img_url')
      },

      /** 文件列表移除文件时的钩子  图片删除校验*/
      handleRemove() {
        this.fileList = []
        this.gruopBuyForm.img_url = ''
        this.$refs['gruopBuyForm'].validateField('img_url')
      },

      /** 查看用户注册协议*/
      lookAgreement() {
        this.showAgreement = true
      },

      /** 用户注册协议关闭触发*/
      handleAgreementClose() {
        this.showAgreement = false
      },

      /** 同意并继续 */
      allowContinue() {
        this.showAgreement = false
        this.gruopBuyForm.is_allow_agreement = true
      },

      /** 保存团购商品*/
      handleSaveGroupBuyGoods() {
        this.$refs['gruopBuyForm'].validate((valid) => {
          if (valid) {
            this.gruopBuyForm.remark = this.$refs.UE.getUEContent()
            if (this.$route.params.goods_id) { // 编辑
              API_groupBuy.saveGroupBuyGoods(this.$route.params.goods_id, this.gruopBuyForm).then(() => {
                this.$message.success('修改成功')
                this.$store.dispatch('delCurrentViews', {
                  view: this.$route,
                  $router: this.$router
                })
                this.$route.params.callback
                this.$router.push({ path: `/promotions/groupBuyManage/group-buy-list` })
              })
            } else { // 新增
              API_groupBuy.addGroupBuyGoods(this.gruopBuyForm).then(() => {
                this.$message.success('添加成功')
                this.$store.dispatch('delCurrentViews', {
                  view: this.$route,
                  $router: this.$router
                })
                this.$route.params.callback
                this.$router.push({ path: `/promotions/groupBuyManage/group-buy-list` })
              })
            }
          }
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .el-form-item  {
    padding-left: 12%;
    border-bottom: 1px dotted #E6E6E6;
    padding-bottom: 15px;
  }
  .bg-group-buy {
    background-color: #fff;
    border: 1px solid #9a9a9a;
    margin: 10px;
    padding: 25px;
  }
  /*商品图片*/
  .goods-image {
    width: 200px;
    height: 200px;
  }
  /*提示信息*/
  span.activity-tip {
    display: block;
    color: #bbb;
    font-size: 12px;
    line-height: 22px;
  }
  /deep/.el-select {
    width: 320px;
  }
  /*团购图片上传组件*/
  .upload-demo {
    width: 30%;
  }

  /*协议*/
  /deep/ .is-allow-agreement {
    /deep/ .el-button--text{
      font-size: 14px;
    }
  }
</style>


