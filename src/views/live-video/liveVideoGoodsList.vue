<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleToggleClick">
      <el-tab-pane label="直播商品列表" name="LiveVideoList">
        <en-table-layout
          :tableData="tableData.data"
          :loading="loading"
        >
          <div slot="toolbar" class="inner-toolbar">
            <div class="toolbar-btns">
              <el-button size="mini" type="primary" @click="handleAddliveVideoGoods">添加</el-button>
            </div>
            <div class="toolbar-search">
              <en-table-search @search="searchEvent" placeholder="请输入关键字"/>
            </div>
          </div>
          <template slot="table-columns">
            <el-table-column label="商品名称" min-width="200">
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
                    <span>商品编号:{{scope.row.sn}}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="规格SKU">
              <template slot-scope="scope">
                <span>{{ getSkuList(scope.row.specs) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="直播价格">
              <template slot-scope="scope">{{ scope.row.price | unitPrice('￥') }}</template>
            </el-table-column>
            <el-table-column label="库存" prop="quantity"/>
            <el-table-column label="商品状态">
              <template slot-scope="scope">{{ scope.row.audit_status | filterStatus }}</template>
            </el-table-column>
            <el-table-column label="操作" min-width="200">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  :disabled="scope.row.audit_status === 0 || scope.row.audit_status === 2 || scope.row.audit_status === 3"
                  @click="handleWithdrawLiveVideoGoods(scope.$index, scope.row)">撤回</el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDeleteLiveVideoGoods(scope.$index, scope.row)">删除</el-button>
                  <el-button
                  size="mini"
                  type="text"
                  :disabled="scope.row.audit_status === 1 || scope.row.audit_status === 2"
                  @click="handleSubmitLiveVideoGoods(scope.$index, scope.row)">{{ scope.row.audit_status === 0 ? '提交审核' : '再次提交'}}</el-button>
                  <el-button
                  size="mini"
                  type="text"
                  :disabled="scope.row.audit_status === 1"
                  @click="handleupDateLiveVideoGoods(scope.$index, scope.row)">更新商品</el-button>
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
            <el-form-item  label="商品图片：" prop="img_show_url">
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
                :on-exceed="() => { $message.error('文件数量超过限制！') }"
                :disabled="LiveVideoForm.audit_status === 2">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">注：图片有效期为三天</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="直播商品：" prop="goods_id">
              <el-button type="primary" @click="chooseLiveVideoGoods" :disabled="LiveVideoForm.audit_status === 2">选择商品</el-button>
            </el-form-item>
            <el-form-item label="商品名称：" prop="name">
              <el-input v-model="LiveVideoForm.name" placeholder="商品名称最长14个字符" :readonly="LiveVideoForm.audit_status === 2"></el-input>
            </el-form-item>
            <el-form-item label="商品原价：" v-if="LiveVideoForm.original_price">
              <span>{{ LiveVideoForm.original_price | unitPrice('￥')}}</span>
            </el-form-item>
            <el-form-item label="直播价格：" prop="price">
              <el-input v-model="LiveVideoForm.price" placeholder="请输入直播价格"></el-input>
              <span class="tip">注：审核通过的商品只允许修改直播价格</span>
            </el-form-item>
          </div>
          <!--提交按钮-->
          <div class="btn-submit">
            <el-form-item>
              <el-button v-show="editEnabled" type="primary" @click="handleSaveLiveVideoGoods('LiveVideoForm')">保存设置</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!--商品选择器-->
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
          return callback(new Error('直播价格不能为空'))
        }
        setTimeout(() => {
          if (!RegExp.money.test(value)) {
            callback(new Error('请输入正整数或者两位小数'))
          } else if (parseFloat(value) > 99999999) {
            callback(new Error('直播价格设置超过上限值'))
          } else {
            callback()
          }
        }, 1000)
      }
      return {
        activeName: 'LiveVideoList',

        AddLiveVideoGoods: '添加商品',

        /** 微信图片上传类型 */
        data: {
          type: 'image'
        },

        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },

        /** 商品列表数据 */
        tableData: '',

        /** 校验规则 */
        rules: {
          img_show_url: [
            { required: true, message: '请选择商品图片', trigger: 'blur' }
          ],
          goods_id: [
            { required: true, message: '请选择直播商品', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入直播商品名称', trigger: 'blur' },
            { min: 6, max: 14, message: '商品名称长度在6-14个字符', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入直播价格', trigger: 'blur' },
            { validator: checkPrice, trigger: 'blur' }
          ]
        },

        /** 添加商品 */
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

        /** 商品skuIds */
        skuIds: [],

        /** 商品选择器最大长度*/
        maxsize: 1,

        /** 商品选择器列表api*/
        goodsApi: 'seller/goods/skus',

        /** 商城分类api */
        categoryApi: 'seller/goods/category/0/children',

        /** 回显数据使用 */
        multipleApi: 'seller/goods/skus/@ids/details',

        /** 显示/隐藏商品选择器 */
        showDialog: false,

        /** 是否不可编辑 即是否是进行中 或者已失效状态 默认可以 */
        editEnabled: true
      }
    },
    filters: {
      /** 商品状态 */
      filterStatus(val) {
        switch (val) {
          case 0: return '未审核'
          case 1: return '审核中'
          case 2: return '审核通过'
          case 3: return '审核失败'
          case 4: return '已撤回'
        }
      }
    },
    mounted() {
      this.GET_LiveVideoGoodsList()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_LiveVideoGoodsList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_LiveVideoGoodsList()
      },

      /** 搜索事件触发 */
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

      /** 切换面板*/
      handleToggleClick(tab, event) {
        this.activeName = tab.name
        this.cover_img_file = []
        if (this.activeName === 'LiveVideoList') {
          this.GET_LiveVideoGoodsList()
        } else if (this.activeName === 'add') {
          this.AddLiveVideoGoods = '添加商品'
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

      /** 显示商品选择器*/
      chooseLiveVideoGoods() {
        this.showDialog = true
        // this.goodsIds = this.gruopBuyForm.sku_id ? [this.gruopBuyForm.sku_id] : []
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
          this.LiveVideoForm.goods_id = _val.goods_id
          this.LiveVideoForm.sku_id = _val.sku_id
          this.LiveVideoForm.name = _val.goods_name
          this.LiveVideoForm.original_price = _val.price
          this.LiveVideoForm.sn = _val.sn
        }
      },

      /** 添加直播商品 */
      handleAddliveVideoGoods() {
        this.activeName = 'add'
        this.cover_img_file = []
        this.AddLiveVideoGoods = '添加商品'
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

      /** 删除直播商品 */
      handleDeleteLiveVideoGoods(index, row) {
        this.$confirm('确定要删除此商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API_Live.deleteLiveVideoGoods(row.id).then(() => {
            this.GET_LiveVideoGoodsList()
            this.$message.success('删除成功！')
          })
        })
      },

      /** 提交商品审核 */
      handleSubmitLiveVideoGoods(index, row) {
        if (row.audit_status === 0) {
          API_Live.submitAuditLiveVideoGoods(row.id).then(() => {
            this.GET_LiveVideoGoodsList()
            this.$message.success('提交成功！')
          })
        } else {
          API_Live.againAuditLiveVideoGoods(row.id).then(() => {
            this.GET_LiveVideoGoodsList()
            this.$message.success('提交成功！')
          })
        }
      },

      /** 撤回商品审核 */
      handleWithdrawLiveVideoGoods(index, row) {
        API_Live.resetAuditLiveVideoGoods(row.id).then(() => {
          this.GET_LiveVideoGoodsList()
          this.$message.success('撤销成功！')
        })
      },

      /** 更新商品 */
      handleupDateLiveVideoGoods(index, row) {
        API_Live.getLiveGoods(row.id).then(response => {
          this.activeName = 'add'
          this.AddLiveVideoGoods = '编辑商品'
          this.cover_img_file = response.img_show_url ? [{ name: 'img_show_url', url: response.img_show_url }] : []
          this.LiveVideoForm = { ...response }
        })
      },

      /** 获取规格列表 */
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

      /** 图片上传之前的校验  */
      beforeAvatarUpload(file) {
        const isType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        if (!isType) {
          this.$message.error('上传图片只能是 JPG/JPEG/PNG 格式!')
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
          this.$message.error('建议使用宽度不超过300像素、高度不超过300像素的图片')
          return Promise.reject()
        })
        return isType && isSize
      },

      /** 保存直播商品 */
      handleSaveLiveVideoGoods(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = this.LiveVideoForm
            if (params.id) {
              API_Live.updateLiveGoods(params.id, params).then(response => {
                this.$message.success('保存设置成功！')
                this.activeName = 'LiveVideoList'
                this.AddLiveVideoGoods = '添加商品'
                this.GET_LiveVideoGoodsList()
              })
            } else {
              API_Live.addLiveVideoGoods(params).then(response => {
                this.$message.success('保存设置成功！')
                this.activeName = 'LiveVideoList'
                this.AddLiveVideoGoods = '添加商品'
                this.GET_LiveVideoGoodsList()
              })
            }
          } else {
            this.$message.error('表单存在错误，请修正')
          }
        })
      },

      /** 获取直播商品列表 */
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
