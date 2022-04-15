<template>
  <div v-loading="loading">
    <el-steps :active="activestep" finish-status="success" process-status="process"	 simple style="margin-top: 20px">
      <el-step title="1.Select product category" ></el-step>
      <el-step title="2.Edit basic information" ></el-step>
      <el-step title="3.Edit product details" ></el-step>
    </el-steps>
    <!--steps1-->
    <div class="content-goods-publish" v-show="activestep === 0">
      <div class="goods-category">
        <ul v-if="categoryListLevel1 && categoryListLevel1.length > 0">
          <li
            v-for="(item,index) in categoryListLevel1"
            :class="{'activeClass':index == activeCategoryIndex1}"
            @click="handleSelectCategory(item, index, 1)">
            <span>{{ item.name }}</span> <span>》</span>
          </li>
        </ul>
        <ul v-if="categoryListLevel2 && categoryListLevel2.length > 0">
          <li
            v-for="(item,index) in categoryListLevel2"
            :class="{'activeClass':index == activeCategoryIndex2}"
            @click="handleSelectCategory(item,index, 2)">
            <span>{{ item.name }}</span> <span>》</span>
          </li>
        </ul>
        <ul v-if="categoryListLevel3 && categoryListLevel3.length > 0">
          <li
            v-for="(item,index) in categoryListLevel3"
            :class="{'activeClass':index == activeCategoryIndex3}"
            @click="handleSelectCategory(item,index, 3)">
            <span>{{ item.name }}</span> <span>》</span>
          </li>
        </ul>
      </div>
      <p class="current-goods-category">
        The product category you are currently choosing is：
        <span>{{ activeCategoryName1 }}</span>
        <span v-show="activeCategoryName2"> > {{ activeCategoryName2 }}</span>
        <span v-show="activeCategoryName3"> > {{ activeCategoryName3 }}</span>
      </p>
    </div>
    <!--steps2-->
    <div class="content-goods-publish" v-show="activestep === 1">
      <!--Product details-->
      <el-form
        :model="baseInfoForm"
        status-icon
        :rules="baseInfoFormRule"
        label-position="right"
        ref="baseInfoForm"
        label-width="120px"
        class="demo-ruleForm">
        <!--Product details-->
        <!--The basic information-->
        <div class="base-info-item">
          <h4>The basic information</h4>
          <div>
            <el-form-item class="auth-info" label="Refuse to reason：" v-if="baseInfoForm.is_auth === 2">
              {{ baseInfoForm.auth_message }}
            </el-form-item>
            <el-form-item label="Category：" style="width: 100%; text-align: left;">
              <span>{{ activeCategoryName1 }}</span>
              <span v-show="activeCategoryName2"> > {{ activeCategoryName2 }}</span>
              <span v-show="activeCategoryName3"> > {{ activeCategoryName3 }}</span>
              <span v-if="!activeCategoryName1" v-html="baseInfoForm.category_name"></span>
            </el-form-item>
            <el-form-item label="Brand：" >
              <el-select
                v-model="baseInfoForm.brand_id"
                filterable
                @change="changeGoodsBrand"
                clearable
                placeholder="Please select">
                <el-option
                  v-for="item in brandList"
                  :key="item.brand_id"
                  :label="item.name"
                  :value="item.brand_id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <!--Product information-->
        <div class="base-info-item">
          <h4>Product information</h4>
          <div>
            <el-form-item label="Name：" prop="goods_name" class="goods-name-width">
              <el-input v-model="baseInfoForm.goods_name" @change="() => { baseInfoForm.goods_name = baseInfoForm.goods_name.trim() }" :maxlength="60" :minlength="3" placeholder="3-60A character"></el-input>
            </el-form-item>
            <el-form-item label="SN：" prop="sn">
              <el-input v-model="baseInfoForm.sn" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="Marking price：" prop="mktprice" :maxlength="10">
              <el-input placeholder="Please enter the market price" v-model="baseInfoForm.mktprice">
                <template slot="prepend">¥</template>
              </el-input>
            </el-form-item>
            <el-form-item label="Price：" prop="price" :maxlength="10">
              <el-input placeholder="Please enter the commodity price" v-model="baseInfoForm.price">
                <template slot="prepend">¥</template>
              </el-input>
            </el-form-item>
            <el-form-item label="Cost price：" prop="cost" :maxlength="10">
              <el-input placeholder="Please enter the cost price" v-model="baseInfoForm.cost">
                <template slot="prepend">¥</template>
              </el-input>
            </el-form-item>
            <el-form-item label="Weight：" prop="weight" :maxlength="10">
              <el-input placeholder="Please enter the weight of the item" v-model="baseInfoForm.weight">
                <template slot="prepend">kg</template>
              </el-input>
            </el-form-item>
            <el-form-item label="Commodity images：" prop="goods_gallery" style="width: 90%;text-align: left;">
              <el-upload
                class="avatar-uploader goods-images"
                :action="`${MixinUploadApi}?scene=goods`"
                list-type="picture-card"
                multiple
                :file-list="goodsGalleryList"
                :on-preview="handlePictureCardPreview"
                :before-upload="beforeAvatarUpload"
                :on-remove="handleRemove"
                :on-success="handleSuccess">
                <span style="display: none;"  v-model="baseInfoForm.goods_gallery"></span>
                <i  class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">Recommended to uploadjpg/pngFile, and not exceeding1MB</div>
              </el-upload>
              <el-dialog :visible.sync="dialogImage">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </div>
        </div>
        <!--Sku-->
        <div class="base-info-item">
          <h4>Sku</h4>
          <div>
            <el-form-item label="Sku："  style="width: 90%;text-align: left;">
              <!--Specification selector-->
               <en-sku-selector
                 :categoryId="baseInfoForm.category_id"
                 :goodsId="activeGoodsId"
                 :goodsSn="baseInfoForm.sn"
                 :productSn="productSn"
                 :isEditModel="currentStatus"
                 :goodsSkuInfo="skuList"
                 @finalSku="finalSku"/>
            </el-form-item>
            <el-form-item label="Total inventory：" style="width: 20%;text-align: left;">
              <el-input v-model.number="baseInfoForm.quantity" :disabled="currentStatus === 1 || isEditQuantity"></el-input>
            </el-form-item>
          </div>
        </div>
        <!--seo-->
        <div class="base-info-item">
          <h4>seo</h4>
          <div>
            <el-form-item label="seo title：">
              <el-input placeholder="most60A character" class="seo-text" @change="() => { baseInfoForm.page_title = baseInfoForm.page_title.trim() }" :maxlength="60"  v-model="baseInfoForm.page_title"></el-input>
            </el-form-item>
            <el-form-item label="seokeyword：" >
              <el-input type="textarea" placeholder="most200A character" class="seo-text" rows="5" :maxlength="200" v-model="baseInfoForm.meta_keywords"></el-input>
            </el-form-item>
            <el-form-item label="seo describe：">
              <el-input type="textarea" placeholder="most200A character" class="seo-text" rows="5" :maxlength="200" v-model="baseInfoForm.meta_description"></el-input>
            </el-form-item>
          </div>
        </div>
        <!--Shipping/other-->
        <div class="base-info-item">
          <h4>Shipping/other</h4>
          <div>
            <el-form-item label="freight：" style="width: 50%;" prop="template_id">
              <el-radio-group v-model="baseInfoForm.goods_transfee_charge" @change="changeTplItem">
                <el-radio :label="1">The seller bears the freight</el-radio>
                <el-radio :label="0">Buyer pays freight</el-radio>
              </el-radio-group>
              <el-select
                v-model="baseInfoForm.template_id || 'Please select the freight template'"
                placeholder="Please select the freight template"
                v-show="baseInfoForm.goods_transfee_charge === 0 "
                @change="changeTpl">
                <el-option
                  v-for="item in tplList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <!--Exchange permit self-owned store display-->
        <div class="base-info-item">
          <h4>Point exchange</h4>
          <div>
            <el-form-item label="Status：">
              <el-switch
                v-model="isShowExchangeConfig"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="open"
                inactive-text="close"
                @change="handleSwitchexchange">
              </el-switch>
            </el-form-item>
          </div>
        </div>
        <!--Configuration-->
        <div class="base-info-item" v-if="isShowExchangeConfig">
          <h4>Configuration</h4>
          <div v-if="baseInfoForm.exchange">
            <el-form-item label="Conditions：" style="width: 25%;" prop="exchange_money">
              <el-input placeholder="most10A character" :maxlength="10" v-model="baseInfoForm.exchange.exchange_money" style="width: 100px;"></el-input> USD
            </el-form-item>
            <el-form-item  style="width: 25%;" prop="exchange_point">
              <el-input placeholder="most10A character" :maxlength="10" v-model.number="baseInfoForm.exchange.exchange_point" style="width: 100px;"></el-input> point
            </el-form-item>
            <el-form-item label="Categories：" >
              <el-select
                v-model="baseInfoForm.exchange.category_id"
                placeholder="Please select the points category"
                @change="changeExangeCategory">
                <el-option
                  v-for="item in exchangeGoodsCatrgoryList"
                  :key="item.category_id"
                  :label="item.name"
                  :value="item.category_id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <!--Product parameters-->
        <el-collapse :value="collapseVal">
          <el-collapse-item
            v-for="paramsgroup in  goodsParams"
            v-if="paramsgroup"
            :title="paramsgroup.group_name"
            :key="paramsgroup.group_id"
            :name="paramsgroup.group_id">
            <el-form-item
              v-for="(goods_params_list, index) in baseInfoForm.goods_params_list"
              v-if="goods_params_list && goods_params_list.group_id && paramsgroup.group_id === goods_params_list.group_id"
              :key="index"
              :label="`${goods_params_list.param_name}：`"
              :prop="'goods_params_list.' + index + '.param_value'"
              :rules="goods_params_list.required === 1 ? {required: true, message: `${goods_params_list.param_name}Cant be empty`, trigger: 'change' } : {}">
              <el-input
                placeholder="Maximum length100A character"
                maxlength="100"
                v-if="goods_params_list.param_type === 1"
                v-model="goods_params_list.param_value" >
              </el-input>
              <el-select
                v-if="goods_params_list.param_type === 2"
                v-model="goods_params_list.param_value"
                placeholder="Please select">
                <el-option
                  v-for="(option) in goods_params_list.option_list"
                  :key="option"
                  :label="option"
                  :value="option">
                </el-option>
              </el-select>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>
    <!--steps3-->
    <div class="content-goods-publish" v-if="activestep === 2">
      <el-form
        :model="baseInfoForm"
        label-position="right"
        ref="baseInfoFormIntro"
        label-width="120px"
        class="demo-ruleForm">
        <el-form-item label="Commodity description：" class="goods-intro">
          <UE ref="ue" :defaultMsg="baseInfoForm.intro"></UE>
        </el-form-item>
      </el-form>
    </div>
    <!--At the bottom of the-->
    <div class="footer">
      <el-button-group>
        <el-button type="primary" @click="pre" v-if="activestep === 1 || activestep === 2">Previous</el-button>
        <el-button
          type="primary"
          @click="next"
          v-if="activestep === 0 || activestep === 1">Next</el-button>
        <el-button
          type="primary"
          @click="aboveGoods"
          v-if="activestep === 1 || activestep === 2"
        >save</el-button>
        <el-button
          type="primary"
          @click="handleUnderGoods"
          v-if="currentStatus === 1 && ( activestep === 1 || activestep === 2) && baseInfoForm.market_enable === 1"
        >off</el-button>
        <el-button
          type="primary"
          @click="saveDraft"
          v-if="(currentStatus != 1 && activestep != 0)"
        >Save drafts</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
  import * as API_goods from '@/api/goods'
  import * as API_goodsCategory from '@/api/goodsCategory'
  import { CategoryPicker, SkuSelector, UE } from '@/components'
  import { RegExp } from '~/ui-utils'
  import Sortable from 'sortablejs'
  export default {
    name: 'goodsPublish',
    components: {
      [CategoryPicker.name]: CategoryPicker,
      [SkuSelector.name]: SkuSelector,
      [UE.name]: UE
    },
    data() {
      const checkSn = (rule, value, callback) => {
        if (!value) {
          callback(new Error('The item number cannot be empty'))
        } else if (!/^[a-zA-Z0-9_\\-]+$/g.test(value)) {
          callback(new Error('Please enter the number、The letter、Underline or center line'))
        } else {
          callback()
        }
      }

      const checkMarket = (rule, value, callback) => {
        if (!value && value !== 0) {
          callback(new Error('The market price cannot be empty'))
        } else if (!RegExp.money.test(value)) {
          callback(new Error('Please enter a positive integer or two decimal places'))
        } else if (parseFloat(value) > 99999999) {
          callback(new Error('The price setting exceeds the upper limit'))
        } else {
          callback()
        }
      }

      const checkPrice = (rule, value, callback) => {
        if (!value && value !== 0) {
          return callback(new Error('Commodity prices cannot be empty'))
        }
        setTimeout(() => {
          if (!RegExp.money.test(value)) {
            callback(new Error('Please enter a positive integer or two decimal places'))
          } else if (parseFloat(value) > 99999999) {
            callback(new Error('The price setting exceeds the upper limit'))
          } else {
            callback()
          }
        }, 1000)
      }

      const checkCost = (rule, value, callback) => {
        if (!value && value !== 0) {
          return callback(new Error('The cost price cannot be empty'))
        }
        if (!RegExp.money.test(value)) {
          callback(new Error('Please enter a numeric value'))
        } else if (parseFloat(value) > 99999999) {
          callback(new Error('The price setting exceeds the upper limit'))
        } else {
          callback()
        }
      }

      const checkWeight = (rule, value, callback) => {
        if (!value && typeof value !== 'number') {
          callback(new Error('The weight cannot be empty'))
        } else if (!RegExp.money.test(value)) {
          callback(new Error('Please enter a positive integer or two decimal places'))
        } else {
          callback()
        }
      }

      const checkTplId = (rule, value, callback) => {
        if (this.baseInfoForm.goods_transfee_charge === 0 && !value) {
          return callback(new Error('Please select a template'))
        } else {
          callback()
        }
      }

      // Total inventory
      const checkQuantity = (rule, value, callback) => {
        if (!value) {
          callback(new Error('Please fill in the total inventory'))
        } else if (!RegExp.integer.test(value)) {
          callback(new Error('Please enter greater than0The positive integer'))
        } else {
          if (parseInt(value) > 99999999) {
            callback(new Error('The total inventory shall not be greater than99999999'))
          } else {
            callback()
          }
        }
      }

      const checkExchangePoint = (rule, value, callback) => {
        if (this.baseInfoForm.exchange.enable_exchange && !this.baseInfoForm.exchange.exchange_point) {
          return callback(new Error('The integral cannot be null and cannot be zero0'))
        }
        setTimeout(() => {
          if (!RegExp.integer.test(this.baseInfoForm.exchange.exchange_point)) {
            callback(new Error('Please enter a positive integer'))
          } else {
            if (parseInt(this.baseInfoForm.exchange.exchange_point) <= 0) {
              callback(new Error('Please enter greater than0The integral value of'))
            } else {
              callback()
            }
          }
        }, 1000)
      }

      const checkExchangeMoney = (rule, value, callback) => {
        if (this.baseInfoForm.exchange.exchange_money !== 0 && !this.baseInfoForm.exchange.exchange_money) {
          callback(new Error('The amount of credit required cannot be empty'))
        } else if (!RegExp.money.test(this.baseInfoForm.exchange.exchange_money)) {
          callback(new Error('Please enter the correct amount'))
        } else if (parseFloat(this.baseInfoForm.exchange.exchange_money) >= parseFloat(this.baseInfoForm.price)) {
          callback(new Error('The price of integral goods cannot be higher than the original price of goods'))
        } else {
          callback()
        }
      }

      return {
        /** Store information*/
        shopInfo: this.$store.getters.shopInfo,

        /** Loading... */
        loading: false,

        /** The current state/Mode publishes goods by default0 Edit commodity1 Edit draft box merchandise2 */
        currentStatus: 0,

        /** Current activation steps*/
        activestep: 0,

        /** The previous operation counters by default0time*/
        toPreCount: 0,

        /** Currently clicked1Grade classification index*/
        activeCategoryIndex1: -1,

        /** Currently clicked2Grade classification index*/
        activeCategoryIndex2: -1,

        /** Currently clicked3Grade classification index*/
        activeCategoryIndex3: -1,

        /** Current commodity category name1*/
        activeCategoryName1: '',

        /** Current commodity category name2*/
        activeCategoryName2: '',

        /** Current commodity category name3*/
        activeCategoryName3: '',

        /** The current commodityid*/
        activeGoodsId: '',

        /** 1Classification list*/
        categoryListLevel1: [],

        /** 2Classification list*/
        categoryListLevel2: [],

        /** 3Classification list*/
        categoryListLevel3: [],

        /** Merchandise details submission form*/
        baseInfoForm: {

          /** brandid */
          brand_id: '',

          /** Mall classificationid */
          category_id: 0,

          /** Classification name of mall*/
          category_name: '',

          /** Name*/
          goods_name: '',

          /** SNsn*/
          sn: '',

          /** Price*/
          price: '',

          /** Marking price*/
          mktprice: '',

          /** Cost price*/
          cost: '',

          /** Weight*/
          weight: '',

          /** Product album list*/
          goods_gallery_list: [],

          /** An album of merchandise used for verification*/
          goods_gallery: '',

          /** Gross merchandise inventory*/
          quantity: 0,

          /** The seller bears the freight1 Buyer pays freight0 */
          goods_transfee_charge: 1,

          /** skuData change or combination change judgment0:No change,1：change*/
          has_changed: 0,

          /** Whether its on the shelf,1save0off*/
          market_enable: 1,

          /** The template of freightid */
          template_id: '',

          /** Status*/
          exchange: {
            /** The exchange of points belongs to the classification*/
            category_id: '',

            /** Whether points are allowed to be exchanged1is0no*/
            enable_exchange: 1,

            /** Amount required for exchange*/
            exchange_money: 0,

            /** The credits are exchanged for the credits used*/
            exchange_point: 0
          },

          /** Store groupid*/
          shop_cat_id: 0,

          /** seo describe*/
          meta_description: '',

          /** seokeyword*/
          meta_keywords: '',

          /** seo title*/
          page_title: '',

          /** List of commodity parameters*/
          goods_params_list: [],

          /** skuThe list of*/
          sku_list: [],

          /** Product Description*/
          intro: ''
        },

        /** Temporarily store item album information*/
        goodsGalleryList: [],

        /** The data that is passed to the component*/
        skuList: [],

        /** Whether to automatically generate article number*/
        productSn: false,

        /** Total inventory is editable by default yesfalseeditabletrue不editable*/
        isEditQuantity: false,

        /** A list of requested item parameter sets*/
        goodsParams: [
          {
            group_id: '',
            group_name: '',
            params: [
              {
                param_id: 0,
                param_name: '',
                param_type: 1,
                param_value: '',
                required: 0,
                option_list: [
                  { value: 1, label: '' },
                  { value: 2, label: '' }
                ]
              }
            ]
          }
        ],

        /** */
        collapseVal: [],

        /** Brand list*/
        brandList: [],

        /** Freight template list*/
        tplList: [],

        /** Merchandise List*/
        exchangeGoodsCatrgoryList: [],

        /** Enlargement address of commodity picture*/
        dialogImageUrl: '',

        /** Whether to display an enlarged picture popup*/
        dialogImage: false,

        /** Whether to display the credit configuration*/
        isShowExchangeConfig: false,

        /** Check rules for commodity details*/
        baseInfoFormRule: {
          goods_name: [
            { required: true, message: 'Please enter the name of the item', trigger: 'blur' },
            { whitespace: true, message: 'The name of the item must not be blank', trigger: 'blur' },
            { min: 3, max: 60, message: 'The length of3 to60 A character', trigger: 'blur' }
          ],
          sn: [
            { required: true, message: 'Please enter the item number', trigger: 'blur' },
            { validator: checkSn, trigger: 'blur' }
          ],
          mktprice: [
            { required: true, message: 'Please enter the market price', trigger: 'blur' },
            { validator: checkMarket, trigger: 'blur' }
          ],
          price: [
            { required: true, message: 'Please enter the commodity price', trigger: 'blur' },
            { validator: checkPrice, trigger: 'blur' }
          ],
          cost: [
            { required: true, message: 'Please enter the cost price', trigger: 'blur' },
            { validator: checkCost, trigger: 'blur' }
          ],
          weight: [
            { required: true, message: 'Please enter the weight of the item', trigger: 'blur' },
            { validator: checkWeight, trigger: 'blur' }
          ],
          goods_gallery: [
            { required: true, message: 'Please select the product album', trigger: 'change' }
          ],
          quantity: [
            { required: true, message: 'Please fill in the total inventory', trigger: 'blur' },
            { validator: checkQuantity, trigger: 'blur' }
          ],
          template_id: [
            { validator: checkTplId, trigger: 'blur' }
          ],
          exchange_money: [
            { validator: checkExchangeMoney, trigger: 'blur' }
          ],
          exchange_point: [
            { validator: checkExchangePoint, trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      if (this.$route.params && this.$route.params.goodsid) {
        this.currentStatus = parseInt(this.$route.params.isdraft) || 0
        this.activeGoodsId = this.$route.params.goodsid
        this.activestep = this.$route.params.isdraft ? 1 : 0
        if (this.currentStatus === 1 && this.$route.params.goodsid) {
          this.GET_GoodData()
        } else if (this.currentStatus === 2 && this.$route.params.goodsid) {
          this.GET_GoodDraftData()
        }
      } else {
        this.GET_NextLevelCategory()
      }
    },
    activated() {
      if (this.$route.params && this.$route.params.goodsid) {
        this.currentStatus = parseInt(this.$route.params.isdraft) || 0
        this.activeGoodsId = this.$route.params.goodsid
        this.activestep = this.$route.params.isdraft ? 1 : 0
        if (this.currentStatus === 1 && this.$route.params.goodsid) {
          this.GET_GoodData()
        } else if (this.currentStatus === 2 && this.$route.params.goodsid) {
          this.GET_GoodDraftData()
        }
      } else {
        this.GET_NextLevelCategory()
      }
    },
    methods: {
      /** Previous*/
      pre() {
        this.loading = true
        if (this.activestep === 1) {
          this.toPreCount > 0 ? this.GET_NextLevelCategory() : this.GET_NextLevelCategory(null, 0, true)
          if (this.activestep-- < 0) this.activestep = 0
          this.toPreCount++
          this.loading = false
        } else {
          this.activestep--
          this.loading = false
        }
      },

      /** Next*/
      next() {
        /** 1Level calibration*/
        this.loading = true
        if (this.activestep === 0 && !this.activeCategoryName1) {
          this.$message.error('Please select the product category')
          this.loading = false
          return
        } else if (this.activestep === 0 && this.activeCategoryName1 && this.currentStatus === 0) {
          /** Obtain the commodity parameter information under the mall classification*/
          /** The parameter1 Represents a query add pattern（Publish product model0）Commodity parameter information under；  If not, query editing（Includes draft box editing）模式Commodity parameter information under*/
          this.GET_GoodsParams(1)
          /** Query brand list*/
          this.getGoodsBrandList()
          /** Freight template list*/
          this.getTplList()
          /** Integral commodity category list*/
          this.getGoodsCatrgory()
        }

        /** 2Level calibration*/
        if (this.activestep === 1) {
          this.$refs['baseInfoForm'].validate((valid) => {
            if (valid) {
              /** Specifications and check*/
              if (!this.skuFormVali()) {
                this.loading = false
                return
              }
              this.loading = false
              if (this.activestep++ > 2) return
            } else {
              this.loading = false
              this.$message.error('There are some unfilled or incorrect places in the form,There are error marks, please check and fill in correctly')
            }
          })
          return
        }
        /** Next*/
        this.loading = false
        if (this.activestep++ > 2) return
      },

      /** Save drafts*/
      saveDraft() {
        const _params = this.generateFormData(this.baseInfoForm)
        if (this.activeGoodsId) {
          this.activeGoodsId = this.activeGoodsId || 1
          /** Modify the draft box merchandise*/
          API_goods.editDraftGoods(this.activeGoodsId, _params).then(() => {
            this.$message.success('Revised draft box merchandise successful')
            this.$store.dispatch('delCurrentViews', {
              view: this.$route,
              $router: this.$router
            })
            this.$router.push({ path: '/goods/draftList' })
            this.$route.params.callback()
          })
        } else {
          /** Save draft operation*/
          API_goods.saveDraft(_params).then(() => {
            this.$message.success('Saved draft successfully')
            this.$route.params.callback()
            this.$store.dispatch('delCurrentViews', {
              view: this.$route,
              $router: this.$router
            })
            this.$router.push({ path: '/goods/draftList' })
          })
        }
        /** Specifications and check*/
        // if (!this.skuFormVali(true)) {
        //   return
        // }
        // this.$refs['baseInfoForm'].validate((valid) => {
        //   if (valid) {
        //     if (this.activeGoodsId) {
        //       this.activeGoodsId = this.activeGoodsId || 1
        // /** Modify draft box commodity */
        //       API_goods.editDraftGoods(this.activeGoodsId, _params).then(() => {
        // This. $message.success( Modify draft box item successfully )
        //         this.$router.push({ path: '/goods/draft-list' })
        //         this.$route.params.callback()
        //       })
        //     } else {
        // /** Save the draft operation */
        //       API_goods.saveDraft(_params).then(() => {
        // This. $message.success( Save draft successfully )
        //         this.$route.params.callback()
        //         this.$router.push({ path: '/goods/draft-list' })
        //       })
        //     }
        //   } else {
        // This. $message.error( There is an unfilled or incorrect place in the form, there is an error marked, please check and fill in correctly )
        //   }
        // })
      },

      /** save*/
      async aboveGoods() {
        if (this.baseInfoForm.activeGoodsId === 0) {
          this.$message.error('Serious error, mall classificationIdDo not for0')
          return
        }
        /** Specifications and check*/
        if (!this.skuFormVali()) return
        let _params = this.generateFormData(this.baseInfoForm)
        /** Whether the specification dimension has changed*/
        const final = this.baseInfoForm.sku_list.map(key => { if (key && key.sku_id) return key.sku_id })
        const _final = this.skuList.map(key => { if (key && key.sku_id) return key.sku_id })
        const _result = _final.every(key => final.includes(key))
        if (final.length && _final.length && this.currentStatus === 1 && !_result) {
          await this.$confirm('A change in dimension due to a specification can result in a previous dimensionSKUThe combination does not exist, and this makes the correspondingSKUParticipate in the promotion is invalid, confirm to do so？', 'prompt', { type: 'warning' })
        }
        /** If there is no change in specifications0 Change the1 */
        if (!_params.has_changed) _params.has_changed = 0
        /** savemarket_enable 1save0off*/
        _params.market_enable = 1
        this.$refs['baseInfoForm'].validate((valid) => {
          if (valid) {
            if (this.currentStatus !== 2) {
              if (this.activeGoodsId) {
                /** Modify normal goods*/
                API_goods.editGoods(this.activeGoodsId, _params).then(() => {
                  this.$message.success('Modify the product successfully')
                  this.$store.dispatch('delCurrentViews', {
                    view: this.$route,
                    $router: this.$router
                  })
                  this.$router.push({ path: '/goods/goodsList' })
                })
              } else {
                /** Normal merchandise on shelves*/
                API_goods.aboveGoods(_params).then(() => {
                  this.$message.success('Success of products on shelves')
                  this.$store.dispatch('delCurrentViews', {
                    view: this.$route,
                    $router: this.$router
                  })
                  this.$router.push({ path: '/goods/goodsList' })
                })
              }
            } else {
              API_goods.aboveDraftGoods(this.activeGoodsId, _params).then(() => {
                this.$message.success('Shelf draft box merchandise success')
                this.$store.dispatch('delCurrentViews', {
                  view: this.$route,
                  $router: this.$router
                })
                this.$router.push({ path: '/goods/goodsList' })
              })
            }
          } else {
            this.$message.error('There are some unfilled or incorrect places in the form,There are error marks, please check and fill in correctly')
          }
        })
      },

      /** off*/
      handleUnderGoods() {
        API_goods.underGoods(this.activeGoodsId, { }).then(() => {
          this.$message.success('The successful')
          this.$store.dispatch('delCurrentViews', {
            view: this.$route,
            $router: this.$router
          })
          this.$router.push({ path: '/goods/goodsList' })
        })
      },

      /** Select the mall commodity classification*/
      handleSelectCategory(row, index, level) {
        if (level === 1) {
          this.activeCategoryName1 = row.name
          this.activeCategoryName2 = this.activeCategoryName3 = ''
          this.activeCategoryIndex1 = index
          this.activeCategoryIndex2 = -1
          this.activeCategoryIndex3 = -1
        } else if (level === 2) {
          this.activeCategoryName2 = row.name
          this.activeCategoryName3 = ''
          this.activeCategoryIndex2 = index
          this.activeCategoryIndex3 = -1
        } else {
          this.activeCategoryName3 = row.name
          this.activeCategoryIndex3 = index
        }
        // Set the current mall classification ID
        this.baseInfoForm.category_id = row.category_id
        this.GET_NextLevelCategory(row, level)
        // Retrieve the brand list when the category changes
        this.getGoodsBrandList()
        this.baseInfoForm.brand_id = ''
      },

      /** Query the commodity classification of the next level mall*/
      GET_NextLevelCategory(row, level, not_click = false) {
        this.loading = true
        const _id = row && row.category_id !== 0 ? row.category_id : 0
        API_goodsCategory.getGoodsCategoryLevelList(_id, { }).then((response) => {
          this.loading = false
          if (level === 1) {
            this.categoryListLevel2 = response
            this.categoryListLevel3 = []
            if (this.baseInfoForm.category_ids && this.baseInfoForm.category_ids[1] && not_click) {
              const _res = response.map(key => key.category_id)
              const row = response.filter(key => key.category_id === this.baseInfoForm.category_ids[1])[0]
              this.activeCategoryName2 = row.name
              this.activeCategoryIndex2 = _res.indexOf(this.baseInfoForm.category_ids[1])
              this.GET_NextLevelCategory(row, 2, true)
            }
          } else if (level === 2) {
            this.categoryListLevel3 = response
            if (this.baseInfoForm.category_ids && this.baseInfoForm.category_ids[2] && not_click) {
              const _res = response.map(key => key.category_id)
              const row = response.filter(key => key.category_id === this.baseInfoForm.category_ids[2])[0]
              this.activeCategoryName3 = row.name
              this.activeCategoryIndex3 = _res.indexOf(this.baseInfoForm.category_ids[2])
            }
          } else if (!level) {
            this.categoryListLevel1 = response
            if (this.baseInfoForm.category_ids && this.baseInfoForm.category_ids[0] && not_click) {
              const _res = response.map(key => key.category_id)
              const row = response.filter(key => key.category_id === this.baseInfoForm.category_ids[0])[0]
              this.activeCategoryName1 = row.name
              this.activeCategoryIndex1 = _res.indexOf(this.baseInfoForm.category_ids[0])
              this.GET_NextLevelCategory(row, 1, true)
            }
          }
        })
      },

      /** Query for individual item information*/
      GET_GoodData() {
        API_goods.getGoodData(this.activeGoodsId, {}).then((response) => {
          /** Complete the commodity information assignment here to judge if there is a value*/
          this.baseInfoForm = {
            ...response
          }
          if (!this.baseInfoForm.brand_id) {
            this.baseInfoForm.brand_id = null
          }
          /** Product album verification properties*/
          this.baseInfoForm.goods_gallery_list.forEach(key => {
            this.$set(key, 'url', key.original)
          })
          this.$nextTick(() => { this.setSort() })
          this.$set(this.baseInfoForm, 'goods_gallery', this.baseInfoForm.goods_gallery_list.toString())
          this.goodsGalleryList = JSON.parse(JSON.stringify(this.baseInfoForm.goods_gallery_list))
          /** Product specification validation attributes*/
          if (!this.baseInfoForm.sku_list || !Array.isArray(this.baseInfoForm.sku_list)) {
            this.baseInfoForm.sku_list = []
          }
          /** Integral correlation set to null if there is no integral correlation*/
          if (!this.baseInfoForm.exchange || !this.baseInfoForm.exchange.enable_exchange) {
            this.baseInfoForm.exchange = {
              /** The exchange of points belongs to the classification*/
              category_id: '',
              /** Whether points are allowed to be exchanged1is0no*/
              enable_exchange: 0,
              /** Amount required for exchange*/
              exchange_money: 0,
              /** The credits are exchanged for the credits used*/
              exchange_point: 0
            }
          } else {
            this.isShowExchangeConfig = (this.baseInfoForm.exchange.enable_exchange === 1)
          }
          /** Query brand list*/
          this.getGoodsBrandList()

          /** Freight template list*/
          this.getTplList()

          /** Query commodity parameters*/
          this.GET_GoodsParams()

          /** Integral commodity category list*/
          this.getGoodsCatrgory()

          /** Query the goodsskuinformation*/
          API_goods.getGoodsStockList(this.activeGoodsId, {}).then((response) => {
            /** Construct temporary specification data*/
            this.skuList = response.map(key => {
              if (key && key.spec_list && Array.isArray(key.spec_list)) {
                const spec_list = key.spec_list.map(item => {
                  let { spec_id, spec_image, spec_type, spec_value, spec_value_id, spec_name } = item
                  return { spec_id, spec_image, spec_type, spec_value, spec_value_id, spec_name }
                })
                let _spec_value_id = key.spec_list.map(item => item.spec_value_id).join('|')
                let { cost, quantity, sn, weight, sku_id } = key
                const price = key.price
                return { cost, price, quantity, sn, weight, sku_id, spec_list, _spec_value_id }
              }
            })
          })
        })
      },

      /** Query commodity parameters*/
      GET_GoodsParams(next = null) {
        if (this.activeGoodsId && !next) {
          API_goods.getEditGoodsParams(this.baseInfoForm.category_id, this.activeGoodsId).then((response) => {
            this.loading = false
            this.goodsParams = response
            this.collapseVal = this.goodsParams.map(key => {
              if (key.group_id) {
                return key.group_id
              }
            })
            if (!response || response.length <= 0) {
              return
            }
            this.baseInfoForm.goods_params_list = []
            this.goodsParams.forEach(key => {
              if (key && key.params) {
                key.params.forEach(elem => {
                  this.baseInfoForm.goods_params_list.push(elem)
                })
              }
            })
          })
        } else {
          API_goods.getGoodsParams(this.baseInfoForm.category_id).then((response) => {
            this.loading = false
            this.goodsParams = response
            this.collapseVal = this.goodsParams.map(key => {
              if (key.group_id) {
                return key.group_id
              }
            })
            if (!response || response.length <= 0) {
              return
            }
            this.baseInfoForm.goods_params_list = []
            this.goodsParams.forEach(key => {
              if (key && key.params) {
                key.params.forEach(elem => {
                  this.baseInfoForm.goods_params_list.push(elem)
                })
              }
            })
          })
        }
      },

      /** Query single draft box commodity information*/
      GET_GoodDraftData() {
        API_goods.getGoodDraftData(this.activeGoodsId, {}).then((response) => {
          /** Complete the commodity information assignment here to judge if there is a value*/
          this.baseInfoForm = { ...response }
          /** Integral commodity category list*/
          this.getGoodsCatrgory()
          /** Integral correlation set to null if there is no integral correlation*/
          if (this.baseInfoForm.exchange_category_id || this.baseInfoForm.goods_type === 'POINT') {
            this.$set(this.baseInfoForm, 'exchange', {
              category_id: response.exchange_category_id,

              enable_exchange: response.goods_type === 'POINT' ? 1 : 0,

              exchange_money: response.exchange_money,

              exchange_point: response.exchange_point
            })
            this.isShowExchangeConfig = (this.baseInfoForm.exchange.enable_exchange === 1)
          }
          /** Product album verification properties*/
          if (Array.isArray(response.gallery_list) && response.gallery_list.length) {
            this.baseInfoForm.goods_gallery_list = response.gallery_list.map(key => {
              return {
                img_id: -1,
                url: key,
                original: key,
                sort: 0
              }
            })
            this.$nextTick(() => { this.setSort() })
            this.baseInfoForm.goods_gallery = this.baseInfoForm.goods_gallery_list.toString()
          }
          if (!this.baseInfoForm.goods_gallery_list) this.baseInfoForm.goods_gallery_list = []
          this.goodsGalleryList = JSON.parse(JSON.stringify(this.baseInfoForm.goods_gallery_list))
          /** Product specification validation attributes*/
          if (!this.baseInfoForm.sku_list) {
            this.baseInfoForm.sku_list = []
          }
          /** Query brand list*/
          this.getGoodsBrandList()

          /** Freight template list*/
          this.getTplList()

          /** Query draft box commodity parameter information*/
          this.GET_GoodsDtagtParams()

          /** Query draft boxskuinformation*/
          API_goods.draftSku(this.activeGoodsId, {}).then((response) => {
            /** Construct temporary specification data*/
            this.skuList = response.map(key => {
              if (key && key.spec_list && Array.isArray(key.spec_list)) {
                const spec_list = key.spec_list.map(item => {
                  let { spec_id, spec_image, spec_type, spec_value, spec_value_id, spec_name } = item
                  return { spec_id, spec_image, spec_type, spec_value, spec_value_id, spec_name }
                })
                let { cost, quantity, sn, weight } = key
                const price = key.price
                return { cost, price, quantity, sn, weight, spec_list }
              }
            })
          })
        })
      },

      /** Query draft box commodity parameter information*/
      GET_GoodsDtagtParams() {
        // Data processing facilitates validation
        const goods_id = this.activeGoodsId || 1
        API_goods.getGoodsDraftParams(goods_id).then((response) => {
          this.loading = false
          if (!response || response.length <= 0) {
            return
          }
          this.goodsParams = response
          this.collapseVal = this.goodsParams.map(key => {
            if (key.group_id) {
              return key.group_id
            }
          })
          this.baseInfoForm.goods_params_list = []
          this.goodsParams.forEach(key => {
            if (key && key.params) {
              key.params.forEach(elem => {
                this.baseInfoForm.goods_params_list.push(elem)
              })
            }
          })
        })
      },

      /** Query a list of product brands*/
      getGoodsBrandList() {
        API_goods.getGoodsBrandList(this.baseInfoForm.category_id, { }).then((response) => {
          this.brandList = response
        })
      },

      /** Triggered when the product brand changes*/
      changeGoodsBrand(val) {
        this.baseInfoForm.brand_id = val
      },

      /** Freight template list*/
      getTplList() {
        API_goods.getTplList(this.activeGoodsId, { }).then((response) => {
          this.tplList = response
        })
      },

      /** Selected value seller freight/Buyer freight is triggered when*/
      changeTplItem(val) {
        if (this.tplList[0] && this.tplList[0].id) {
          this.baseInfoForm.template_id = val === 0 ? this.tplList[0].id : ''
        }
      },

      /** Triggered when the freight template changes*/
      changeTpl(val) {
        this.baseInfoForm.template_id = this.baseInfoForm.goods_transfee_charge === 0 ? val : ''
      },

      /** Integral commodity mall classification list*/
      getGoodsCatrgory() {
        API_goods.getExchangeCatsList(0).then((response) => {
          this.exchangeGoodsCatrgoryList = response
        })
      },

      /** Triggered when the value of the points exchange switch changes*/
      handleSwitchexchange(val) {
        this.isShowExchangeConfig = val
        if (val) {
          this.baseInfoForm.exchange.enable_exchange = 1
        } else {
          this.baseInfoForm.exchange.enable_exchange = 0
        }
      },

      /** Points triggered when commodity mall classification changes*/
      changeExangeCategory(val) {
        this.baseInfoForm.exchange.category_id = val
      },

      /** File list remove file when the hook picture delete checksum*/
      handleRemove(file, fileList) {
        this.baseInfoForm.goods_gallery_list.forEach((key, index) => {
          if (key.img_id !== -1) {
            if (key.img_id === file.img_id) {
              this.baseInfoForm.goods_gallery_list.splice(index, 1)
            }
          } else {
            if (key.name === file.response.name) {
              this.baseInfoForm.goods_gallery_list.splice(index, 1)
            }
          }
        })
        if (fileList.length <= 0) {
          this.baseInfoForm.goods_gallery_list = []
          this.baseInfoForm.goods_gallery = this.baseInfoForm.goods_gallery_list.toString()
        }
        this.$refs.baseInfoForm.validateField('goods_gallery')
      },

      /** Check the hook upload success when the file list is uploaded successfully*/
      handleSuccess(response, file, fileList) {
        this.baseInfoForm.goods_gallery_list.push({
          img_id: -1,

          original: response.url,

          url: response.url,

          sort: 0,

          name: response.name
        })
        this.baseInfoForm.goods_gallery = this.baseInfoForm.goods_gallery_list.toString()
        this.$refs['baseInfoForm'].validateField('goods_gallery')
        this.$nextTick(() => { this.setSort() })
      },

      /** Click the hook to enlarge the uploaded file link*/
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogImage = true
      },

      /** Drag and drop to change the order of the pictures*/
      setSort() {
        const el = document.querySelectorAll('div.avatar-uploader > ul.el-upload-list--picture-card')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost',
          setData: function(dataTransfer) { },
          onEnd: evt => {
            let temp = this.baseInfoForm.goods_gallery_list[evt.oldIndex]
            this.baseInfoForm.goods_gallery_list[evt.oldIndex] = this.baseInfoForm.goods_gallery_list[evt.newIndex]
            this.baseInfoForm.goods_gallery_list[evt.newIndex] = temp
          }
        })
      },

      /** Verify images before uploading*/
      beforeAvatarUpload(file) {
        const isType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        const isLt1M = file.size / 1024 / 1024 < 1

        if (!isType) {
          this.$message.error('Profile pictures can only be uploadedJPG/JPEG/PNG Format!')
        }
        if (!isLt1M) {
          this.$message.error('The size of the picture in the uploaded product album should not exceed1MB!')
        }

        /** Repeat check*/
        const isExit = this.baseInfoForm.goods_gallery_list.some(key => {
          return file.name === key.name
        })
        if (isExit) {
          this.$message.error('The picture already exists')
        }

        return isType && isLt1M && !isExit
      },

      /** Specification selector triggered when specification data is changed*/
      finalSku(val) {
        // The total inventory cannot be edited without specifications
        this.isEditQuantity = !!val.length
        // Change the total inventory dynamically and set it to 0 at a time where there is a performance waste every time you do a loop calculation
        // If in edit mode the total inventory must not be reset to 0
        this.baseInfoForm.quantity = 0
        val.forEach(key => {
          if (key.quantity) {
            this.baseInfoForm.quantity += parseInt(key.quantity)
          }
        })
        /** Remove field redundancy due to shallow copies of objects（Unnecessary field）*/
        val.forEach(key => {
          key.spec_list.forEach(item => {
            delete item.cost
            delete item.price
            delete item.quantity
            delete item.sn
            delete item.weight
          })
        })
        this.baseInfoForm.sku_list = val
        /** Is there any change in the specification data*/
        this.baseInfoForm.has_changed = 1
      },

      /** Constructing form data*/
      generateFormData(data) {
        let _params = {
          ...data
        }
        // Remove unnecessary form data
        delete _params.original
        delete _params.exchange_category_id
        delete _params.exchange_money
        delete _params.exchange_point
        delete _params.gallery_list
        delete _params.goods_gallery
        if (_params.goods_gallery_list) {
          _params.goods_gallery_list.forEach(key => {
            delete key.name
            delete key.big
            delete key.goods_id
            delete key.isdefault
            delete key.small
            delete key.status
            delete key.thumbnail
            delete key.tiny
            delete key.uid
            delete key.url
          })
        }
        /** Integrated commodity data*/
        if (!this.isShowExchangeConfig) {
          _params.exchange.enable_exchange = 0
        } else {
          _params.exchange.exchange_money = parseFloat(_params.exchange.exchange_money)
        }
        /** The freight template*/
        _params.template_id = _params.template_id || 0
        /** To deal withUEThe information of*/
        if (this.activestep === 2) {
          _params.intro = this.$refs['ue'].getUEContent()
        }
        return _params
      },

      /** Commodity specification selector check*/
      skuFormVali(isDraft) {
        /** If no specification is selected*/
        if (Array.isArray(this.baseInfoForm.sku_list) && this.baseInfoForm.sku_list.length === 0) {
          return true
        }
        this.productSn = false
        /** Whether to automatically generate item numbers Verify whether all item numbers exist*/
        const _sn = this.baseInfoForm.sku_list.some(key => {
          return key.sn === ''
        })
        if (_sn) {
          this.$confirm('You dont have toSKUFill in the item number, the system will automatically generate according to the item number, Whether or not to continue?', 'prompt').then(() => {
            this.productSn = true
          })
          return false
        }
        /** Specification values are null checked*/
        let _result = false
        this.baseInfoForm.sku_list.forEach(key => {
          Object.values(key).forEach(item => {
            if (!item && item !== 0) {
              _result = true
            }
          })
        })
        if (_result) {
          this.$message.error('There are unfilled specification values')
          return false
        }
        // Specification check
        let spec_fun = false
        let spec_tip
        this.baseInfoForm.sku_list.forEach(key => {
          if (!RegExp.money.test(key.cost)) {
            spec_fun = true
            spec_tip = 'Please enter the correct cost amount'
          }
          if (!RegExp.money.test(key.price)) {
            spec_fun = true
            spec_tip = 'Please enter the correct price'
          }
          if (!(parseInt(key.weight) >= 0 && parseInt(key.weight) < 99999999)) {
            spec_fun = true
            spec_tip = 'Weight should be0 - 99999999Integer between'
          }
          if (!(parseInt(key.quantity) >= 0 && parseInt(key.quantity) < 99999999) || !/^[0-9]\d*$/.test(key.quantity)) {
            spec_fun = true
            spec_tip = 'Inventory should be0 - 99999999Integer between'
          }
        })
        if (spec_fun) {
          this.$message.error(spec_tip)
          return false
        }
        if (isDraft) {
          this.productSn = true
          return true
        }
        return true
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /*Select product category*/
  .content-goods-publish {
    padding: 15px;
    margin: 0 auto;
    text-align: center;
    border: 1px solid #ddd;
    background: none repeat  0 0 #fff;

    /*Product category*/
    .goods-category {
      text-align: left;
      padding: 10px;
      background: #fafafa;
      border: 1px solid #e6e6e6;
      ul {
        padding: 8px 4px 8px 8px;
        list-style: none;
        width: 300px;
        background: none repeat  0 0 #fff;
        border: 1px solid #e6e6e6;
        display: inline-block;
        letter-spacing: normal;
        margin-right: 15px;
        vertical-align: top;
        word-spacing: normal;
        li {
          line-height: 20px;
          padding: 5px;
          cursor: pointer;
          color: #333;
          font-size: 12px;
          display: flex;
          flex-wrap: nowrap;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
      }
    }

    /** The style that is selected for the current category*/
    .activeClass {
      background-color: #d9edf7;
      border: 1px solid #bce8f1;
      color: #3a87ad;
    }

    /*!*当前选择的商品品类文字*!*/
    .current-goods-category {
      text-align: left;
      padding: 10px;
      width: 100%;
      border: 1px solid #fbeed5;
      color: #c09853;
      background-color: #fcf8e3;
      margin: 10px auto;
      padding: 8px 35px 8px 14px;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
      font-size: 12px;
      font-weight: bold;
    }
  }

  /*Edit basic information*/
  .el-form {
    padding-bottom: 80px;
    .el-form-item {
      width: 100%;
      text-align: left;
    }
  }

  /*tile*/
  div.base-info-item>div {
    margin-left: 5%
  }
  div.base-info-item {
    h4 {
      margin-bottom: 10px;
      padding:0 10px;
      border: 1px solid #ddd;
      background-color: #f8f8f8;
      font-weight: bold;
      color: #333;
      font-size: 14px;
      line-height: 40px;
      text-align: left;
    }

    /** Audit information-Refuse to reason*/
    .auth-info {
      color: red;
    }

    .el-form-item {
      width: 30%;
      min-width: 300px;
    }
    .goods-name-width {
      width: 50%;
      min-width: 300px;
    }
    .el-form-item__content {
      margin-left: 120px;
      text-align: left;
    }
    p.goods-group-manager {
      padding-left: 7.5%;
      text-align: left;
      color: #999;
      font-size: 13px;
    }

    /*teatarea*/
    /deep/ .el-textarea {
      width: 150%;
    }
    .seo-text {
      width: 150%;
    }
  }

  /*Folded panel*/
  .el-collapse-item {
    /deep/ .el-collapse-item__header {
      text-align: left;
      background-color: #f8f8f8;
      padding:0 10px;
      font-weight: bold;
      color: #333;
      font-size: 14px;
    }
    .el-form-item {
      margin-left: 5%;
      width: 25%;
    }
    /deep/ .el-form-item__content {
      margin-left: 120px;
      text-align: left;
    }
    p.goods-group-manager {
      padding-left: 12%;
      text-align: left;
      color: #999;
    }
    /deep/ .el-collapse-item__content {
      padding: 10px 0;
      text-align: left;
    }
  }

  /*Commodity description*/
  .goods-intro {
    line-height: 40;
  }

  /** At the bottom of the steps*/
  .footer {
    width: 88.7%;
    padding: 10px;
    background-color: #ffc;
    position: fixed;
    bottom: 0px;
    left: 10%;
    text-align: center;
    z-index: 9999;
  }

  /*Picture upload component first picture set cover*/
  .goods-images {
    /deep/ li.el-upload-list__item:first-child {
      position: relative;
    }
    /deep/ li.el-upload-list__item:first-child:after {
      content:"seal";
      color:#fff;
      font-weight:bold;
      font-size: 12px;
      position: absolute;
      left: -15px;
      top: -6px;
      width: 40px;
      height: 24px;
      padding-top: 6px;
      background: #13ce66;
      text-align: center;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      -webkit-box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
      box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
    }
  }

</style>
<style type="text/scss" lang="scss">
  .el-form-item__label{
    word-break: break-all;
  }
</style>
