<template>
  <div v-loading="loading">
    <el-steps :active="activestep" finish-status="success" process-status="process"	 simple style="margin-top: 20px">
      <el-step title="1.选择商品品类" ></el-step>
      <el-step title="2.编辑基本信息" ></el-step>
      <el-step title="3.编辑商品详情" ></el-step>
    </el-steps>
    <!--步骤1-->
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
        您当前选择的商品类别是：
        <span>{{ activeCategoryName1 }}</span>
        <span v-show="activeCategoryName2"> > {{ activeCategoryName2 }}</span>
        <span v-show="activeCategoryName3"> > {{ activeCategoryName3 }}</span>
      </p>
    </div>
    <!--步骤2-->
    <div class="content-goods-publish" v-show="activestep === 1">
      <!--商品详情-->
      <el-form
        :model="baseInfoForm"
        status-icon
        :rules="baseInfoFormRule"
        label-position="right"
        ref="baseInfoForm"
        label-width="120px"
        class="demo-ruleForm">
        <!--商品详情-->
        <!--基本信息-->
        <div class="base-info-item">
          <h4>基本信息</h4>
          <div>
            <el-form-item class="auth-info" label="拒绝原因：" v-if="baseInfoForm.is_auth === 2">
              {{ baseInfoForm.auth_message }}
            </el-form-item>
            <el-form-item label="商品分类：" style="width: 100%; text-align: left;">
              <span>{{ activeCategoryName1 }}</span>
              <span v-show="activeCategoryName2"> > {{ activeCategoryName2 }}</span>
              <span v-show="activeCategoryName3"> > {{ activeCategoryName3 }}</span>
              <span v-if="!activeCategoryName1" v-html="baseInfoForm.category_name"></span>
            </el-form-item>
            <el-form-item label="商品品牌：" >
              <el-select
                v-model="baseInfoForm.brand_id"
                filterable
                @change="changeGoodsBrand"
                clearable
                placeholder="请选择">
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
        <!--商品信息-->
        <div class="base-info-item">
          <h4>商品信息</h4>
          <div>
            <el-form-item label="商品名称：" prop="goods_name" class="goods-name-width">
              <el-input v-model="baseInfoForm.goods_name" @change="() => { baseInfoForm.goods_name = baseInfoForm.goods_name.trim() }" :maxlength="60" :minlength="3" placeholder="3-60个字符"></el-input>
            </el-form-item>
            <el-form-item label="商品编号：" prop="sn">
              <el-input v-model="baseInfoForm.sn" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="市场价格：" prop="mktprice" :maxlength="10">
              <el-input placeholder="请输入市场价格" v-model="baseInfoForm.mktprice">
                <template slot="prepend">¥</template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品价格：" prop="price" :maxlength="10">
              <el-input placeholder="请输入商品价格" v-model="baseInfoForm.price">
                <template slot="prepend">¥</template>
              </el-input>
            </el-form-item>
            <el-form-item label="成本价格：" prop="cost" :maxlength="10">
              <el-input placeholder="请输入成本价格" v-model="baseInfoForm.cost">
                <template slot="prepend">¥</template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品重量：" prop="weight" :maxlength="10">
              <el-input placeholder="请输入商品重量" v-model="baseInfoForm.weight">
                <template slot="prepend">kg</template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品图片：" prop="goods_gallery" style="width: 90%;text-align: left;">
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
                <div slot="tip" class="el-upload__tip">建议上传jpg/png文件，且不超过1MB</div>
              </el-upload>
              <el-dialog :visible.sync="dialogImage">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </div>
        </div>
        <!--商品规格-->
        <div class="base-info-item">
          <h4>商品规格</h4>
          <div>
            <el-form-item label="商品规格："  style="width: 90%;text-align: left;">
              <!--规格选择器-->
               <en-sku-selector
                 :categoryId="baseInfoForm.category_id"
                 :goodsId="activeGoodsId"
                 :goodsSn="baseInfoForm.sn"
                 :productSn="productSn"
                 :isEditModel="currentStatus"
                 :goodsSkuInfo="skuList"
                 @finalSku="finalSku"/>
            </el-form-item>
            <el-form-item label="总库存：" style="width: 20%;text-align: left;">
              <el-input v-model.number="baseInfoForm.quantity" :disabled="currentStatus === 1 || isEditQuantity"></el-input>
            </el-form-item>
          </div>
        </div>
        <!--seo-->
        <div class="base-info-item">
          <h4>seo</h4>
          <div>
            <el-form-item label="seo标题：">
              <el-input placeholder="最多60个字符" class="seo-text" @change="() => { baseInfoForm.page_title = baseInfoForm.page_title.trim() }" :maxlength="60"  v-model="baseInfoForm.page_title"></el-input>
            </el-form-item>
            <el-form-item label="seo关键字：" >
              <el-input type="textarea" placeholder="最多200个字符" class="seo-text" rows="5" :maxlength="200" v-model="baseInfoForm.meta_keywords"></el-input>
            </el-form-item>
            <el-form-item label="seo描述：">
              <el-input type="textarea" placeholder="最多200个字符" class="seo-text" rows="5" :maxlength="200" v-model="baseInfoForm.meta_description"></el-input>
            </el-form-item>
          </div>
        </div>
        <!--物流/其他-->
        <div class="base-info-item">
          <h4>物流/其他</h4>
          <div>
            <el-form-item label="运费：" style="width: 50%;" prop="template_id">
              <el-radio-group v-model="baseInfoForm.goods_transfee_charge" @change="changeTplItem">
                <el-radio :label="1">卖家承担运费</el-radio>
                <el-radio :label="0">买家承担运费</el-radio>
              </el-radio-group>
              <el-select
                v-model="baseInfoForm.template_id || '请选择运费模板'"
                placeholder="请选择运费模板"
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
        <!--兑换许可 自营店显示-->
        <div class="base-info-item">
          <h4>兑换许可</h4>
          <div>
            <el-form-item label="积分兑换：">
              <el-switch
                v-model="isShowExchangeConfig"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="开启"
                inactive-text="关闭"
                @change="handleSwitchexchange">
              </el-switch>
            </el-form-item>
          </div>
        </div>
        <!--积分配置-->
        <div class="base-info-item" v-if="isShowExchangeConfig">
          <h4>积分配置</h4>
          <div v-if="baseInfoForm.exchange">
            <el-form-item label="兑换条件：" style="width: 25%;" prop="exchange_money">
              <el-input placeholder="最多10个字符" :maxlength="10" v-model="baseInfoForm.exchange.exchange_money" style="width: 100px;"></el-input> 元
            </el-form-item>
            <el-form-item  style="width: 25%;" prop="exchange_point">
              <el-input placeholder="最多10个字符" :maxlength="10" v-model.number="baseInfoForm.exchange.exchange_point" style="width: 100px;"></el-input> 积分
            </el-form-item>
            <el-form-item label="积分商品分类：" >
              <el-select
                v-model="baseInfoForm.exchange.category_id"
                placeholder="请选择积分商品分类"
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
        <!--商品参数-->
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
              :rules="goods_params_list.required === 1 ? {required: true, message: `${goods_params_list.param_name}不能为空`, trigger: 'change' } : {}">
              <el-input
                placeholder="长度为最多100个字符"
                maxlength="100"
                v-if="goods_params_list.param_type === 1"
                v-model="goods_params_list.param_value" >
              </el-input>
              <el-select
                v-if="goods_params_list.param_type === 2"
                v-model="goods_params_list.param_value"
                placeholder="请选择">
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
    <!--步骤3-->
    <div class="content-goods-publish" v-if="activestep === 2">
      <el-form
        :model="baseInfoForm"
        label-position="right"
        ref="baseInfoFormIntro"
        label-width="120px"
        class="demo-ruleForm">
        <el-form-item label="商品描述：" class="goods-intro">
          <UE ref="ue" :defaultMsg="baseInfoForm.intro"></UE>
        </el-form-item>
      </el-form>
    </div>
    <!--底部-->
    <div class="footer">
      <el-button-group>
        <el-button type="primary" @click="pre" v-if="activestep === 1 || activestep === 2">上一步</el-button>
        <el-button
          type="primary"
          @click="next"
          v-if="activestep === 0 || activestep === 1">下一步</el-button>
        <el-button
          type="primary"
          @click="aboveGoods"
          v-if="activestep === 1 || activestep === 2"
        >上架</el-button>
        <el-button
          type="primary"
          @click="handleUnderGoods"
          v-if="currentStatus === 1 && ( activestep === 1 || activestep === 2) && baseInfoForm.market_enable === 1"
        >下架</el-button>
        <el-button
          type="primary"
          @click="saveDraft"
          v-if="(currentStatus != 1 && activestep != 0)"
        >保存草稿</el-button>
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
          callback(new Error('商品编号不能为空'))
        } else if (!/^[a-zA-Z0-9_\\-]+$/g.test(value)) {
          callback(new Error('请输入数字、字母、下划线或者中划线'))
        } else {
          callback()
        }
      }

      const checkMarket = (rule, value, callback) => {
        if (!value && value !== 0) {
          callback(new Error('市场价格不能为空'))
        } else if (!RegExp.money.test(value)) {
          callback(new Error('请输入正整数或者两位小数'))
        } else if (parseFloat(value) > 99999999) {
          callback(new Error('价格设置超过上限值'))
        } else {
          callback()
        }
      }

      const checkPrice = (rule, value, callback) => {
        if (!value && value !== 0) {
          return callback(new Error('商品价格不能为空'))
        }
        setTimeout(() => {
          if (!RegExp.money.test(value)) {
            callback(new Error('请输入正整数或者两位小数'))
          } else if (parseFloat(value) > 99999999) {
            callback(new Error('价格设置超过上限值'))
          } else {
            callback()
          }
        }, 1000)
      }

      const checkCost = (rule, value, callback) => {
        if (!value && value !== 0) {
          return callback(new Error('成本价格不能为空'))
        }
        if (!RegExp.money.test(value)) {
          callback(new Error('请输入数字值'))
        } else if (parseFloat(value) > 99999999) {
          callback(new Error('价格设置超过上限值'))
        } else {
          callback()
        }
      }

      const checkWeight = (rule, value, callback) => {
        if (!value && typeof value !== 'number') {
          callback(new Error('重量不能为空'))
        } else if (!RegExp.money.test(value)) {
          callback(new Error('请输入正整数或者两位小数'))
        } else {
          callback()
        }
      }

      const checkTplId = (rule, value, callback) => {
        if (this.baseInfoForm.goods_transfee_charge === 0 && !value) {
          return callback(new Error('请选择一种模板'))
        } else {
          callback()
        }
      }

      // 总库存
      const checkQuantity = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请填写总库存'))
        } else if (!RegExp.integer.test(value)) {
          callback(new Error('请输入大于0的正整数'))
        } else {
          if (parseInt(value) > 99999999) {
            callback(new Error('总库存不得大于99999999'))
          } else {
            callback()
          }
        }
      }

      const checkExchangePoint = (rule, value, callback) => {
        if (this.baseInfoForm.exchange.enable_exchange && !this.baseInfoForm.exchange.exchange_point) {
          return callback(new Error('积分值不能为空且不能为0'))
        }
        setTimeout(() => {
          if (!RegExp.integer.test(this.baseInfoForm.exchange.exchange_point)) {
            callback(new Error('请输入正整数'))
          } else {
            if (parseInt(this.baseInfoForm.exchange.exchange_point) <= 0) {
              callback(new Error('请输入大于0的积分值'))
            } else {
              callback()
            }
          }
        }, 1000)
      }

      const checkExchangeMoney = (rule, value, callback) => {
        if (this.baseInfoForm.exchange.exchange_money !== 0 && !this.baseInfoForm.exchange.exchange_money) {
          callback(new Error('积分所需金额不能为空'))
        } else if (!RegExp.money.test(this.baseInfoForm.exchange.exchange_money)) {
          callback(new Error('请输入正确的金额'))
        } else if (parseFloat(this.baseInfoForm.exchange.exchange_money) >= parseFloat(this.baseInfoForm.price)) {
          callback(new Error('积分商品价格不能高于商品原价'))
        } else {
          callback()
        }
      }

      return {
        /** 店铺信息 */
        shopInfo: this.$store.getters.shopInfo,

        /** 加载中。。。 */
        loading: false,

        /** 当前状态/模式 默认发布商品0 编辑商品1 编辑草稿箱商品2 */
        currentStatus: 0,

        /** 当前激活步骤*/
        activestep: 0,

        /** 上一步操作计数器 默认0次*/
        toPreCount: 0,

        /** 当前点击的1级分类索引*/
        activeCategoryIndex1: -1,

        /** 当前点击的2级分类索引*/
        activeCategoryIndex2: -1,

        /** 当前点击的3级分类索引*/
        activeCategoryIndex3: -1,

        /** 当前商品分类名称1*/
        activeCategoryName1: '',

        /** 当前商品分类名称2*/
        activeCategoryName2: '',

        /** 当前商品分类名称3*/
        activeCategoryName3: '',

        /** 当前商品id*/
        activeGoodsId: '',

        /** 1级分类列表*/
        categoryListLevel1: [],

        /** 2级分类列表*/
        categoryListLevel2: [],

        /** 3级分类列表*/
        categoryListLevel3: [],

        /** 商品详情信息提交表单 */
        baseInfoForm: {

          /** 品牌id */
          brand_id: '',

          /** 商城分类id */
          category_id: 0,

          /** 商城分类 名称 */
          category_name: '',

          /** 商品名称 */
          goods_name: '',

          /** 商品编号 sn*/
          sn: '',

          /** 商品价格 */
          price: '',

          /** 市场价格 */
          mktprice: '',

          /** 成本价格 */
          cost: '',

          /** 商品重量 */
          weight: '',

          /** 商品相册列表 */
          goods_gallery_list: [],

          /** 用来校验的商品相册 */
          goods_gallery: '',

          /** 商品总库存 */
          quantity: 0,

          /** 卖家承担运费1 买家承担运费0 */
          goods_transfee_charge: 1,

          /** sku数据变化或者组合变化判断 0:没变化，1：变化 */
          has_changed: 0,

          /** 是否上架，1上架 0下架 */
          market_enable: 1,

          /** 模板运费id */
          template_id: '',

          /** 积分兑换 */
          exchange: {
            /** 积分兑换所属分类 */
            category_id: '',

            /** 是否允许积分兑换  1是 0否*/
            enable_exchange: 1,

            /** 兑换所需金额 */
            exchange_money: 0,

            /** 积分兑换使用的积分 */
            exchange_point: 0
          },

          /** 店铺分组id*/
          shop_cat_id: 0,

          /** seo描述 */
          meta_description: '',

          /** seo关键字 */
          meta_keywords: '',

          /** seo标题 */
          page_title: '',

          /** 商品参数列表 */
          goods_params_list: [],

          /** sku列表 */
          sku_list: [],

          /** 商品描述 详情 */
          intro: ''
        },

        /** 临时存储商品相册信息 */
        goodsGalleryList: [],

        /** 用来向组件中传递的数据 */
        skuList: [],

        /** 是否自动生成货号 */
        productSn: false,

        /** 总库存是否可编辑 默认可以 false可编辑 true不可编辑 */
        isEditQuantity: false,

        /** 请求的商品参数组列表 */
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

        /** 品牌列表 */
        brandList: [],

        /** 运费模板列表 */
        tplList: [],

        /** 积分商品列表 */
        exchangeGoodsCatrgoryList: [],

        /** 商品图片放大地址 */
        dialogImageUrl: '',

        /** 是否显示放大图片弹框 */
        dialogImage: false,

        /** 是否显示积分配置*/
        isShowExchangeConfig: false,

        /** 商品详情的校验规则 */
        baseInfoFormRule: {
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { whitespace: true, message: '商品名称不可为纯空格', trigger: 'blur' },
            { min: 3, max: 60, message: '长度在 3 到 60 个字符', trigger: 'blur' }
          ],
          sn: [
            { required: true, message: '请输入商品编号', trigger: 'blur' },
            { validator: checkSn, trigger: 'blur' }
          ],
          mktprice: [
            { required: true, message: '请输入市场价格', trigger: 'blur' },
            { validator: checkMarket, trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' },
            { validator: checkPrice, trigger: 'blur' }
          ],
          cost: [
            { required: true, message: '请输入成本价格', trigger: 'blur' },
            { validator: checkCost, trigger: 'blur' }
          ],
          weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' },
            { validator: checkWeight, trigger: 'blur' }
          ],
          goods_gallery: [
            { required: true, message: '请选择商品相册', trigger: 'change' }
          ],
          quantity: [
            { required: true, message: '请填写总库存', trigger: 'blur' },
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
      /** 上一步*/
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

      /** 下一步*/
      next() {
        /** 1级校验 */
        this.loading = true
        if (this.activestep === 0 && !this.activeCategoryName1) {
          this.$message.error('请选择商品分类')
          this.loading = false
          return
        } else if (this.activestep === 0 && this.activeCategoryName1 && this.currentStatus === 0) {
          /** 获取该商城分类下 商品参数信息 */
          /** 传参数1 表示查询添加模式（发布商品模式0）下的商品参数信息；  如果不传 表示查询编辑（包括草稿箱编辑）模式下的商品参数信息 */
          this.GET_GoodsParams(1)
          /** 查询品牌列表 */
          this.getGoodsBrandList()
          /** 运费模板列表 */
          this.getTplList()
          /** 积分商品分类列表 */
          this.getGoodsCatrgory()
        }

        /** 2级校验 */
        if (this.activestep === 1) {
          this.$refs['baseInfoForm'].validate((valid) => {
            if (valid) {
              /** 规格校验 */
              if (!this.skuFormVali()) {
                this.loading = false
                return
              }
              this.loading = false
              if (this.activestep++ > 2) return
            } else {
              this.loading = false
              this.$message.error('表单中存在未填写或者填写有误的地方,已有错误标示，请检查并正确填写')
            }
          })
          return
        }
        /** 下一步 */
        this.loading = false
        if (this.activestep++ > 2) return
      },

      /** 保存草稿 */
      saveDraft() {
        const _params = this.generateFormData(this.baseInfoForm)
        if (this.activeGoodsId) {
          this.activeGoodsId = this.activeGoodsId || 1
          /** 修改草稿箱商品 */
          API_goods.editDraftGoods(this.activeGoodsId, _params).then(() => {
            this.$message.success('修改草稿箱商品成功')
            this.$store.dispatch('delCurrentViews', {
              view: this.$route,
              $router: this.$router
            })
            this.$router.push({ path: '/goods/draftList' })
            this.$route.params.callback()
          })
        } else {
          /** 保存草稿操作 */
          API_goods.saveDraft(_params).then(() => {
            this.$message.success('保存草稿成功')
            this.$route.params.callback()
            this.$store.dispatch('delCurrentViews', {
              view: this.$route,
              $router: this.$router
            })
            this.$router.push({ path: '/goods/draftList' })
          })
        }
        /** 规格校验 */
        // if (!this.skuFormVali(true)) {
        //   return
        // }
        // this.$refs['baseInfoForm'].validate((valid) => {
        //   if (valid) {
        //     if (this.activeGoodsId) {
        //       this.activeGoodsId = this.activeGoodsId || 1
        //       /** 修改草稿箱商品 */
        //       API_goods.editDraftGoods(this.activeGoodsId, _params).then(() => {
        //         this.$message.success('修改草稿箱商品成功')
        //         this.$router.push({ path: '/goods/draft-list' })
        //         this.$route.params.callback()
        //       })
        //     } else {
        //       /** 保存草稿操作 */
        //       API_goods.saveDraft(_params).then(() => {
        //         this.$message.success('保存草稿成功')
        //         this.$route.params.callback()
        //         this.$router.push({ path: '/goods/draft-list' })
        //       })
        //     }
        //   } else {
        //     this.$message.error('表单中存在未填写或者填写有误的地方,已有错误标示，请检查并正确填写')
        //   }
        // })
      },

      /** 上架  */
      async aboveGoods() {
        if (this.baseInfoForm.activeGoodsId === 0) {
          this.$message.error('严重错误，商城分类Id不可为0')
          return
        }
        /** 规格校验 */
        if (!this.skuFormVali()) return
        let _params = this.generateFormData(this.baseInfoForm)
        /** 是否规格维度发生变化 */
        const final = this.baseInfoForm.sku_list.map(key => { if (key && key.sku_id) return key.sku_id })
        const _final = this.skuList.map(key => { if (key && key.sku_id) return key.sku_id })
        const _result = _final.every(key => final.includes(key))
        if (final.length && _final.length && this.currentStatus === 1 && !_result) {
          await this.$confirm('因规格的维度发生变化，会导致之前的SKU组合不存在，这会使相应的SKU参加的促销失效，确认要这么操作吗？', '提示', { type: 'warning' })
        }
        /** 如果规格无变化 则传0 有变化传1 */
        if (!_params.has_changed) _params.has_changed = 0
        /** 上架 market_enable 1上架0下架*/
        _params.market_enable = 1
        this.$refs['baseInfoForm'].validate((valid) => {
          if (valid) {
            if (this.currentStatus !== 2) {
              if (this.activeGoodsId) {
                /** 修改正常商品 */
                API_goods.editGoods(this.activeGoodsId, _params).then(() => {
                  this.$message.success('修改商品成功')
                  this.$store.dispatch('delCurrentViews', {
                    view: this.$route,
                    $router: this.$router
                  })
                  this.$router.push({ path: '/goods/goodsList' })
                })
              } else {
                /** 正常商品上架 */
                API_goods.aboveGoods(_params).then(() => {
                  this.$message.success('上架商品成功')
                  this.$store.dispatch('delCurrentViews', {
                    view: this.$route,
                    $router: this.$router
                  })
                  this.$router.push({ path: '/goods/goodsList' })
                })
              }
            } else {
              API_goods.aboveDraftGoods(this.activeGoodsId, _params).then(() => {
                this.$message.success('上架草稿箱商品成功')
                this.$store.dispatch('delCurrentViews', {
                  view: this.$route,
                  $router: this.$router
                })
                this.$router.push({ path: '/goods/goodsList' })
              })
            }
          } else {
            this.$message.error('表单中存在未填写或者填写有误的地方,已有错误标示，请检查并正确填写')
          }
        })
      },

      /** 下架*/
      handleUnderGoods() {
        API_goods.underGoods(this.activeGoodsId, { }).then(() => {
          this.$message.success('下架成功')
          this.$store.dispatch('delCurrentViews', {
            view: this.$route,
            $router: this.$router
          })
          this.$router.push({ path: '/goods/goodsList' })
        })
      },

      /** 选择商城商品分类 */
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
        // 设置当前商城分类ID
        this.baseInfoForm.category_id = row.category_id
        this.GET_NextLevelCategory(row, level)
        // 分类发生变化时重新获取品牌列表
        this.getGoodsBrandList()
        this.baseInfoForm.brand_id = ''
      },

      /** 查询下一级 商城商品分类*/
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

      /** 查询单个商品信息*/
      GET_GoodData() {
        API_goods.getGoodData(this.activeGoodsId, {}).then((response) => {
          /** 此处完成商品信息赋值 进行判断如果有值的话 */
          this.baseInfoForm = {
            ...response
          }
          if (!this.baseInfoForm.brand_id) {
            this.baseInfoForm.brand_id = null
          }
          /** 商品相册校验属性 */
          this.baseInfoForm.goods_gallery_list.forEach(key => {
            this.$set(key, 'url', key.original)
          })
          this.$nextTick(() => { this.setSort() })
          this.$set(this.baseInfoForm, 'goods_gallery', this.baseInfoForm.goods_gallery_list.toString())
          this.goodsGalleryList = JSON.parse(JSON.stringify(this.baseInfoForm.goods_gallery_list))
          /** 商品规格校验属性  */
          if (!this.baseInfoForm.sku_list || !Array.isArray(this.baseInfoForm.sku_list)) {
            this.baseInfoForm.sku_list = []
          }
          /** 积分相关设置 如果没有积分相关则设置为空 */
          if (!this.baseInfoForm.exchange || !this.baseInfoForm.exchange.enable_exchange) {
            this.baseInfoForm.exchange = {
              /** 积分兑换所属分类 */
              category_id: '',
              /** 是否允许积分兑换  1是 0否*/
              enable_exchange: 0,
              /** 兑换所需金额 */
              exchange_money: 0,
              /** 积分兑换使用的积分 */
              exchange_point: 0
            }
          } else {
            this.isShowExchangeConfig = (this.baseInfoForm.exchange.enable_exchange === 1)
          }
          /** 查询品牌列表 */
          this.getGoodsBrandList()

          /** 运费模板列表 */
          this.getTplList()

          /** 查询商品参数 */
          this.GET_GoodsParams()

          /** 积分商品分类列表 */
          this.getGoodsCatrgory()

          /** 查询商品sku信息 */
          API_goods.getGoodsStockList(this.activeGoodsId, {}).then((response) => {
            /** 构造临时规格数据 */
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

      /** 查询商品参数 */
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

      /** 查询单个草稿箱商品信息 */
      GET_GoodDraftData() {
        API_goods.getGoodDraftData(this.activeGoodsId, {}).then((response) => {
          /** 此处完成商品信息赋值 进行判断如果有值的话 */
          this.baseInfoForm = { ...response }
          /** 积分商品分类列表 */
          this.getGoodsCatrgory()
          /** 积分相关设置 如果没有积分相关则设置为空 */
          if (this.baseInfoForm.exchange_category_id || this.baseInfoForm.goods_type === 'POINT') {
            this.$set(this.baseInfoForm, 'exchange', {
              category_id: response.exchange_category_id,

              enable_exchange: response.goods_type === 'POINT' ? 1 : 0,

              exchange_money: response.exchange_money,

              exchange_point: response.exchange_point
            })
            this.isShowExchangeConfig = (this.baseInfoForm.exchange.enable_exchange === 1)
          }
          /** 商品相册校验属性 */
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
          /** 商品规格校验属性  */
          if (!this.baseInfoForm.sku_list) {
            this.baseInfoForm.sku_list = []
          }
          /** 查询品牌列表 */
          this.getGoodsBrandList()

          /** 运费模板列表 */
          this.getTplList()

          /** 查询草稿箱商品参数信息 */
          this.GET_GoodsDtagtParams()

          /** 查询草稿箱sku信息 */
          API_goods.draftSku(this.activeGoodsId, {}).then((response) => {
            /** 构造临时规格数据 */
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

      /** 查询草稿箱商品参数信息 */
      GET_GoodsDtagtParams() {
        // 处理数据 方便校验
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

      /** 查询商品品牌列表 */
      getGoodsBrandList() {
        API_goods.getGoodsBrandList(this.baseInfoForm.category_id, { }).then((response) => {
          this.brandList = response
        })
      },

      /** 商品品牌 改变时触发 */
      changeGoodsBrand(val) {
        this.baseInfoForm.brand_id = val
      },

      /** 运费模板列表 */
      getTplList() {
        API_goods.getTplList(this.activeGoodsId, { }).then((response) => {
          this.tplList = response
        })
      },

      /** 选中值卖家运费/买家运费时触发 */
      changeTplItem(val) {
        if (this.tplList[0] && this.tplList[0].id) {
          this.baseInfoForm.template_id = val === 0 ? this.tplList[0].id : ''
        }
      },

      /** 运费模板改变时触发 */
      changeTpl(val) {
        this.baseInfoForm.template_id = this.baseInfoForm.goods_transfee_charge === 0 ? val : ''
      },

      /** 积分商品商城分类列表 */
      getGoodsCatrgory() {
        API_goods.getExchangeCatsList(0).then((response) => {
          this.exchangeGoodsCatrgoryList = response
        })
      },

      /** 积分兑换开关值改变时触发 */
      handleSwitchexchange(val) {
        this.isShowExchangeConfig = val
        if (val) {
          this.baseInfoForm.exchange.enable_exchange = 1
        } else {
          this.baseInfoForm.exchange.enable_exchange = 0
        }
      },

      /** 积分商品商城分类 改变时触发*/
      changeExangeCategory(val) {
        this.baseInfoForm.exchange.category_id = val
      },

      /** 文件列表移除文件时的钩子  图片删除校验*/
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

      /** 文件列表上传成功时的钩子  上传成功校验 */
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

      /** 点击已上传的文件链接时的钩子 放大 */
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogImage = true
      },

      /** 拖拽改变图片顺序 */
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

      /** 图片上传之前的校验  */
      beforeAvatarUpload(file) {
        const isType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        const isLt1M = file.size / 1024 / 1024 < 1

        if (!isType) {
          this.$message.error('上传头像图片只能是 JPG/JPEG/PNG 格式!')
        }
        if (!isLt1M) {
          this.$message.error('上传商品相册图片大小不能超过 1MB!')
        }

        /** 重复校验*/
        const isExit = this.baseInfoForm.goods_gallery_list.some(key => {
          return file.name === key.name
        })
        if (isExit) {
          this.$message.error('图片已存在')
        }

        return isType && isLt1M && !isExit
      },

      /** 规格选择器规格数据改变时触发 */
      finalSku(val) {
        // 如果没有规格 则不得编辑总库存
        this.isEditQuantity = !!val.length
        // 动态修改总库存 每次设置为0  此处每次进行循环计算 存在性能浪费
        // 如果是编辑模式 总库存不得重置为0
        this.baseInfoForm.quantity = 0
        val.forEach(key => {
          if (key.quantity) {
            this.baseInfoForm.quantity += parseInt(key.quantity)
          }
        })
        /** 删除 因为对象浅拷贝造成的字段冗余（不必要的字段）*/
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
        /** 规格数据是否存在变化 */
        this.baseInfoForm.has_changed = 1
      },

      /** 构造表单数据 */
      generateFormData(data) {
        let _params = {
          ...data
        }
        // 删除不必要的表单数据
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
        /** 积分商品数据 */
        if (!this.isShowExchangeConfig) {
          _params.exchange.enable_exchange = 0
        } else {
          _params.exchange.exchange_money = parseFloat(_params.exchange.exchange_money)
        }
        /** 运费模板 */
        _params.template_id = _params.template_id || 0
        /** 处理UE的信息 */
        if (this.activestep === 2) {
          _params.intro = this.$refs['ue'].getUEContent()
        }
        return _params
      },

      /** 商品规格选择器校验 */
      skuFormVali(isDraft) {
        /** 如果并未选择规格 */
        if (Array.isArray(this.baseInfoForm.sku_list) && this.baseInfoForm.sku_list.length === 0) {
          return true
        }
        this.productSn = false
        /** 是否自动生成货号校验 检测是否所有的货号都存在*/
        const _sn = this.baseInfoForm.sku_list.some(key => {
          return key.sn === ''
        })
        if (_sn) {
          this.$confirm('您没有为SKU填写货号，系统将根据商品货号自动生成, 是否继续?', '提示').then(() => {
            this.productSn = true
          })
          return false
        }
        /** 规格值空校验 */
        let _result = false
        this.baseInfoForm.sku_list.forEach(key => {
          Object.values(key).forEach(item => {
            if (!item && item !== 0) {
              _result = true
            }
          })
        })
        if (_result) {
          this.$message.error('存在未填写的规格值')
          return false
        }
        // 规格值校验
        let spec_fun = false
        let spec_tip
        this.baseInfoForm.sku_list.forEach(key => {
          if (!RegExp.money.test(key.cost)) {
            spec_fun = true
            spec_tip = '请输入正确的成本价金额'
          }
          if (!RegExp.money.test(key.price)) {
            spec_fun = true
            spec_tip = '请输入正确的价格'
          }
          if (!(parseInt(key.weight) >= 0 && parseInt(key.weight) < 99999999)) {
            spec_fun = true
            spec_tip = '重量须为0 - 99999999之间的整数'
          }
          if (!(parseInt(key.quantity) >= 0 && parseInt(key.quantity) < 99999999) || !/^[0-9]\d*$/.test(key.quantity)) {
            spec_fun = true
            spec_tip = '库存须为0 - 99999999之间的整数'
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
  /*选择商品品类*/
  .content-goods-publish {
    padding: 15px;
    margin: 0 auto;
    text-align: center;
    border: 1px solid #ddd;
    background: none repeat  0 0 #fff;

    /*商品品类*/
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

    /** 当前品类被选中的样式 */
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

  /*编辑基本信息*/
  .el-form {
    padding-bottom: 80px;
    .el-form-item {
      width: 100%;
      text-align: left;
    }
  }

  /*平铺*/
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

    /** 审核信息-拒绝原因 */
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

  /*折叠面板*/
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

  /*商品描述*/
  .goods-intro {
    line-height: 40;
  }

  /** 底部步骤 */
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

  /*图片上传组件第一张图设置封面*/
  .goods-images {
    /deep/ li.el-upload-list__item:first-child {
      position: relative;
    }
    /deep/ li.el-upload-list__item:first-child:after {
      content:"封";
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
