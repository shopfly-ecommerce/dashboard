<template>
  <div class="bg-group-buy">
    <el-form ref="gruopBuyForm" :model="gruopBuyForm" :rules="rules" label-width="120px" status-icon>
      <!--Group-buying activities-->
      <el-form-item label="Group-buying activities" prop="act_id">
        <el-select v-model="gruopBuyForm.act_id" placeholder="Select group buying activities and time periods to participate in">
          <el-option
            v-for="item in gruopBuyActivitys"
            :key="item.act_id"
            :label="item.activity_desc"
            :value="item.act_id">
          </el-option>
        </el-select>
        <span class="activity-tip">Select group buying activities and time periods to participate in</span>
      </el-form-item>
      <!--Group name-->
      <el-form-item label="Group name" prop="gb_name">
        <el-input
          v-model="gruopBuyForm.gb_name"
          :style="{ width:inputLength +'px' }"
          maxlength="30"
          @change="() => { gruopBuyForm.gb_name = gruopBuyForm.gb_name.trim() }"
          placeholder="Group purchase title name length can be entered at most30A character">
        </el-input>
        <span class="activity-tip">Group purchase title name length can be entered at most30A character</span>
      </el-form-item>
      <!--Group-buying title-->
      <el-form-item label="Group-buying title">
        <el-input
          v-model="gruopBuyForm.gb_title"
          :style="{ width:inputLength +'px' }"
          maxlength="200"
          placeholder="Group purchase title for group purchase special description,limit200word">
        </el-input>
        <span class="activity-tip">Group purchase title for group purchase special description</span>
      </el-form-item>
      <!--A bulk goods-->
      <el-form-item label="A bulk goods" prop="goods_name">
        <el-button v-if="gruopBuyForm.goods_name" type="primary" @click="chooseGroupBuyGoods" >
          {{ gruopBuyForm.goods_name }}
        </el-button>
        <el-button v-else type="primary" @click="chooseGroupBuyGoods" >
          Choose goods
        </el-button>
        <span class="activity-tip">
          Click the input box at the top to select the product you want to participate in the group purchase. If you do not find the product you want to participate in the group purchase, please re-publish the product and then select it.
        </span>
      </el-form-item>
      <!--The store price-->
      <el-form-item label="The store price" v-if="gruopBuyForm.original_price">
        <span>{{ gruopBuyForm.original_price | unitPrice('￥')}}</span>
      </el-form-item>
      <!--Group purchase price-->
      <el-form-item label="Group purchase price" prop="price">
        <el-input
          type="text"
          :style="{ width:inputLength +'px' }"
          v-model="gruopBuyForm.price">
        </el-input>
        <span class="activity-tip">
          Group purchase price The promotional price for the product when participating in the event must be0.01~1000000000The number between(unit：USD)
        </span>
      </el-form-item>
      <!--Group photo-->
      <el-form-item label="Group photo" prop="img_url">
        <el-upload
          class="upload-demo"
          :action="`${MixinUploadApi}?scene=goods`"
          :file-list="fileList"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-upload="handleImagesGbBefore"
          list-type="picture">
          <span v-model="gruopBuyForm.img_url"></span>
          <el-button type="primary">upload</el-button>
          <div slot="tip" class="el-upload__tip">It is suggested that the size of uploaded picture should be square and the width and height error should be within0～50between</div>
        </el-upload>
      </el-form-item>
      <!--Merchandise inventory-->
      <el-form-item label="Merchandise inventory" v-if="gruopBuyForm.goods_stock || gruopBuyForm.quantity">
        <span>{{ gruopBuyForm.goods_stock || gruopBuyForm.quantity }}</span>
      </el-form-item>
      <!--The total number of goods-->
      <el-form-item label="The total number of goods" prop="goods_num">
        <el-input :style="{ width:inputLength +'px' }"  v-model="gruopBuyForm.goods_num"></el-input>
        <span class="activity-tip">The total number of commodities should be equal to or less than the inventory quantity of the commodities. Please confirm in advance that the inventory quantity of the commodities to participate in the activity is sufficient</span>
      </el-form-item>
      <!--Group classification-->
	    <el-form-item label="Group classification" prop="cat_id">
        <el-select v-model="gruopBuyForm.cat_id" placeholder="Please select">
          <el-option
            v-for="item in groupBuyCategorys"
            :key="item.cat_id"
            :label="item.cat_name"
            :value="item.cat_id">
          </el-option>
        </el-select>
        <span class="activity-tip">Please select the category of the group purchase item</span>
      </el-form-item>
      <!--Number of virtual-->
      <el-form-item label="Number of virtual" prop="visual_num">
        <el-input
          v-model="gruopBuyForm.visual_num"
          :style="{ width:inputLength +'px' }"
          placeholder="Virtual purchase quantity, only used for foreground display, does not affect the transaction record"></el-input>
        <span class="activity-tip">Virtual purchase quantity, only used for foreground display, does not affect the transaction record</span>
      </el-form-item>
      <!--The amount for purchasing-->
      <el-form-item label="The amount for purchasing" prop="limit_num">
        <el-input
          v-model="gruopBuyForm.limit_num"
          :style="{ width:inputLength +'px' }"
          placeholder="eachIDMaximum quantity of group purchase for a single order, unlimited quantity please fill in'0'"></el-input>
        <span class="activity-tip">eachIDMaximum quantity of group purchase for a single order, unlimited quantity please fill in'0'</span>
      </el-form-item>
      <!--Group-buying is introduced-->
      <el-form-item label="Group-buying is introduced">
        <UE ref="UE" :defaultMsg ="gruopBuyForm.remark"></UE>
      </el-form-item>
      <!--View the user registration protocol-->
      <el-form-item prop="is_allow_agreement">
        <el-checkbox
          :checked="gruopBuyForm.is_allow_agreement"
          v-model="gruopBuyForm.is_allow_agreement"
          class="is-allow-agreement">
          I have read<el-button type="text" @click="lookAgreement">《Group Purchase Service Agreement》</el-button>And I agree to
        </el-checkbox>
      </el-form-item>
      <!--Operation-->
      <el-form-item>
        <el-button type="primary" @click="handleSaveGroupBuyGoods">submit</el-button>
      </el-form-item>
    </el-form>
    <!--Commodity selector-->
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
    <!--User Registration Agreement-->
    <el-dialog
      title="Group Purchase Service Agreement"
      :visible.sync="showAgreement"
      width="50%"
      center
      :before-close="handleAgreementClose">
      <div v-html="agreement_content"></div>
      <span slot="footer" class="dialog-footer">
    <el-button type="danger" @click="allowContinue">Agree</el-button>
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
          callback(new Error('The group purchase price cannot be empty'))
        } else if (!RegExp.money.test(value)) {
          callback(new Error('Please enter the correct price'))
        } else if (this.gruopBuyForm.original_price && parseFloat(value) >= parseFloat(this.gruopBuyForm.original_price)) {
          callback(new Error('The group purchase price shall not exceed or equal to the original price of the product'))
        } else if (value < 0.01 || value > 1000000000) {
          callback(new Error('Group purchase price must be at0.01～1000000 between'))
        } else {
          callback()
        }
      }
      const checkGoodsSummary = (rule, value, callback) => {
        if (!value) {
          callback(new Error('The total number of items cannot be empty'))
        } else if (!RegExp.integer.test(value)) {
          callback(new Error('Please enter a positive integer'))
        } else if (parseInt(value) < 1) {
          callback(new Error('The total number of goods shall not be less than1'))
        } else if (parseInt(value) > parseInt(this.gruopBuyForm.goods_stock)) {
          callback(new Error('The total number of goods must not be greater than the number of goods in stock'))
        } else {
          callback()
        }
      }
      const checkGroupImage = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please upload pictures of group purchase'))
        } else {
          callback()
        }
      }
      const checkVisualNum = (rule, value, callback) => {
        if (!RegExp.integer.test(value) && value !== 0) {
          callback(new Error('Please enter an integer'))
        } else {
          callback()
        }
      }
      const checkLimitNum = (rule, value, callback) => {
        if (value && !/^[0-9]\d*$/g.test(value)) {
          callback(new Error('Please enter an integer'))
        } else if (parseInt(value) > parseInt(this.gruopBuyForm.goods_num)) {
          callback(new Error('The quantity limited shall not be greater than the total number of goods'))
        } else {
          callback()
        }
      }
      const checkAgreement = (rule, value, callback) => {
        if (!this.gruopBuyForm.is_allow_agreement) {
          callback(new Error('Please read the user registration agreement and check it at your discretion'))
        } else {
          callback()
        }
      }

      return {
        /** Group purchase picture size width and height error*/
        IMG_SIZE_ERROR: 50,

        /** inputThe length of the frame*/
        inputLength: 300,

        /** Agree or Disagree to the Agreement*/
        allowAgreement: false,

        /** Displays the user registration protocol box*/
        showAgreement: false,

        /** Maximum length of commodity selector*/
        maxsize: 1,

        /** Product selector listapi*/
        goodsApi: 'seller/goods?market_enable=1&is_auth=1',

        /** Mall classificationapi */
        categoryApi: 'seller/goods/category/0/children',

        /** Obtain multiple goodsapi */
        multipleApi: 'seller/goods/@ids/details',

        /** According to/Hide the product selector*/
        showDialog: false,

        /** Group-buying category*/
        groupBuyCategorys: [],

        /** Group-buying activities*/
        gruopBuyActivitys: [],

        /** Uploaded pictures*/
        fileList: [],

        /** Group purchase activity form*/
        gruopBuyForm: {
          /** activityID */
          act_id: '',

          /** Group name*/
          gb_name: '',

          /** Groupon subtitle*/
          gb_title: '',

          /** A bulk goodsID */
          goods_id: '',

          /** Group purchase product name*/
          goods_name: '',

          /** The store price*/
          original_price: '',

          /** Group purchase price*/
          price: '',

          /** Group photo*/
          img_url: [],

          /** Merchandise inventory*/
          goods_stock: '',

          /** The total number of goods*/
          goods_num: '',

          /** Group-buying category*/
          cat_id: '',

          /** Number of virtual*/
          visual_num: 0,

          /** The amount for purchasing*/
          limit_num: 0,

          /** Group-buying is introduced*/
          remark: '',

          /** Agree or Disagree to the Agreement*/
          is_allow_agreement: false
        },

        /** Group Purchase Service Agreement*/
        agreement_content: '',

        /** Form check rule*/
        rules: {
          /** Group-buying activitiesid */
          act_id: [
            { required: true, message: 'Please select the group purchase activity', trigger: 'change' }
          ],

          /** Group name*/
          gb_name: [
            { required: true, message: 'Please fill in the name of the group purchase', trigger: 'blur' }
          ],

          /** Group purchase price*/
          price: [
            { required: true, validator: checkGroupBuyPrice, trigger: 'blur' }
          ],

          /** Group photo*/
          img_url: [
            { validator: checkGroupImage, trigger: 'change' },
            { required: true, message: 'Please upload pictures of group purchase', trigger: 'change' }
          ],

          /** A bulk goods*/
          goods_name: [{ required: true, message: 'Please upload group purchase products', trigger: 'blur' }],

          /** The total number of goods*/
          goods_num: [
            { required: true, message: 'Please fill in the total number of goods', trigger: 'blur' },
            { validator: checkGoodsSummary, trigger: 'blur' }
          ],

          /** Group classification*/
          cat_id: [{ required: true, message: 'Please fill in the group purchase category', trigger: 'blur' }],

          /** Number of virtual*/
          visual_num: [
            { validator: checkVisualNum, trigger: 'change' }
          ],

          /** Limit the number of*/
          limit_num: [
            { validator: checkLimitNum, trigger: 'blur' }
          ],

          /** Uniform Agreement*/
          is_allow_agreement: [
            { validator: checkAgreement, trigger: 'change' }
          ]
        }
      }
    },
    created() {
      /** Get a group purchase service agreement*/
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
      /** Get a list of group purchase activities*/
      // GET_AllGroupBuyActivitys() {
      //   API_groupBuy.getGroupBuyActivesIds(this.$route.query.act_id).then(response => {
      //     this.gruopBuyActivitys = response
      //     this.$set(response, 'activity_desc', `${response.act_name}  ${unixToDate(response.start_time, 'yyyy-MM-dd')}~${unixToDate(response.end_time, 'yyyy-MM-dd')}`)
      //     this.gruopBuyForm.act_id = response.act_id
      //   })
      // },
      /** Get a list of group purchase activities*/
      GET_AllGroupBuyActivitys() {
        API_groupBuy.getGroupBuyActivityList().then(response => {
          this.gruopBuyActivitys = response
          this.gruopBuyActivitys.forEach(key => {
            this.$set(key, 'activity_desc', `${key.act_name}  ${unixToDate(key.start_time, 'yyyy-MM-dd')}~${unixToDate(key.end_time, 'yyyy-MM-dd')}`)
          })
        })
      },

      /** Get group-buying categories*/
      GET_GroupCateGories() {
        API_groupBuy.getGroupCateGoriesList().then(response => {
          this.groupBuyCategorys = response.data
        })
      },

      /** Get details of group purchase products*/
      GET_GroupBuyGoodsDetails(id) {
        API_groupBuy.getGroupBuyGoodsDetails(id, {}).then(response => {
          this.gruopBuyForm = { ...response }
          this.fileList = [{ url: this.gruopBuyForm.img_url }]
        })
      },

      /** Displays the product selector*/
      chooseGroupBuyGoods() {
        this.showDialog = true
      },

      /** Save the item selected by the commodity selector*/
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

      /** Verify images before uploading*/
      handleImagesGbBefore(file) {
        return new Promise((resolve, reject) => {
          let reader = new FileReader()
          reader.onload = (event) => {
            let image = new Image()
            image.onload = () => {
              let width = image.width
              let height = image.height
              if (Math.abs(width - height) > this.IMG_SIZE_ERROR) {
                this.$message.warning(`The error of image dimension width and height must be less than${this.IMG_SIZE_ERROR}！`)
              }
              resolve()
            }
            image.src = event.target.result
          }
          reader.readAsDataURL(file)
        })
      },

      /** Hook upload verification when image upload is successful*/
      handleSuccess(response) {
        this.fileList.shift()
        this.fileList.push(response)
        this.gruopBuyForm.img_url = response.url
        this.$refs['gruopBuyForm'].validateField('img_url')
      },

      /** File list remove file when the hook picture delete checksum*/
      handleRemove() {
        this.fileList = []
        this.gruopBuyForm.img_url = ''
        this.$refs['gruopBuyForm'].validateField('img_url')
      },

      /** View the user registration protocol*/
      lookAgreement() {
        this.showAgreement = true
      },

      /** User registration protocol shutdown trigger*/
      handleAgreementClose() {
        this.showAgreement = false
      },

      /** Agree*/
      allowContinue() {
        this.showAgreement = false
        this.gruopBuyForm.is_allow_agreement = true
      },

      /** Save the group purchase*/
      handleSaveGroupBuyGoods() {
        this.$refs['gruopBuyForm'].validate((valid) => {
          if (valid) {
            this.gruopBuyForm.remark = this.$refs.UE.getUEContent()
            if (this.$route.params.goods_id) { // edit
              API_groupBuy.saveGroupBuyGoods(this.$route.params.goods_id, this.gruopBuyForm).then(() => {
                this.$message.success('Modify the success')
                this.$store.dispatch('delCurrentViews', {
                  view: this.$route,
                  $router: this.$router
                })
                this.$route.params.callback
                this.$router.push({ path: `/promotions/groupBuyManage/group-buy-list` })
              })
            } else { // new
              API_groupBuy.addGroupBuyGoods(this.gruopBuyForm).then(() => {
                this.$message.success('Add a success')
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
  /*Commodity images*/
  .goods-image {
    width: 200px;
    height: 200px;
  }
  /*Prompt information*/
  span.activity-tip {
    display: block;
    color: #bbb;
    font-size: 12px;
    line-height: 22px;
  }
  /deep/.el-select {
    width: 320px;
  }
  /*Group photo upload component*/
  .upload-demo {
    width: 30%;
  }

  /*agreement*/
  /deep/ .is-allow-agreement {
    /deep/ .el-button--text{
      font-size: 14px;
    }
  }
</style>


