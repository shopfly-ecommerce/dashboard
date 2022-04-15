<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleToggleClick">
      <el-tab-pane label="List of live products" name="LiveVideoList">
        <en-table-layout
          :tableData="tableData.data"
          :loading="loading"
        >
          <div slot="toolbar" class="inner-toolbar">
            <div class="toolbar-btns">
              <el-button size="mini" type="primary" @click="handleAddliveVideoGoods">add</el-button>
            </div>
            <div class="toolbar-search">
              <en-table-search @search="searchEvent" placeholder="Please enter the keywords"/>
            </div>
          </div>
          <template slot="table-columns">
            <el-table-column label="Name" min-width="200">
              <template slot-scope="scope">
                <div class="goods-info">
                  <div class="goods-image" style="margin: 0 20px;">
                    <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank">
                      <img :src="scope.row.img_show_url"/>
                    </a>
                  </div>
                  <div class="goods-name-box">
                    <div class="goods-name">
                      <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="i_blank" style="color: #00a2d4;"><span v-html="scope.row.name">{{ scope.row.name }}</span></a>
                    </div>
                    <span>SN:{{scope.row.sn}}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="specificationsSKU">
              <template slot-scope="scope">
                <span>{{ getSkuList(scope.row.specs) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Live broadcast of the price">
              <template slot-scope="scope">{{ scope.row.price | unitPrice('￥') }}</template>
            </el-table-column>
            <el-table-column label="Inventory" prop="quantity"/>
            <el-table-column label="Status">
              <template slot-scope="scope">{{ scope.row.audit_status | filterStatus }}</template>
            </el-table-column>
            <el-table-column label="Operation" min-width="200">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  :disabled="scope.row.audit_status === 0 || scope.row.audit_status === 2 || scope.row.audit_status === 3"
                  @click="handleWithdrawLiveVideoGoods(scope.$index, scope.row)">To withdraw</el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDeleteLiveVideoGoods(scope.$index, scope.row)">delete</el-button>
                  <el-button
                  size="mini"
                  type="text"
                  :disabled="scope.row.audit_status === 1 || scope.row.audit_status === 2"
                  @click="handleSubmitLiveVideoGoods(scope.$index, scope.row)">{{ scope.row.audit_status === 0 ? 'Submit audit' : 'To submit again'}}</el-button>
                  <el-button
                  size="mini"
                  type="text"
                  :disabled="scope.row.audit_status === 1"
                  @click="handleupDateLiveVideoGoods(scope.$index, scope.row)">Update the goods</el-button>
              </template>
            </el-table-column>
          </template>
          <el-pagination
            v-if="tableData"
            slot="pagination"
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"
            :current-page="tableData.page_no"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="tableData.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.data_total">
          </el-pagination>
        </en-table-layout>
      </el-tab-pane>
      <el-tab-pane :label="AddLiveVideoGoods" name="add">
        <el-form
          :model="LiveVideoForm"
          :rules="rules"
          ref="LiveVideoForm"
          label-width="120px"
          class="goods-publish">
          <div class="base-info-item">
            <el-form-item  label="Commodity images：" prop="img_show_url">
              <el-upload
                :action="MixinWXUploadApi"
                :data="data"
                list-type="picture-card"
                :multiple="false"
                :limit="1"
                :file-list="cover_img_file"
                :before-upload="beforeAvatarUpload"
                :on-remove="() => { LiveVideoForm.cover_img_url = ''; LiveVideoForm.img_show_url = ''; cover_img_file = [] }"
                :on-success="(res) => { LiveVideoForm.cover_img_url = res.media_id; LiveVideoForm.img_show_url = res.url; this.$refs['LiveVideoForm'].validateField('img_show_url') }"
                :on-exceed="() => { $message.error('The number of files exceeds the limit！') }"
                :disabled="LiveVideoForm.audit_status === 2">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">note：Pictures are valid for three days</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="Live goods：" prop="goods_id">
              <el-button type="primary" @click="chooseLiveVideoGoods" :disabled="LiveVideoForm.audit_status === 2">Choose goods</el-button>
            </el-form-item>
            <el-form-item label="Name：" prop="name">
              <el-input v-model="LiveVideoForm.name" placeholder="Longest item name14A character" :readonly="LiveVideoForm.audit_status === 2"></el-input>
            </el-form-item>
            <el-form-item label="Product  price：" v-if="LiveVideoForm.original_price">
              <span>{{ LiveVideoForm.original_price | unitPrice('￥')}}</span>
            </el-form-item>
            <el-form-item label="Live broadcast of the price：" prop="price">
              <el-input v-model="LiveVideoForm.price" placeholder="Please enter the live broadcast price"></el-input>
              <span class="tip">note：Approved products are only allowed to modify the price of live broadcast</span>
            </el-form-item>
          </div>
          <!--The submit button-->
          <div class="btn-submit">
            <el-form-item>
              <el-button v-show="editEnabled" type="primary" @click="handleSaveLiveVideoGoods('LiveVideoForm')">Save Settings</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!--Commodity selector-->
    <en-goods-sku-picker
      type="seller"
      goods-type="NORMAL"
      :sku="true"
      :show="showDialog"
      :api="goodsApi"
      :defaultData="skuIds"
      :categoryApi="categoryApi"
      :multipleApi="multipleApi"
      :limit="maxsize"
      @confirm="refreshFunc"
      @close="showDialog = false"/>
  </div>
</template>

<script>
  import * as API_Live from '@/api/live'
  import * as API_goods from '@/api/goods'
  import { api } from '~/ui-domain'
  import Storage from '@/utils/storage'
  import { GoodsSkuPicker } from '@/components'
  import { RegExp } from '~/ui-utils'

  export default {
    name: 'liveVideoGoodsList',
    components: {
      [GoodsSkuPicker.name]: GoodsSkuPicker
    },
    data() {
      const checkPrice = (rule, value, callback) => {
        if (!value && value !== 0) {
          return callback(new Error('The price of live broadcast cannot be empty'))
        }
        setTimeout(() => {
          if (!RegExp.money.test(value)) {
            callback(new Error('Please enter a positive integer or two decimal places'))
          } else if (parseFloat(value) > 99999999) {
            callback(new Error('Set the live broadcast price above the upper limit'))
          } else {
            callback()
          }
        }, 1000)
      }
      return {
        activeName: 'LiveVideoList',

        AddLiveVideoGoods: 'Add the goods',

        /** Wechat picture upload type*/
        data: {
          type: 'image'
        },

        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },

        /** Commodity list data*/
        tableData: '',

        /** Validation rules*/
        rules: {
          img_show_url: [
            { required: true, message: 'Please select the picture of the product', trigger: 'blur' }
          ],
          goods_id: [
            { required: true, message: 'Please select live streaming products', trigger: 'blur' }
          ],
          name: [
            { required: true, message: 'Please enter the name of the live product', trigger: 'blur' },
            { min: 6, max: 14, message: 'The length of the item name is at6-14A character', trigger: 'blur' }
          ],
          price: [
            { required: true, message: 'Please enter the live broadcast price', trigger: 'blur' },
            { validator: checkPrice, trigger: 'blur' }
          ]
        },

        /** Add the goods*/
        LiveVideoForm: {
          id: '',
          name: '',
          price: '',
          sku_id: '',
          goods_id: '',
          cover_img_url: '',
          img_show_url: ''
        },

        cover_img_file: [],

        /** productskuIds */
        skuIds: [],

        /** Maximum length of commodity selector*/
        maxsize: 1,

        /** Product selector listapi*/
        goodsApi: 'seller/goods/skus',

        /** Mall classificationapi */
        categoryApi: 'seller/goods/category/0/children',

        /** Echo data usage*/
        multipleApi: 'seller/goods/skus/@ids/details',

        /** According to/Hide the product selector*/
        showDialog: false,

        /** Uneditable that is, whether it is in progress or invalid. Default yes*/
        editEnabled: true
      }
    },
    filters: {
      /** Status*/
      filterStatus(val) {
        switch (val) {
          case 0: return 'Not audit'
          case 1: return 'In the review'
          case 2: return 'approved'
          case 3: return 'Audit failure'
          case 4: return 'Has withdrawn'
        }
      }
    },
    mounted() {
      this.GET_LiveVideoGoodsList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_LiveVideoGoodsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_LiveVideoGoodsList()
      },

      /** Search Event Trigger*/
      searchEvent(keyword) {
        this.params.page_no = 1
        this.params = {
          ...this.params,
          page_no: 1,
          name: keyword
        }
        if (!keyword) delete this.params.name
        this.GET_LiveVideoGoodsList()
      },

      /** Switch panel*/
      handleToggleClick(tab, event) {
        this.activeName = tab.name
        this.cover_img_file = []
        if (this.activeName === 'LiveVideoList') {
          this.GET_LiveVideoGoodsList()
        } else if (this.activeName === 'add') {
          this.AddLiveVideoGoods = 'Add the goods'
          this.LiveVideoForm = {
            id: '',
            name: '',
            price: '',
            sku_id: '',
            goods_id: '',
            cover_img_url: '',
            img_show_url: ''
          }
        }
      },

      /** Displays the product selector*/
      chooseLiveVideoGoods() {
        this.showDialog = true
        // this.goodsIds = this.gruopBuyForm.sku_id ? [this.gruopBuyForm.sku_id] : []
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
          this.LiveVideoForm.goods_id = _val.goods_id
          this.LiveVideoForm.sku_id = _val.sku_id
          this.LiveVideoForm.name = _val.goods_name
          this.LiveVideoForm.original_price = _val.price
          this.LiveVideoForm.sn = _val.sn
        }
      },

      /** Add live streaming products*/
      handleAddliveVideoGoods() {
        this.activeName = 'add'
        this.cover_img_file = []
        this.AddLiveVideoGoods = 'Add the goods'
        this.LiveVideoForm = {
          id: '',
          name: '',
          price: '',
          sku_id: '',
          goods_id: '',
          cover_img_url: '',
          img_show_url: ''
        }
      },

      /** Delete live broadcast products*/
      handleDeleteLiveVideoGoods(index, row) {
        this.$confirm('Are you sure you want to delete this item？', 'prompt', {
          confirmButtonText: 'save',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          API_Live.deleteLiveVideoGoods(row.id).then(() => {
            this.GET_LiveVideoGoodsList()
            this.$message.success('Delete the success！')
          })
        })
      },

      /** Submit goods for review*/
      handleSubmitLiveVideoGoods(index, row) {
        if (row.audit_status === 0) {
          API_Live.submitAuditLiveVideoGoods(row.id).then(() => {
            this.GET_LiveVideoGoodsList()
            this.$message.success('Submitted successfully！')
          })
        } else {
          API_Live.againAuditLiveVideoGoods(row.id).then(() => {
            this.GET_LiveVideoGoodsList()
            this.$message.success('Submitted successfully！')
          })
        }
      },

      /** Withdrawal of product review*/
      handleWithdrawLiveVideoGoods(index, row) {
        API_Live.resetAuditLiveVideoGoods(row.id).then(() => {
          this.GET_LiveVideoGoodsList()
          this.$message.success('Revocation of success！')
        })
      },

      /** Update the goods*/
      handleupDateLiveVideoGoods(index, row) {
        API_Live.getLiveGoods(row.id).then(response => {
          this.activeName = 'add'
          this.AddLiveVideoGoods = 'Edit commodity'
          this.cover_img_file = response.img_show_url ? [{ name: 'img_show_url', url: response.img_show_url }] : []
          this.LiveVideoForm = { ...response }
        })
      },

      /** Get specification list*/
      getSkuList(val) {
        const _val = typeof val === 'string' ? JSON.parse(val) : val
        if (_val) {
          let _specs = []
          _val.forEach(elem => {
            _specs.push(elem.spec_value)
          })
          _specs = _specs.join('/')
          return _specs
        }
        return '/'
      },

      /** Verify images before uploading*/
      beforeAvatarUpload(file) {
        const isType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        if (!isType) {
          this.$message.error('Upload pictures can only beJPG/JPEG/PNG Format!')
        }
        const isSize = new Promise((resolve, reject) => {
          let _URL = window.URL || window.webkitURL
          let img = new Image()
          img.onload = () => {
            let valid = img.width <= 300 && img.height <= 300
            valid ? resolve() : reject()
          }
          img.src = _URL.createObjectURL(file)
        }).then(() => {
          return file
        }, () => {
          this.$message.error('It is recommended that the width should not exceed300pixel、No higher than300pixel的图片')
          return Promise.reject()
        })
        return isType && isSize
      },

      /** Save live merchandise*/
      handleSaveLiveVideoGoods(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = this.LiveVideoForm
            if (params.id) {
              API_Live.updateLiveGoods(params.id, params).then(response => {
                this.$message.success('Save Settings successfully！')
                this.activeName = 'LiveVideoList'
                this.AddLiveVideoGoods = 'Add the goods'
                this.GET_LiveVideoGoodsList()
              })
            } else {
              API_Live.addLiveVideoGoods(params).then(response => {
                this.$message.success('Save Settings successfully！')
                this.activeName = 'LiveVideoList'
                this.AddLiveVideoGoods = 'Add the goods'
                this.GET_LiveVideoGoodsList()
              })
            }
          } else {
            this.$message.error('There is an error in the form. Please correct it')
          }
        })
      },

      /** Get a list of live merchandise*/
      GET_LiveVideoGoodsList() {
        this.loading = true
        API_Live.getLiveVideoGoodsList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => (this.loading = false))
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  .inner-toolbar {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .toolbar-search {
    margin-right: 10px;
  }

  .goods-info {
    display: flex;
    align-items: center;
    .goods-image {
      img {
        width: 80px;
        height: 80px;
      }
    }
    .goods-name-box {
      text-align: left;
      .goods-name {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        a:hover {
          color: #f42424 !important;
        }
      }
    }
  }
  .goods-publish {
    padding: 15px;
    border: 1px solid #ddd;
    background: none repeat scroll 0 0 #fff;
    .el-form-item {
      width: 22%;
      min-width: 300px;
    }
    .tip {
      font-size: 12px;
      color: #606266;
    }
  }
</style>
