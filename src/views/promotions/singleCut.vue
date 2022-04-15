<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleToggleClick">
      <el-tab-pane label="A short list of items" name="singleCutList">
        <en-table-layout
          toolbar
          pagination
          :tableData="tableData"
          :loading="loading">
          <div slot="toolbar" class="inner-toolbar">
            <div class="toolbar-btns">
              <el-button type="primary" @click="handleAddSingleCut">new</el-button>
            </div>
            <div class="toolbar-search">
              <en-table-search @search="searchEvent"/>
            </div>
          </div>
          <template slot="table-columns">
            <!--The name of the event-->
            <el-table-column prop="title" label="The name of the event"/>
            <!--The start time-->
            <el-table-column label="The start time" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.start_time | unixToDate }}</span>
              </template>
            </el-table-column>
            <!--The end of time-->
            <el-table-column label="The end of time" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.end_time | unixToDate }}</span>
              </template>
            </el-table-column>
            <!--The activity type-->
            <el-table-column prop="activity_type" label="The activity type" :formatter="activityType" width="120"/>
            <!--Active state-->
            <el-table-column label="Active state" prop="status_text" width="120"/>
            <!--Operation-->
            <el-table-column label="Operation" width="180">
              <template slot-scope="scope">
                <el-button
                  v-html="(scope.row.status === 'END' || scope.row.status === 'UNDERWAY') ? 'To view' : 'edit'"
                  type="success"
                  @click="handleEditMould(scope.row)">
                </el-button>
                <el-button
                  :disabled="scope.row.status === 'UNDERWAY'"
                  type="danger"
                  @click="handleDeleteFullCut(scope.row)">delete
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
      <el-tab-pane :label="singleCutName" name="add">
        <div class="content-goods-publish">
          <el-form
            :model="activityForm"
            status-icon
            :rules="rules"
            label-position="right"
            ref="activityForm"
            label-width="120px"
            class="demo-ruleForm">
            <!--Activity information-->
            <div class="base-info-item">
              <h4>Activity information</h4>
              <div>
                <el-form-item  label="The name of the event：" prop="title">
                  <el-input
                    v-model="activityForm.title"
                    style="width: 300px"
                    @change="activityForm.title  = activityForm.title.trim()"
                    placeholder="No more than50A character"
                    maxLength="50"/>
                </el-form-item>
                <el-form-item label="Effect of time：" prop="take_effect_time">
                  <el-date-picker
                    v-model="activityForm.take_effect_time"
                    type="datetimerange"
                    value-format="timestamp"
                    range-separator="-"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    :default-time="[MixinDefaultTime, MixinDefaultTime]"
                    :picker-options="{disabledDate(time) { return time.getTime() < Date.now() - 8.64E7 }}">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="Activity description：">
                  <UE ref="UE" :defaultMsg="activityForm.description"></UE>
                </el-form-item>
              </div>
            </div>
            <!--Preferential way-->
            <div class="base-info-item">
              <h4>Preferential way</h4>
              <div>
                <el-form-item label="Preferential way：" prop="single_reduction_value">
                  Item set<el-input v-model="activityForm.single_reduction_value" style="width: 150px;"></el-input> USD
                </el-form-item>
              </div>
            </div>
            <!--Activities of goods-->
            <div class="base-info-item">
              <h4>Activities of goods</h4>
              <div>
                <el-form-item label="Activities of goods：" prop="range_type">
                  <el-radio-group v-model="activityForm.range_type" @change="changeJoinGoods">
                    <el-radio :label="1">Participation of all commodities</el-radio>
                    <el-radio :label="2">Partial commodity participation</el-radio>
                  </el-radio-group>
                  <!--Commodity form-->
                  <div v-show="!goodsShow" class="goods-table">
                    <en-table-layout
                      toolbar
                      :tableData="activityForm.goods_list"
                      :loading="loading"
                      :selectionChange="selectionChange">
                      <div slot="toolbar" class="inner-toolbar">
                        <div class="toolbar-btns">
                          <el-button type="primary" @click="showGoodsSelector">Choose goods</el-button>
                          <el-button type="danger" @click="cancelall">Batch cancelled</el-button>
                        </div>
                      </div>
                      <template slot="table-columns">
                        <el-table-column type="selection"/>
                        <!--Product information-->
                        <el-table-column  label="Product information">
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
                        <!--Inventory-->
                        <el-table-column prop="enable_quantity" label="Inventory" />
                        <!--Operation-->
                        <el-table-column label="Operation" width="150">
                          <template slot-scope="scope">
                            <el-button
                              type="danger"
                              @click="handleCancleJoin(scope.$index, scope.row)">Cancel to
                            </el-button>
                          </template>
                        </el-table-column>
                      </template>
                    </en-table-layout>
                  </div>
                </el-form-item>
              </div>
            </div>
            <!--The submit button-->
            <div class="btn-submit">
              <el-form-item>
                <el-button v-show="editEnabled" type="primary" @click="saveActivity('activityForm')">Save Settings</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!--The mask layer-->
        <div :class="{'cus-mask': !editEnabled}"></div>
      </el-tab-pane>
    </el-tabs>
    <!--Commodity selector-->
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
  import { RegExp } from '~/ui-utils'

  export default {
    name: 'singleCut',
    components: {
      [CategoryPicker.name]: CategoryPicker,
      [UE.name]: UE
    },
    data() {
      const checkRange = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Please select the mode of product participation'))
        } else {
          callback()
        }
      }
      const checkPrice = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Please enter your preferred cash amount'))
        }
        setTimeout(() => {
          if (!RegExp.money.test(value)) {
            callback(new Error('Please enter the correct amount'))
          } else {
            callback()
          }
        }, 1000)
      }
      const checkTakeEffectTime = (rule, value, callback) => {
        const now = new Date().getTime()
        if (!value) {
          return callback(new Error('Please select the effective date'))
        } else if (value[0] <= now) {
          callback(new Error('The start time of the activity must not be less than the current time'))
        } else {
          callback()
        }
      }
      return {
        /** The name of the current panel*/
        activeName: 'singleCutList',

        /** Immediate name of item*/
        singleCutName: 'Newly added items are reduced immediately',

        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },

        /** The list of data*/
        tableData: [],

        /** List paging data*/
        pageData: null,

        /** productids */
        goodsIds: [],

        /** Add fill/subtract form information*/
        activityForm: {
          /** activityID*/
          minus_id: '',

          /** The name of the event*/
          title: '',

          /** Effect of time*/
          take_effect_time: [],

          /** Activity description*/
          description: '',

          /** Discount amount*/
          single_reduction_value: '',

          /** Whether all goods participate*/
          range_type: '',

          /** Activities of goods*/
          goods_list: []
        },

        /** Form check rule*/
        rules: {
          title: [
            { required: true, message: 'Please enter the activity name', trigger: 'blur' },
            { min: 0, max: 60, message: 'The length of60Within two characters', trigger: 'blur' }
          ],
          take_effect_time: [
            { type: 'array', required: true, message: 'Please select the effective date', trigger: 'blur' },
            { validator: checkTakeEffectTime, trigger: 'blur' }
          ],
          single_reduction_value: [
            { required: true, validator: checkPrice, trigger: 'blur' }
          ],

          /** Mode of Commodity participation*/
          range_type: [
            { required: true, validator: checkRange, trigger: 'change' }
          ]
        },

        // Uneditable means ongoing or defunct by default
        editEnabled: true,

        /** Whether to display the item table*/
        goodsShow: true,

        /** Select thegoods_id*/
        selectionids: [],

        /** Maximum length of commodity selector*/
        maxsize: 0,

        /** Product selector listapi*/
        goodsApi: 'seller/goods?market_enable=1&is_auth=1',

        /** Mall classificationapi */
        categoryApi: 'seller/goods/category/0/children',

        /** Echo data usage*/
        multipleApi: 'seller/goods/@ids/details',

        /** According to/Hide the product selector*/
        showDialog: false
      }
    },
    mounted() {
      this.GET_SingleCutActivityList()
    },
    methods: {
      /** The activity type*/
      activityType(row, column, cellValue) {
        return 'Item set'
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          keywords: data
        }
        this.GET_SingleCutActivityList()
      },

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_SingleCutActivityList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_SingleCutActivityList()
      },

      /** Switch panel*/
      handleToggleClick(tab, event) {
        this.activeName = tab.name
        if (this.activeName === 'express') {
          this.GET_SingleCutActivityList()
        } else if (this.activeName === 'add') {
          this.singleCutName = 'Newly added items are reduced immediately'
          this.editEnabled = true
          this.activityForm = {
            minus_id: '',
            title: '',
            take_effect_time: [],
            description: '',
            full_money: '',
            single_reduction_value: '',
            goods_list: []
          }
        }
      },

      /** Whether all products are selected*/
      changeJoinGoods(val) {
        this.goodsShow = val === 1
      },

      /** Save the item selected by the commodity selector*/
      refreshFunc(val) {
        if (val) {
          this.activityForm.goods_list = val
        }
      },

      /** Displays the product selector*/
      showGoodsSelector() {
        this.showDialog = true
        this.goodsIds = this.activityForm.goods_list.map(key => {
          return key.goods_id
        })
      },

      /** Cancel to*/
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

      /** Batch cancelled*/
      cancelall() {
        this.selectionids.forEach(key => {
          this.activityForm.goods_list.forEach((elem, index) => {
            if (elem.goods_id === key) {
              this.activityForm.goods_list.splice(index, 1)
            }
          })
          this.$message.success('Batch cancel successful！')
        })
        this.goodsIds = this.activityForm.goods_list.map(key => {
          return key.goods_id
        })
      },

      /** Obtain activity information*/
      GET_SingleCutActivityList() {
        this.loading = true
        API_activity.getSingleCutActivityList(this.params).then(response => {
          this.loading = false
          this.tableData = response.data
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
        })
      },

      /** Editing activity*/
      handleEditMould(row) {
        this.activeName = 'add'
        this.singleCutName = 'Edit and subtract a single item'
        this.editEnabled = !(row.status === 'END' || row.status === 'UNDERWAY')
        setTimeout(() => { this.$refs['activityForm'].resetFields() })
        this.activityForm.minus_id = row.minus_id
        this.GET_SingleCutActivityDetails(row.minus_id)
      },

      /** Inquire information about the activity of a single product*/
      GET_SingleCutActivityDetails(id) {
        if (id) {
          API_activity.getSingleCutActivityDetails(id, {}).then(response => {
            this.$nextTick(() => {
              this.activityForm = {
                ...response,
                take_effect_time: [parseInt(response.start_time) * 1000, parseInt(response.end_time) * 1000]
              }
              this.activityForm.minus_id = response.minus_id || id
              /** Process merchandise list data*/
              this.goodsShow = this.activityForm.range_type === 1
              this.activityForm.goods_list = response.goods_list
            })
          })
        }
      },

      /** Delete activity*/
      handleDeleteFullCut(row) {
        this.$confirm('Verify that the current item is deleted？', 'Confirm the information', { type: 'warning' })
          .then(() => this.toDelActivity(row))
          .catch(() => {})
      },

      /** To delete*/
      toDelActivity(row) {
        API_activity.deleteSingleCutActivity(row.minus_id, {}).then(response => {
          this.$message.success('Delete the success！')
          this.GET_SingleCutActivityList()
        })
      },

      /** new*/
      handleAddSingleCut() {
        this.activeName = 'add'
        this.singleCutName = 'Newly added items are reduced immediately'
        this.editEnabled = true
        this.activityForm = {
          /** activityID*/
          minus_id: '',

          /** The name of the event*/
          title: '',

          /** Effect of time*/
          take_effect_time: [],

          /** Activity description*/
          description: '',

          /** Discount amount*/
          single_reduction_value: '',

          /** Whether all goods participate*/
          range_type: '',

          /** Activities of goods*/
          goods_list: []
        }
      },

      /** Save form sets the save form submission for this activitygoods_id Strings are separated by commas*/
      saveActivity(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const _params = this.generateFormData(this.activityForm)
            delete _params.take_effect_time
            if (this.activityForm.minus_id) {
              API_activity.saveSingleCutActivity(this.activityForm.minus_id, _params).then(response => {
                this.$message.success('Modify the success！')
                this.activeName = 'singleCutList'
                this.GET_SingleCutActivityList()
              }).catch((res) => {
                if (res.response.data.code === '401' && res.response.data.data) {
                  const goods_name = JSON.parse(res.response.data.data).map(key => { return key.name }).toString()
                  this.$message.error(`${goods_name}Has participated in other activities and has conflicts with the current activities`)
                } else {
                  this.$message.error(res.response.data.message)
                }
              })
            } else {
              API_activity.addSingleCutActivity(_params).then(response => {
                this.$message.success('Add a success！')
                this.activeName = 'singleCutList'
                this.GET_SingleCutActivityList()
              }).catch((res) => {
                if (res.response.data.code === '401' && res.response.data.data) {
                  const goods_name = JSON.parse(res.response.data.data).map(key => { return key.name }).toString()
                  this.$message.error(`${goods_name}Has participated in other activities and has conflicts with the current activities`)
                } else {
                  this.$message.error(res.response.data.message)
                }
              })
            }
          } else {
            this.$message.error('There is an error in the form. Please correct it')
          }
        })
      },

      /** Constructing form data*/
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
          /** The name of the event/ title*/
          title: data.title,

          /** Activity start time*/
          start_time: data.take_effect_time[0] / 1000,

          /** End time*/
          end_time: data.take_effect_time[1] / 1000,

          /** Immediate reduction for each item*/
          single_reduction_value: parseFloat(data.single_reduction_value),

          /** Mode of Commodity participation*/
          range_type: data.range_type
        }
        /** Activity description*/
        _params.description = this.$refs.UE.getUEContent()
        if (_goodslist.length > 0 && this.activityForm.range_type === 2) {
          /** List of Participated Goods*/
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
  /*New Form panel*/
  /deep/ .el-form-item__content {
    width: 80%;
    .el-input .el-input--medium {
      max-width: 80%;
    }
  }

  /*baiduUE*/
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

  /*The form of information*/
  .el-form {
    padding-bottom: 80px;
    .el-form-item {
      width: 100%;
      text-align: left;

      /*Award points*/
      .integral-show {
        .el-input {
          width: 50px;
        }
      }
      /** The drop-down list*/
      /deep/ .el-select .el-select--medium {
        width: 160px;
      }
    }
    .discount-model {
      div {
        margin: 5px 0;
      }
    }

    /*The submit button*/
    /deep/ .btn-submit {
      width: 100%;
      .el-form-item__content {
        text-align: center;
      }
    }
  }

  /** Form information*/
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

  /*tile*/
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

  /*Product Form information*/
  .goods-table {
    /deep/ thead>tr {
      /deep/ th:nth-child(2) {
        text-align: left !important;
      }
    }
  }

  /*The mask layer*/
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


