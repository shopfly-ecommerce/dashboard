<template>
  <div>
    <el-table
    :data="tableData"
    border
    :span-method="arraySpanMethod"
    style="width: 100%">
      <el-table-column
        v-for="(item, index) in tablehead"
        v-if="item !== 'spec_value_id'"
        :key="item"
        :label="labeltxt(item)"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="checkFixed(item)">
            <span v-if="item === 'price'"> {{ scope.row[item] | unitPrice('￥')}}</span>
            <span v-else> {{ scope.row[item] }}</span>
          </span>
          <div v-else class="input-error-model">
            <el-input
              :disabled="isEditModel === 1 && item==='quantity'"
              :maxlength="30"
              v-model="scope.row[item]"
              @change="scope.row[item] = scope.row[item].trim()"
              @input="updateSkuTable(index, scope, item)"
              @blur="updateSkuTable(index, scope, item)">
            </el-input>
            <span
              class="input-error"
              v-if="item !== 'sn'"
              v-show="isValidate(index, scope)">{{ validatatxt }}
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <p v-if="isEditModel === 1" class="stock-tip"> prompt: Inventory editing is not allowed when editing product specifications. Please go to the product list to maintain inventory separately</p>
    <div class="batch-all" v-show="tablehead && tablehead.length">
      <span>Batch set：</span>
      <div v-show="isShowBatch">
        <el-button type="text" size="mini" @click="setBatch(1)">Price</el-button>
        <el-button v-if="isEditModel !== 1" type="text" size="mini" @click="setBatch(2)">Inventory</el-button>
      </div>
      <div v-show="!isShowBatch">
        <el-input v-model="batch" size="mini" style="width: 100px;"></el-input>
        <el-button type="text" size="mini" @click="saveBatch">save</el-button>
        <el-button type="text" size="mini" @click="cancelBatch">cancel</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { RegExp } from '~/ui-utils'
  export default {
    name: 'skuTable',
    props: {
      /** Current mode publishes goods0 Edit commodity1 Edit draft box merchandise2 */
      isEditModel: {
        type: Number,
        default: 1
      },

      /** Whether to automatically generate article number*/
      productSn: {
        type: Boolean,
        default: false
      },

      /** Current Product No.*/
      goodsSn: {
        type: [String, Number],
        default: ['', 0]
      },

      /** A list of information*/
      skuInfo: {
        type: Array,
        default: [{
          sn: '',
          weight: '',
          quantity: 0,
          cost: '',
          price: ''
        }]
      },

      /** Header information*/
      tablehead: {
        type: Array,
        default: []
      }
    },
    watch: {
      skuInfo() {
        this.tableData = this.skuInfo
        this.concactArray = []
        this.tableData.forEach((key, index) => {
          this.concactArrayCom(index, key)
        })
      },

      /** Automatically generate article number*/
      productSn() {
        if (this.productSn && this.tableData.length > 0) {
          let count = 1
          this.tableData.forEach(key => {
            key.sn = this.goodsSn + '-00000' + count
            count++
          })
          /** Asynchronous updateskuInfodata*/
          this.$emit('skuTable', this.tableData)
        }
      }
    },
    mounted() {
      this.tableData = this.skuInfo
      this.tableData.forEach((key, index) => {
        this.concactArrayCom(index, key)
      })
    },
    data() {
      return {
        /** Whether to display the value of the batch setting*/
        isShowBatch: true,

        /** The value of the batch setting*/
        batch: '',

        /** The value of the current operation1Price2Inventory*/
        activeVal: 0,

        /** The list of data*/
        tableData: this.skuInfo,

        /** An array of positions for the columns to be merged*/
        concactArray: [],

        /** Fixed column check prompt content*/
        validatatxt: 'Please enter the0~99999999Between the numeric values',

        /** Stores the location of a cell that did not pass the check*/
        validateError: []
      }
    },
    methods: {

      /** Fixed header text formatting*/
      labeltxt(item) {
        let _output = ''
        switch (item) {
          case 'sn': _output = 'SN'; break
          case 'weight': _output = 'Weight(kg)'; break
          case 'quantity': _output = 'Inventory'; break
          case 'cost': _output = 'Cost price'; break
          case 'price': _output = 'Price(USD)'; break
          default: _output = item
        }
        return _output
      },

      /** Identification of whether the current header belongs to a fixed header*/
      checkFixed(item) {
        if (item === 'sn' || item === 'weight' || item === 'quantity' || item === 'cost' || item === 'price') {
          return false
        }
        return true
      },

      /** Merge cells with the same data*/
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex < this.tablehead.length - 5) {
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
        for (let i = 0, _len = this.tablehead.length - 5; i < _len; i++) {
          if (this.tablehead[i] === 'spec_value_id') {
            i++
            continue
          }
          if (index > 0 && item[this.tablehead[i]] !== this.skuInfo[index - 1][this.tablehead[i]]) {
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

      /** Test whether failed0-99999999Between the digital check*/
      isValidate(index, scope) {
        return this.validateError.some(key => {
          return key[0] === index && key[1] === scope.$index
        })
      },

      /** Batch setting price*/
      setBatch(val) {
        this.batch = ''
        this.isShowBatch = !this.isShowBatch
        this.activeVal = val
      },

      /** Save the batch setting values*/
      saveBatch() {
        const _desc = this.activeVal === 1 ? 'Price' : 'Inventory'
        const checkResult = this.activeVal === 1 ? RegExp.money.test(this.batch) : parseInt(this.batch) >= 0 && parseInt(this.batch) < 99999999 && /^[0-9]\d*$/.test(this.batch)
        if (!checkResult) {
          this.batch = ''
          this.activeVal === 1 ? this.$message.error(`Please enter a valid one${_desc}The data, the maximum value is not more than99999999`) : this.$message.error(`${_desc}Maximum value not exceeding99999999,${_desc}As a positive integer`)
          return
        }
        /** Batch set*/
        this.activeVal === 1 ? this.tableData.forEach(key => { key.price = this.batch }) : this.tableData.forEach(key => { key.quantity = this.batch })
        this.isShowBatch = !this.isShowBatch
        /** Asynchronous updateskuInfodata*/
        this.$emit('skuTable', this.tableData)
      },

      /** Cancel the batch setting value*/
      cancelBatch() {
        this.isShowBatch = !this.isShowBatch
      },

      /** Throws data after data changes*/
      updateSkuTable(index, scope, item) {
        /** Perform custom verification to check whether it is a number（Decimals can pass）Weight*/
        if ((!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(scope.row[item]) && item === 'weight') || parseInt(scope.row[item]) < 0 || parseInt(scope.row[item]) > 99999999) { // The verification fails and is added to the error store list
          this.validateError.push([index, scope.$index])
          this.validatatxt = 'Please enter the0~99999999Between the numeric values'
        } else if ((item === 'quantity' && !/^[0-9]\d*$/.test(scope.row[item])) || parseInt(scope.row[item]) < 0 || parseInt(scope.row[item]) > 99999999) { // Inventory
          this.validateError.push([index, scope.$index])
          this.validatatxt = 'Please enter the0~99999999Integer between'
        } else if (((item === 'cost' || item === 'price') && !RegExp.money.test(scope.row[item])) || parseInt(scope.row[item]) < 0 || parseInt(scope.row[item]) > 99999999) { // Cost price
          this.validateError.push([index, scope.$index])
          this.validatatxt = 'Please enter the0~99999999Price between'
        } else {
          this.validateError.forEach((key, _index) => {
            if (key[0] === index && key[1] === scope.$index) {
              this.validateError.splice(_index, 1)
            }
          })
        }
        /** Asynchronous updateskuInfodata*/
        this.$emit('skuTable', this.tableData)
      }
    }
  }
</script>

<style lang="scss" type="scss" scoped>
  /** Batch set*/
  .batch-all {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
  }
  /*Check module*/
  .input-error-model {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    color: red;
    line-height: 16px;
    margin-bottom: 20px;
    span {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 60%;
      left: 6%;
    }
  }
  /deep/ .validat_error {
    border-color: red;
  }

  p.stock-tip {
    color: #f00;
    font-size: 13px;
  }
</style>
