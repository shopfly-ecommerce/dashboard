<template>
  <div>
    <en-table-layout
      toolbar
      pagination
      :tableData="tableData"
      :height="700"
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <!--State of goods on and off the shelves-->
          <div class="conditions">
            <span>Status：</span>
            <el-select
              class="choose-machine"
              v-model="params.market_enable"
              placeholder=" select status"
              @change="changeGoodsStatus"
              clearable>
              <el-option
                v-for="item in goodsStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <!--Type-->
          <div class="conditions" style="margin-left:10px;">
            <span>Type：</span>
            <el-select
              class="choose-machine"
              v-model="params.goods_type"
              placeholder="select  type"
              @change="changeGoodsType"
              clearable>
              <el-option key="NORMAL" label="Normal goods" value="NORMAL"/>
              <el-option key="POINT" label="Integral goods" value="POINT"/>
            </el-select>
          </div>
          <el-button @click="publishGoods" type="primary" style="margin-left: 10px">Add product</el-button>
          <el-button @click="gotoRecycle"  type="primary">Draft</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent" placeholder="Please enter the name of the item"/>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column label="Image" width="120">
          <template slot-scope="scope">
            <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank">
              <img :src="scope.row.thumbnail" class="goods-image"/>
            </a>
          </template>
        </el-table-column>
	      <el-table-column label="SN" prop="sn" width="80"/>
        <el-table-column label="productID" prop="goods_id" width="80"/>
        <el-table-column label="Name">
          <template slot-scope="scope">
            <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank" style="color: #00a2d4;">{{ scope.row.goods_name }}</a>
          </template>
        </el-table-column>
        <el-table-column label="Price" width="120">
          <template slot-scope="scope">{{ scope.row.price | unitPrice('￥') }}</template>
        </el-table-column>
        <el-table-column label="Inventory" width="80">
          <template slot-scope="scope">{{ scope.row.quantity }}a</template>
        </el-table-column>
        <el-table-column label="Available" width="80">
          <template slot-scope="scope">{{ scope.row.enable_quantity }}a</template>
        </el-table-column>
        <el-table-column label="Last update" width="120">
          <template slot-scope="scope">{{ scope.row.create_time | unixToDate('yyyy-MM-dd hh:mm') }}</template>
        </el-table-column>
        <el-table-column  label="Status" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.market_enable === 1">save</span>
            <span v-if="scope.row.market_enable === 0">off</span>
            <div class="under-reason" v-if="scope.row.market_enable === 0" @click="showUnderReason(scope.row)">(From the shelves because)</div>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="300" style="text-align: left;">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEditGoods(scope.row)">edit
            </el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="scope.row.market_enable === 0"
              @click="handleDeleteGoods(scope.row)">delete
            </el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="scope.row.market_enable === 1"
              @click="handleUnderGoods(scope.row)">off
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="handleStockGoods(scope.row)">Inventory
            </el-button>
            <el-button
              v-if="distributionSet"
              type="primary"
              size="mini"
              @click="handleRebate(scope.row)">rebate
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
    <!--Inventory editor-->
    <el-dialog title="Inventory editor" :visible.sync="goodsStockshow" width="35%" class="pop-sku">
      <div align="center">
        <el-form :model="goodsStockData" ref="goodsStockData" v-if="goodsStocknums === 1" style="width: 50%;" label-width="100px" :rules="rules">
          <el-form-item label="Inventory" prop="quantity" >
            <el-input  v-model="goodsStockData.quantity" />
          </el-form-item>
          <el-form-item label="Pending Shipment" >
            <el-input v-model="goodsStockData.deliver_goods_quantity"  disabled />
          </el-form-item>
        </el-form>
        <en-table-layout
          :tableData="goodsStockData"
          :loading="loading"
          border
          v-if="goodsStocknums > 1"
          :span-method="arraySpanMethod"
          :stripe="false">
          <template slot="table-columns">
            <el-table-column
              v-for="(item, index) in goodsStockTitle"
              v-if="item.prop !== 'sku_id'"
              :label="item.label"
              :key="index">
              <template slot-scope="scope">
                <el-input v-if="item.prop === 'quantity'" @blur="checkQuantity(scope.row.quantity)" v-model="scope.row.quantity"/>
                <span v-if="item.prop !== 'quantity'" >{{ scope.row[item.prop] }}</span>
              </template>
            </el-table-column>
          </template>
        </en-table-layout>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goodsStockshow = false">cancel</el-button>
        <el-button type="primary" @click="reserveStockGoods">save</el-button>
      </div>
    </el-dialog>
    <!--From the shelves because-->
    <el-dialog title="From the shelves because" :visible.sync="isShowUnderReason" width="17%" >
      <div align="center">{{ under_reason }}</div>
    </el-dialog>
    <!--Distribution rebate-->
    <el-dialog title="Distribution rebate" :visible.sync="isShowDisRebate" width="24%">
      <el-form :model="disRebateData" label-width="100px" :rules="disRules" ref="disRebateData" status-icon>
        <el-form-item label="1Rebate level" prop="grade1Rebate">
          <el-input v-model="disRebateData.grade1Rebate">
            <template slot="prepend">¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="2Rebate level" prop="grade2Rebate">
          <el-input v-model="disRebateData.grade2Rebate">
            <template slot="prepend">¥</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="reserveDisSet('disRebateData')">save</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_goods from '@/api/goods'
  import { CategoryPicker } from '@/components'
  import { RegExp } from '~/ui-utils'
  export default {
    name: 'goodsList',
    components: {
      [CategoryPicker.name]: CategoryPicker
    },
    data() {
      const checkQuantity = (rule, value, callback) => {
        if (!value && value !== 0) {
          return callback(new Error('Inventory cannot be empty'))
        }
        setTimeout(() => {
          if (!/^[0-9]\d*$/.test(value)) {
            callback(new Error('Please enter an integer'))
          } else if (!(parseInt(value) >= 0 && parseInt(value) <= 99999999)) {
            callback(new Error('Please enter the0 - 99999999Positive integer between'))
          } else {
            callback()
          }
        }, 500)
      }
      const checkMoney = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('The rebate amount cannot be empty'))
        }
        setTimeout(() => {
          if (!RegExp.money.test(value)) {
            callback(new Error('Please enter the correct amount'))
          } else if (parseFloat(value) < 0 || parseFloat(value) > 99999999) {
            callback(new Error('Please enter the0~99999999Amount between'))
          } else {
            callback()
          }
        }, 500)
      }

      return {
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10,
          // The default item type is " NORMAL NORMAL item POINT POINT item
          goods_type: '',
          ...this.$route.query
        },

        /** The list of data*/
        tableData: [],

        /** List paging data*/
        pageData: [],

        /** Commodity status list*/
        goodsStatusList: [
          { value: 0, label: 'off（unsold）' },
          { value: 1, label: 'on（on sale）' }
        ],
        /** The current commodityid*/
        goodsId: '',

        /** Commodity inventory display*/
        goodsStockshow: false,

        /** Whether to show the reason for removal*/
        isShowUnderReason: false,

        /** From the shelves because*/
        under_reason: '',

        /** Quantity of goods in stock*/
        goodsStocknums: 0,

        /** Commodity inventory list data*/
        goodsStockData: null,

        /** Commodity inventory list header data*/
        goodsStockTitle: [],

        /** An array of positions for the columns to be merged*/
        concactArray: [],

        /** Validation rules*/
        rules: {
          quantity: [
            { validator: checkQuantity, trigger: 'blur' }
          ]
        },

        /** Store information*/
        shopInfo: this.$store.getters.shopInfo,

        /** Whether the distribution Settings are enabled1open0close*/
        distributionSet: 0,

        /** Whether to display the distribution rebate pop-up box*/
        isShowDisRebate: false,

        /** Distribution rebate data*/
        disRebateData: {
          /** productid */
          goods_id: 0,

          /** 1Rebate level*/
          grade1Rebate: 0,

          /** 2Rebate level*/
          grade2Rebate: 0

        },

        /** Distribution rebate check rules*/
        disRules: {
          grade1Rebate: [
            { required: true, message: '1The amount of class ii rebate cannot be empty', trigger: 'blur' },
            { validator: checkMoney, trigger: 'blur' }
          ],
          grade2Rebate: [
            { required: true, message: '2The amount of class ii rebate cannot be empty', trigger: 'blur' },
            { validator: checkMoney, trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.params = { ...this.params, ...this.$route.query }
      this.params.market_enable && (this.params.market_enable = parseInt(this.params.market_enable))
      this.GET_GoodsList()
      this.getDistributionSet()
    },
    activated() {
      this.params = { ...this.params, ...this.$route.query }
      this.params.market_enable && (this.params.market_enable = parseInt(this.params.market_enable))
      this.GET_GoodsList()
      this.getDistributionSet()
    },
    methods: {
      /** Stock boundary limit*/
      checkQuantity(value) {
        if (!value && value !== 0) {
          this.$message.error('Inventory cannot be empty')
        } else if (!RegExp.integer.test(value) && parseInt(value) !== 0) {
          this.$message.error('Please enter an integer')
        } else if (!(parseInt(value) >= 0 && parseInt(value) <= 99999999)) {
          this.$message.error('Please enter the0 - 99999999Positive integer between')
        }
      },

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_GoodsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_GoodsList()
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          keyword: data
        }
        this.GET_GoodsList()
      },

      /** Switch up and down state*/
      changeGoodsStatus(val) {
        delete this.params.market_enable
        if (val !== '' && val !== -1) {
          this.params = {
            ...this.params,
            market_enable: val
          }
        }
        this.GET_GoodsList()
      },

      /** off*/
      handleUnderGoods(row) {
        this.$confirm('Confirm off this item, Whether or not to continue?', 'prompt', { type: 'warning' }).then(() => {
          API_goods.underGoods(row.goods_id, {}).then(() => {
            this.$message.success('The successful')
            this.GET_GoodsList()
          })
        })
      },

      /** Switching Product Types*/
      changeGoodsType(val) {
        delete this.params.goods_type
        if (val !== '') {
          this.params = {
            ...this.params,
            goods_type: val
          }
        }
        this.GET_GoodsList()
      },
      /** Show reason for removal*/
      showUnderReason(row) {
        this.isShowUnderReason = false
        this.isShowUnderReason = true
        this.under_reason = row.under_message
      },

      GET_GoodsList() {
        this.loading = true
        API_goods.getGoodsList(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          this.tableData = response.data
        })
      },

      /** Add product*/
      publishGoods() {
        this.$router.push({ name: 'goodPublish', params: { callback: this.GET_GoodsList }})
      },

      /** Jump to the recycle bin*/
      gotoRecycle() {
        this.$router.push({ path: '/goods/recycleStation' })
      },

      /** Edit commodityisdraft Products1*/
      handleEditGoods(row) {
        this.$router.push({ name: 'goodPublish', params: { goodsid: row.goods_id, isdraft: 1, callback: this.GET_GoodsList }})
      },

      /** Delete the goods*/
      handleDeleteGoods(row) {
        this.$confirm('Confirm deletion of this item, Whether or not to continue?', 'prompt', { type: 'warning' }).then(() => {
          const _ids = [row.goods_id].toString()
          API_goods.deleteGoods(_ids).then(() => {
            this.GET_GoodsList()
            this.$message.success('Goods deleted successfully！')
          })
        })
      },

      /** Merge cells with the same data*/
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex < this.goodsStockTitle.length - 3) {
          const _row = this.concactArray[rowIndex][columnIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },

      /** Calculate the position of the column to be merged*/
      concactArrayCom(index, item) {
        let _isMerge = false
        /** If the first column is the same, it will be merged and then the second column will be recycled in turn. If the second column is not the same, it will not be merged and the column cycle will be terminated and the next column cycle will start*/
        let _currnetRow = []
        for (let i = 0, _len = this.goodsStockTitle.length - 3; i < _len; i++) {
          if (this.goodsStockTitle[i].prop === 'sku_id') {
            i++
            continue
          }
          if (index > 0 && item[this.goodsStockTitle[i].prop] !== this.goodsStockData[index - 1][this.goodsStockTitle[i].prop]) {
            _currnetRow[i] = 1
            _isMerge = true
          } else if (index > 0 && !_isMerge) {
            _currnetRow[i] = 0
            let _count = 1
            while (this.concactArray[index - _count][i] === 0) {
              _count++
            }
            this.concactArray[index - _count][i] += 1
          } else { // index === 0
            _currnetRow[i] = 1
          }
        }
        this.concactArray.push(_currnetRow)
      },

      /** Inventory*/
      handleStockGoods(row) {
        this.goodsId = row.goods_id
        this.goodsStockshow = true
        API_goods.getGoodsStockList(row.goods_id, {}).then((response) => {
          this.goodsStockTitle = this.goodsStockData = []
          this.goodsStocknums = response.length
          // Construct the field for shipment
          if (response.length > 1) {
            this.$nextTick(() => {
              response.forEach((key) => {
                // Construct the field for shipment
                this.$set(key, 'deliver_goods_quantity', parseInt(key.quantity) - parseInt(key.enable_quantity))
                // Construct the header
                let _skus = key.spec_list.map(elem => {
                  return { label: elem.spec_name, prop: elem.spec_name }
                })
                this.goodsStockTitle = _skus.concat([
                  { label: 'specificationsid', prop: 'sku_id' },
                  { label: 'Inventory', prop: 'quantity' },
                  { label: 'Pending Shipment', prop: 'deliver_goods_quantity' }])
                // Structural table structure
                let _skuData = key.spec_list.map(elem => {
                  let _map = new Map().set(elem.spec_name, elem.spec_value)
                  let obj = Object.create(null)
                  for (let [k, v] of _map) {
                    obj[k] = v
                  }
                  return obj
                })
                const _key = {
                  sku_id: key.sku_id,
                  quantity: key.quantity,
                  deliver_goods_quantity: key.deliver_goods_quantity
                }
                this.goodsStockData.push(Object.assign(_key, ..._skuData))
              })
              // Calculate the position of the table merge
              this.concactArray = []
              this.goodsStockData.forEach((key, index) => {
                this.concactArrayCom(index, key)
              })
            })
          } else {
            response.forEach((key) => {
              // Construct the field for shipment
              this.$set(key, 'deliver_goods_quantity', parseInt(key.quantity) - parseInt(key.enable_quantity))
            })
            this.goodsStockData = response[0]
          }
        })
      },

      /** Keep goods in stock*/
      reserveStockGoods() {
        let _params = []
        if (Array.isArray(this.goodsStockData)) {
          _params = this.goodsStockData.map((elem) => {
            return {
              quantity_count: elem.quantity,
              sku_id: elem.sku_id
            }
          })
        } else {
          _params.push({
            quantity_count: this.goodsStockData.quantity,
            sku_id: this.goodsStockData.sku_id
          })
        }
        const _res = _params.some(key => {
          return !(parseInt(key.quantity_count) >= 0 && parseInt(key.quantity_count) < 99999999) || !/^[0-9]\d*$/.test(key.quantity_count)
        })
        if (_res) {
          this.$message.error('Inventory should be0 - 99999999Integer between')
          return
        }
        API_goods.reserveStockGoods(this.goodsId, _params).then(() => {
          this.goodsStockshow = false
          this.$message.success('Inventory items saved successfully')
          this.GET_GoodsList()
        })
      },
      /** Get distribution Settings*/
      getDistributionSet() {
        API_goods.getDistributionSet().then(response => {
          this.distributionSet = response.message
        })
      },
      /** Rebates Get rebate information*/
      handleRebate(row) {
        // setTimeout(() => { this.$refs['disRebateData'].resetFields() })
        API_goods.getDistributionInfo(row.goods_id).then(response => {
          this.isShowDisRebate = true
          this.disRebateData = {
            /** productid */
            goods_id: response.goods_id || row.goods_id,

            /** 1Rebate level*/
            grade1Rebate: response.grade1_rebate,

            /** 2Rebate level*/
            grade2Rebate: response.grade2_rebate
          }
        })
        this.$nextTick(() => this.$refs['disRebateData'] && this.$refs['disRebateData'].resetFields())
      },
      /** Save distribution rebate information*/
      reserveDisSet(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            API_goods.setDistributionInfo(this.disRebateData).then(() => {
              this.isShowDisRebate = false
              this.$message.success('The rebate amount of current commodity distribution has been successfully modified')
            })
          }
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ div.toolbar {
    height: 70px;
    padding: 20px 0;
  }

  /deep/ .el-table {
    width: 100%;
    overflow-x: scroll;
    & td:not(.is-left) {
      text-align: center;
    }
  }

  .inner-toolbar {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  /deep/ .pop-sku {
    .toolbar {
      display: none;
    }
    .el-dialog__body {
      .el-table {
        border: 1px solid #e5e5e5;
      }
    }
    .el-table__body-wrapper {
      max-height: 400px;
      overflow-y: scroll;
    }
  }


  .toolbar-search {
    margin-right: 10px;
    width: 20%;
  }

  div.toolbar-btns {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    div {
      span {
        display: inline-block;
        font-size: 14px;
        color: #606266;
      }
    }
    .conditions {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      min-width: 24.5%;
    }
  }

  .goods-image {
    width: 50px;
    height: 50px;
  }

  /deep/ div.cell {
    overflow:hidden;

    text-overflow:ellipsis;

    display:-webkit-box;

    -webkit-box-orient:vertical;

    -webkit-line-clamp:2;
  }
  /*From the shelves because*/
  .under-reason {
    color: red;
    cursor: pointer;
  }

</style>
