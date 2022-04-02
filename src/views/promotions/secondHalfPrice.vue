<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleToggleClick">
      <el-tab-pane label="第二件半价列表" name="seconedHalfList">
        <en-table-layout
          toolbar
          pagination
          :tableData="tableData"
          :loading="loading">
          <div slot="toolbar" class="inner-toolbar">
            <div class="toolbar-btns">
              <el-button type="primary" @click="handleAddSeconedHalf">新增</el-button>
            </div>
            <div class="toolbar-search">
              <en-table-search @search="searchEvent"/>
            </div>
          </div>
          <template slot="table-columns">
            <!--活动名称-->
            <el-table-column prop="title" label="活动名称"/>
            <!--开始时间-->
            <el-table-column label="开始时间" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.start_time | unixToDate }}</span>
              </template>
            </el-table-column>
            <!--结束时间-->
            <el-table-column label="结束时间" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.end_time | unixToDate }}</span>
              </template>
            </el-table-column>
            <!--活动类型-->
            <el-table-column prop="activity_type" label="活动类型" :formatter="activityType" width="120"/>
            <!--活动状态-->
            <el-table-column label="活动状态" prop="status_text" width="120"/>
            <!--操作-->
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  v-html="(scope.row.status === 'END' || scope.row.status === 'UNDERWAY') ? '查看' : '编辑'"
                  type="success"
                  @click="handleEditMould(scope.row)">
                </el-button>
                <el-button
                  :disabled="scope.row.status === 'UNDERWAY'"
                  type="danger"
                  @click="handleDeleteFullCut(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </template>
          <el-pagination
            slot="pagination"
            v-if="pageData"
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"
            :current-page="pageData.page_no"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageData.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageData.data_total">
          </el-pagination>
        </en-table-layout>
      </el-tab-pane>
      <el-tab-pane :label="secondHalfPriceName" name="add">
        <div class="content-goods-publish">
          <el-form
            :model="activityForm"
            status-icon
            :rules="rules"
            label-position="right"
            ref="activityForm"
            label-width="120px"
            class="demo-ruleForm">
            <!--活动信息-->
            <div class="base-info-item">
              <h4>活动信息</h4>
              <div>
                <el-form-item  label="活动名称：" prop="title">
                  <el-input
                    v-model="activityForm.title"
                    @change="activityForm.title  = activityForm.title.trim()"
                    style="width: 300px"
                    placeholder="不超过50个字符"
                    maxLength="50"
                  ></el-input>
                </el-form-item>
                <el-form-item label="生效时间：" prop="take_effect_time">
                  <el-date-picker
                    v-model="activityForm.take_effect_time"
                    type="datetimerange"
                    value-format="timestamp"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="[MixinDefaultTime, MixinDefaultTime]"
                    :picker-options="{disabledDate(time) { return time.getTime() < Date.now() - 8.64E7 }}">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="活动描述：">
                  <UE ref="UE" :defaultMsg="activityForm.description"></UE>
                </el-form-item>
              </div>
            </div>
            <!--优惠设置-->
            <div class="base-info-item">
              <h4>优惠设置</h4>
              <div>
                <el-form-item label="优惠方式：">
                  第二件半价
                </el-form-item>
              </div>
            </div>
            <!--活动商品-->
            <div class="base-info-item">
              <h4>活动商品</h4>
              <div>
                <div class="activity-goods">
                  <el-form-item label="活动商品：" prop="range_type">
                    <el-radio-group v-model="activityForm.range_type" @change="changeJoinGoods">
                      <el-radio :label="1">全部商品参与</el-radio>
                      <el-radio :label="2">部分商品参与</el-radio>
                    </el-radio-group>
                    <!--商品表格-->
                    <div v-show="!goodsShow" class="goods-table">
                      <en-table-layout
                        toolbar
                        :tableData="activityForm.goods_list"
                        :loading="loading"
                        :selectionChange="selectionChange">
                        <div slot="toolbar" class="inner-toolbar">
                          <div class="toolbar-btns">
                            <el-button type="primary" @click="showGoodsSelector">选择商品</el-button>
                            <el-button type="danger" @click="cancelall">批量取消</el-button>
                          </div>
                        </div>
                        <template slot="table-columns">
                          <el-table-column type="selection"/>
                          <!--商品信息-->
                          <el-table-column  label="商品信息">
                            <template slot-scope="scope">
                              <div class="goods-info">
                                <img :src="scope.row.thumbnail" alt="" class="goods-image">
                                <div>
                                  <a
                                    :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`"
                                    target="_blank"
                                    style="color: #00a2d4;">{{ scope.row.goods_name }}</a>
                                  <span>{{ scope.row.price | unitPrice('￥') }}</span>
                                </div>
                              </div>
                            </template>
                          </el-table-column>
                          <!--库存-->
                          <el-table-column prop="enable_quantity" label="库存" />
                          <!--操作-->
                          <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                              <el-button
                                type="danger"
                                @click="handleCancleJoin(scope.$index, scope.row)">取消参加
                              </el-button>
                            </template>
                          </el-table-column>
                        </template>
                      </en-table-layout>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
            <!--提交按钮-->
            <div class="btn-submit">
              <el-form-item>
                <el-button v-show="editEnabled" type="primary" @click="handleSaveActivity('activityForm')">保存设置</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!--遮罩层-->
        <div :class="{'cus-mask': !editEnabled}"></div>
      </el-tab-pane>
    </el-tabs>
    <!--商品选择器-->
    <en-goods-picker
      type="seller"
      goods-type="NORMAL"
      :show="showDialog"
      :api="goodsApi"
      :multipleApi="multipleApi"
      :categoryApi="categoryApi"
      :defaultData="goodsIds"
      :limit="maxsize"
      @confirm="refreshFunc"
      @close="showDialog = false"/>
  </div>
</template>

<script>
  import * as API_activity from '@/api/activity'
  import { CategoryPicker, UE } from '@/components'

  export default {
    name: 'secondHalfPrice',
    components: {
      [CategoryPicker.name]: CategoryPicker,
      [UE.name]: UE
    },
    data() {
      const checkRange = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请选择商品参与方式'))
        } else {
          callback()
        }
      }
      const checkTakeEffectTime = (rule, value, callback) => {
        const now = new Date().getTime()
        if (!value) {
          return callback(new Error('请选择生效时间'))
        } else if (value[0] <= now) {
          callback(new Error('活动开始时间不得小于当前时间'))
        } else {
          callback()
        }
      }
      return {
        /** 当前面板的名字*/
        activeName: 'seconedHalfList',

        /** 新增活动面板标题 */
        secondHalfPriceName: '新增第二件半价活动',

        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },

        /** 列表数据*/
        tableData: [],

        /** 列表分页数据 */
        pageData: null,

        /** 商品ids */
        goodsIds: [],

        /** 新增满减表单信息*/
        activityForm: {
          /** 活动ID*/
          hp_id: '',

          /** 活动名称*/
          title: '',

          /** 生效时间*/
          take_effect_time: [],

          /** 活动描述*/
          description: '',

          /** 优惠方式*/
          discount_mode: '',

          /** 是否全部商品参与*/
          range_type: '',

          /** 活动商品*/
          goods_list: []
        },

        /** 表单校验规则*/
        rules: {
          title: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 0, max: 60, message: '长度在60个字符之内', trigger: 'blur' }
          ],
          take_effect_time: [
            { type: 'array', required: true, message: '请选择生效时间', trigger: 'blur' },
            { validator: checkTakeEffectTime, trigger: 'blur' }
          ],
          /** 商品参与方式 */
          range_type: [
            { required: true, validator: checkRange, trigger: 'blur' }
          ]
        },

        /** 是否显示商品表格*/
        goodsShow: true,

        // 是否不可编辑 即是否是进行中 或者已失效状态 默认可以
        editEnabled: true,

        /** 选择的goods_id*/
        selectionids: [],

        /** 商品选择器最大长度*/
        maxsize: 0,

        /** 商品选择器列表api*/
        goodsApi: 'seller/goods?market_enable=1&is_auth=1',

        /** 商城分类api */
        categoryApi: 'seller/goods/category/0/children',

        /** 回显数据使用 */
        multipleApi: 'seller/goods/@ids/details',

        /** 显示/隐藏商品选择器 */
        showDialog: false
      }
    },
    mounted() {
      this.GET_SecondHalfActivityList()
    },
    methods: {
      /** 活动类型 */
      activityType(row, column, cellValue) {
        return '第二件半价'
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params = {
          ...this.params,
          keywords: data
        }
        this.GET_SecondHalfActivityList()
      },

      /** 切换面板*/
      handleToggleClick(tab, event) {
        this.activeName = tab.name
        if (this.activeName === 'seconedHalfList') {
          this.GET_SecondHalfActivityList()
        } else if (this.activeName === 'add') {
          this.secondHalfPriceName = '新增第二件半价活动'
          this.editEnabled = true
          this.activityForm = {
            hp_id: '',
            title: '',
            take_effect_time: [],
            description: '',
            full_money: '',
            discount_mode: '',
            goods_list: []
          }
        }
      },

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_SecondHalfActivityList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_SecondHalfActivityList()
      },

      /** 是否全选商品*/
      changeJoinGoods(val) {
        this.goodsShow = val === 1
      },

      /** 保存商品选择器选择的商品 */
      refreshFunc(val) {
        if (val) {
          this.activityForm.goods_list = val
        }
      },

      /** 显示商品选择器*/
      showGoodsSelector() {
        this.showDialog = true
        this.goodsIds = this.activityForm.goods_list.map(key => {
          return key.goods_id
        })
      },

      /** 取消参加*/
      handleCancleJoin(index, row) {
        this.activityForm.goods_list.forEach((elem, _index) => {
          if (index === _index) {
            this.activityForm.goods_list.splice(_index, 1)
          }
        })
        this.goodsIds = this.activityForm.goods_list.map(key => {
          return key.goods_id
        })
      },

      selectionChange(val) {
        this.selectionids = val.map(item => item.goods_id)
      },
      /** 批量取消 */
      cancelall() {
        this.selectionids.forEach(key => {
          this.activityForm.goods_list.forEach((elem, index) => {
            if (elem.goods_id === key) {
              this.activityForm.goods_list.splice(index, 1)
            }
          })
          this.$message.success('批量取消成功！')
        })
        this.goodsIds = this.activityForm.goods_list.map(key => {
          return key.goods_id
        })
      },

      /** 获取活动信息*/
      GET_SecondHalfActivityList() {
        this.loading = true
        API_activity.getSecondHalfActivityList(this.params).then(response => {
          this.loading = false
          this.tableData = response.data
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
        })
      },

      /** 编辑活动 */
      handleEditMould(row) {
        this.activeName = 'add'
        this.secondHalfPriceName = '编辑第二件半价活动'
        this.editEnabled = !(row.status === 'END' || row.status === 'UNDERWAY')
        setTimeout(() => { this.$refs['activityForm'].resetFields() })
        this.GET_SingleCutActivityDetails(row.hp_id)
      },

      /** 查询一个第二件半价活动信息 */
      GET_SingleCutActivityDetails(id) {
        if (id) {
          API_activity.getSeconedHalfActivityDetails(id, {}).then(response => {
            this.activityForm = {
              ...response,
              take_effect_time: [parseInt(response.start_time) * 1000, parseInt(response.end_time) * 1000]
            }
            this.goodsShow = this.activityForm.range_type === 1
            this.activityForm.goods_list = response.goods_list
          })
        }
      },

      /** 删除活动 */
      handleDeleteFullCut(row) {
        this.$confirm('确认删除当前项？', '确认信息', { type: 'warning' })
          .then(() => this.toDelActivity(row))
          .catch(() => {
          })
      },

      /** 执行删除*/
      toDelActivity(row) {
        API_activity.deleteSeconedHalfActivity(row.hp_id, {}).then(() => {
          this.$message.success('删除成功！')
          this.GET_SecondHalfActivityList()
        })
      },

      /** 新增 */
      handleAddSeconedHalf() {
        this.activeName = 'add'
        this.secondHalfPriceName = '新增第二件半价活动'
        this.editEnabled = true
        this.activityForm = {
          title: '',
          take_effect_time: [],
          description: '',
          discount_mode: '',
          goods_list: []
        }
      },

      /** 保存表单设置*/
      handleSaveActivity(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const _params = this.generateFormData(this.activityForm)
            delete _params.take_effect_time
            if (this.activityForm.hp_id) {
              API_activity.saveSeconedHalfActivity(this.activityForm.hp_id, _params).then(() => {
                this.$message.success('保存设置成功！')
                this.activeName = 'seconedHalfList'
                this.GET_SecondHalfActivityList()
              }).catch((res) => {
                if (res.response.data.code === '401' && res.response.data.data) {
                  const goods_name = JSON.parse(res.response.data.data).map(key => { return key.name }).toString()
                  this.$message.error(`${goods_name}已经参加其它活动，于当前活动存在冲突`)
                } else {
                  this.$message.error(res.response.data.message)
                }
              })
            } else {
              API_activity.addSeconedHalfActivity(_params).then(() => {
                this.$message.success('添加成功！')
                this.activeName = 'seconedHalfList'
                this.GET_SecondHalfActivityList()
              }).catch((res) => {
                if (res.response.data.code === '401' && res.response.data.data) {
                  const goods_name = JSON.parse(res.response.data.data).map(key => { return key.name }).toString()
                  this.$message.error(`${goods_name}已经参加其它活动，于当前活动存在冲突`)
                } else {
                  this.$message.error(res.response.data.message)
                }
              })
            }
          } else {
            this.$message.error('表单存在错误，请修正')
          }
        })
      },

      /** 构造表单数据 */
      generateFormData(data) {
        let _goodslist = []
        if (data.goods_list && Array.isArray(data.goods_list) && this.activityForm.range_type === 2) {
          _goodslist = data.goods_list.map(key => {
            return {
              goods_id: key.goods_id,
              name: key.goods_name,
              goods_name: key.goods_name,
              thumbnail: key.thumbnail
            }
          })
        }
        const _params = {
          /** 活动名称/标题 */
          title: data.title,

          /** 活动开始时间 */
          start_time: data.take_effect_time[0] / 1000,

          /** 活动结束时间 */
          end_time: data.take_effect_time[1] / 1000,

          /** 商品参与方式 */
          range_type: data.range_type
        }
        /** 活动描述 */
        _params.description = this.$refs.UE.getUEContent()
        if (_goodslist.length > 0 && this.activityForm.range_type === 2) {
          /** 参与商品列表 */
          _params.goods_list = _goodslist
        } else {
          delete _params.goods_list
        }
        return _params
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>

  /deep/ div.toolbar {
    height: 70px;
    padding: 20px 0;
  }

  .goods-image {
    width: 50px;
    height: 50px;
  }
  /*新增表单面板*/
  /deep/ .el-form-item__content {
    width: 80%;
    .el-input .el-input--medium {
      max-width: 80%;
    }
  }

  /*百度UE*/
  /deep/ #edui1 {
    width: 100% !important;
  }

  .content-goods-publish {
    padding: 15px;
    margin: 0 auto;
    text-align: center;
    border: 1px solid #ddd;
    background: none repeat scroll 0 0 #fff;
  }

  /*表单信息*/
  .el-form {
    padding-bottom: 80px;
    .el-form-item {
      width: 100%;
      text-align: left;

      /*送积分*/
      .integral-show {
        .el-input {
          width: 50px;
        }
      }
      /** 下拉列表 */
      /deep/ .el-select .el-select--medium {
        width: 160px;
      }
    }
    .discount-model {
      div {
        margin: 5px 0;
      }
    }

    /*提交按钮*/
    /deep/ .btn-submit {
      width: 100%;
      .el-form-item__content {
        text-align: center;
      }
    }
  }

  /** 表格信息 */
  .goods-info {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    div {
      a {
        color: #409EFF;
      }
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: flex-start;
      margin-left: 20px;
    }
  }

  /*平铺*/
  div.base-info-item {
    h4 {
      padding:0 10px;
      border: 1px solid #ddd;
      background-color: #f8f8f8;
      font-weight: bold;
      color: #333;
      font-size: 14px;
      line-height: 40px;
      text-align: left;
    }
    h4 + div {
      margin-top: 15px;
    }
    .el-form-item {
      margin-left: 5%;
      min-width: 300px;
    }
    .el-form-item__content {
      margin-left: 120px;
      text-align: left;
    }
    p.goods-group-manager {
      padding-left: 12.3%;
      text-align: left;
      color: #999;
      font-size: 13px;
    }
  }

  /*商品表格信息*/
  .goods-table {
    /deep/ thead>tr {
      /deep/ th:nth-child(2) {
        text-align: left !important;
      }
    }
  }

  /*遮罩层*/
  .cus-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
  }
</style>


