<template>
  <div class="container">
    <!--Specification selection-->
    <sku-item
      :categoryId="categoryId"
      :productSkuInfo="productSkuInfo"
      @updateSkuInfo="updateSkuInfo"
    ></sku-item>
    <!--Specifications set-->
    <div class="sku-settings">
      <label class="label-sku">details：</label>
      <sku-table
        :isEditModel="isEditModel"
        :goodsSn="goodsSn"
        :productSn="productSn"
        :skuInfo="skuInfo"
        :tablehead="tablehead"
        @skuTable="skuTable"
      ></sku-table>
    </div>
  </div>
</template>

<script>
  import SkuItem from './SkuItem'
  import SkuTable from './SkuTable'
  import { cloneObj, deepClone } from '@/utils/index'
  export default {
    name: 'EnSkuSelector',
    components: {
      SkuItem, SkuTable
    },
    props: {
      /** Categoriesid*/
      categoryId: {
        type: [String, Number],
        default: ['', 0]
      },

      /** Product specification information*/
      goodsSkuInfo: {
        type: Array,
        default: []
      },

      /** Current mode publishes goods0 Edit commodity1 Edit draft box merchandise2 */
      isEditModel: {
        type: Number,
        default: 0
      },

      /** The current commodityId */
      goodsId: {
        type: [String, Number],
        default: ['', 0]
      },

      /** Current Product No.*/
      goodsSn: {
        type: [String, Number],
        default: ['', 0]
      },

      /** Whether to automatically generate article number*/
      productSn: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        /** The specification selection data is calculated when editing is completed*/
        productSkuInfo: [],

        /** Fixed header field information*/
        origin: {
          sn: '',
          weight: '',
          quantity: 0,
          cost: '',
          price: ''
        },

        /** Header data*/
        tablehead: [],

        /** Tabular data*/
        skuInfo: [],

        /** Fixed data to throw from the table*/
        fixData: [],

        /** Calculated data thrown by the specification selection section*/
        choiceData: []
      }
    },
    watch: {
      goodsSkuInfo() {
        if (this.goodsSkuInfo && Array.isArray(this.goodsSkuInfo) && this.goodsSkuInfo.length > 0) {
          this.chooseData()
        }
      }
    },
    methods: {
      /** Take in external information and construct itskuItemThe data required（spec_id spec_value_id）*/
      chooseData() {
        const _skuInfo = []
        this.goodsSkuInfo.forEach(key => {
          if (key && key.spec_list && Array.isArray(key.spec_list)) {
            key.spec_list.forEach((item, index) => {
              /** ifspec_idIf yes, it is not addedsepc_id Add only the corresponding onesspec_value_id  */
              if (_skuInfo[index] && _skuInfo[index].spec_id && _skuInfo[index].spec_id === item.spec_id) {
                const _isexit = _skuInfo[index].value_list.some(key => {
                  return key.spec_value_id === item.spec_value_id
                })
                if (!_isexit) {
                  _skuInfo[index].value_list.push(item)
                }
              } else {
                _skuInfo.push({
                  spec_id: item.spec_id,
                  spec_name: item.spec_name,
                  value_list: [item]
                })
              }
            })
          }
        })
        this.productSkuInfo = _skuInfo
      },

      /** Update to getskuItem（skuInfo）data*/
      updateSkuInfo(target) {
        /** Calculate selection data*/
        let _target = target.map(key => {
          if (!key.value_list) {
            return []
          }
          return key.value_list
        })
        this.choiceData = this.printResult(this.combination(..._target))[0]
        /** Construct tabular data to transform data format*/
        const obj = target.map((key) => {
          if (!key.value_list) {
            return []
          }
          return key.value_list.map((item) => {
            let map = new Map().set(key.spec_name, item.spec_value || '')
              .set('spec_value_id', item.spec_value_id)
            let obj = Object.create(null)
            for (let [k, v] of map) {
              obj[k] = v
            }
            return obj
          })
        })
        this.skuInfo = this.printResult(this.combination(...obj))[1]
        // After completing specification selection and calculation, a final data is thrown for final validation
        this.skuTable(this.skuInfo)
      },

      /** Reorganization of the data*/
      combination() {
        var heads = arguments[0]
        if (arguments && arguments.length) {
          for (let i = 1, len = arguments.length; i < len; i++) {
            if (arguments[i].length) {
              heads = this.addNewType(heads, arguments[i])
            }
          }
        }
        return heads
      },

      /** Recursive method*/
      addNewType(heads, choices) {
        let result = []
        for (var i = 0, len = heads.length; i < len; i++) {
          for (var j = 0, lenj = choices.length; j < lenj; j++) {
            if (Array.isArray(heads[i])) {
              var _result = cloneObj(heads[i])
              _result.push(choices[j])
              result.push(_result)
            } else {
              result.push([heads[i], choices[j]])
            }
          }
        }
        return result
      },

      /** Printing method*/
      printResult(result) {
        if (!result) {
          result = []
        }
        const _result = cloneObj(result)
        let _empty = []
        _empty.push(_result)
        /** When we get the datagoodsSkuInfoTo fill the corresponding data item, and to fill the data item when it is matched.
         * A default value is populated if no match is found（this.origin） The current mode is release goods0(namelygoodsSkuInfoWhen the specification does not exist)Or edit to directly populate the default values at all times（this.origin）  */
        for (let i = 0, len = result.length; i < len; i++) {
          /** ifresult[i]If its not an array, construct an array and assign it*/
          if (!Array.isArray(result[i])) {
            result[i] = [result[i]]
          }
          /** To deal withspec_value_idData tag*/
          let _arr = []
          result[i].forEach(key => {
            _arr.push(key.spec_value_id)
          })
          const _result_sim = cloneObj(result[i])
          _result_sim[_result_sim.length - 1].spec_value_id = _arr.join('|')

          if (this.isEditModel === 0 || !this.goodsSkuInfo || (Array.isArray(this.goodsSkuInfo) && this.goodsSkuInfo.length === 0)) { // Launch a product orgoodsSkuInfoThe specs dont exist
            result[i] = Object.assign({ }, ..._result_sim, this.origin)
          } else {
            const value_ids = result[i].map(key => {
              return key.spec_value_id
            }).join('|')
            result[i] = Object.assign({ }, ..._result_sim, ...this.isSpecValIdsExit(value_ids))
          }
        }
        _empty.push(result)

        /** Construct the header*/
        if (result[0]) {
          this.tablehead = Object.keys(result[0]).filter(key => {
            return key !== 'spec_value_id'
          })
        } else {
          this.tablehead = []
        }
        return _empty
      },

      /** Looking forgoodsSkuInfoIn thespec_values_idSame item and returns the corresponding fixed specification data*/
      isSpecValIdsExit(ids) {
        if (!this.goodsSkuInfo || (Array.isArray(this.goodsSkuInfo) && this.goodsSkuInfo.length === 0)) {
          return []
        }
        let _result = this.goodsSkuInfo.filter(key => {
          if (key && key.spec_list && Array.isArray(key.spec_list)) {
            const _ids = key.spec_list.map(item => {
              return item.spec_value_id
            }).join('|')
            if (ids === _ids) {
              return key
            }
          }
        })
        _result = _result.map(key => {
          if (key) {
            let { sn, weight, quantity, cost, price } = key
            return { sn, weight, quantity, cost, price }
          }
        })
        if (_result.length === 0) {
          _result.push(this.origin)
        }
        return _result
      },

      /** Update Form SectionskuInfodata*/
      skuTable(target) {
        this.fixData = target.map(key => {
          let { cost, price, quantity, sn, weight, spec_value_id } = key
          return { cost, price, quantity, sn, weight, spec_value_id }
        })
        this.finalData()
      },

      /** Calculate final data*/
      finalData() {
        /** This is where the final data can be thrown*/
        this.fixData.forEach(key => {
          this.$set(key, 'spec_list', [])
          this.choiceData.forEach(item => {
            if (Array.isArray(item)) {
              const _isExit = item.every(elem => {
                return key.spec_value_id.indexOf(String(elem.spec_value_id)) !== -1
              })
              if (_isExit) {
                item.forEach(key => {
                  key.spec_value_id = parseInt(key.spec_value_id)
                })
                key.spec_list = item
              }
            } else if (parseInt(item.spec_value_id) === parseInt(key.spec_value_id)) {
              item.spec_value_id = parseInt(item.spec_value_id)
              key.spec_list.push(item)
            }
          })
          this.goodsSkuInfo.forEach(item => {
            if (item && item.sku_id && item._spec_value_id && item._spec_value_id === key.spec_value_id) this.$set(key, 'sku_id', item.sku_id)
          })
        })
        /** Throw final data*/
        this.$emit('finalSku', this.fixData)
      }
    }
  }
</script>

<style lang="scss" type="scss" scoped>
  .container {
    margin-left: 0;
    padding-left: 0;
  }

  .sku-settings {
    border: 1px solid #e5e5e5;
    padding: 10px;
    position: relative;
    .label-sku {
      position: absolute;
      top: -5px;
      left: -84px;
      z-index: 100;
      color: #606266;
    }
  }
</style>
