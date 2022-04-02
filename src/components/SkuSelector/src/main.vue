<template>
  <div class="container">
    <!--规格选择-->
    <sku-item
      :categoryId="categoryId"
      :productSkuInfo="productSkuInfo"
      @updateSkuInfo="updateSkuInfo"
    ></sku-item>
    <!--规格设置-->
    <div class="sku-settings">
      <label class="label-sku">规格明细：</label>
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
      /** 分类id*/
      categoryId: {
        type: [String, Number],
        default: ['', 0]
      },

      /** 商品规格信息 */
      goodsSkuInfo: {
        type: Array,
        default: []
      },

      /** 当前模式 发布商品0 编辑商品1 编辑草稿箱商品2 */
      isEditModel: {
        type: Number,
        default: 0
      },

      /** 当前商品Id */
      goodsId: {
        type: [String, Number],
        default: ['', 0]
      },

      /** 当前商品编号 */
      goodsSn: {
        type: [String, Number],
        default: ['', 0]
      },

      /** 是否自动生成货号 */
      productSn: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        /** 编辑时 完成计算的规格选择数据 */
        productSkuInfo: [],

        /** 固定表头字段信息 */
        origin: {
          sn: '',
          weight: '',
          quantity: 0,
          cost: '',
          price: ''
        },

        /** 表头数据 */
        tablehead: [],

        /** 表格数据 */
        skuInfo: [],

        /** 表格要抛出的固定数据*/
        fixData: [],

        /** 规格选择部分抛出的计算数据 */
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
      /** 接受外界信息并且 构造skuItem所需要的数据 （spec_id spec_value_id）*/
      chooseData() {
        const _skuInfo = []
        this.goodsSkuInfo.forEach(key => {
          if (key && key.spec_list && Array.isArray(key.spec_list)) {
            key.spec_list.forEach((item, index) => {
              /** 如果spec_id存在 则不再添加sepc_id 只添加对应的spec_value_id  */
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

      /** 更新得到skuItem（skuInfo）数据 */
      updateSkuInfo(target) {
        /** 计算选择数据 */
        let _target = target.map(key => {
          if (!key.value_list) {
            return []
          }
          return key.value_list
        })
        this.choiceData = this.printResult(this.combination(..._target))[0]
        /** 构造表格数据 转换数据格式 */
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
        // 完成规格选择和计算之后 抛出一次最终数据 为了最终的校验
        this.skuTable(this.skuInfo)
      },

      /** 重组数据*/
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

      /** 递归方法 */
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

      /** 打印方法 */
      printResult(result) {
        if (!result) {
          result = []
        }
        const _result = cloneObj(result)
        let _empty = []
        _empty.push(_result)
        /** 得到数据之后 去goodsSkuInfo中进行匹配对应的数据项进行填充，匹配到则进行填充，
         * 没有匹配到则填充默认值（this.origin） 当前模式为发布商品0(即goodsSkuInfo规格本来就不存在时)或编辑时时直接填充默认值（this.origin）  */
        for (let i = 0, len = result.length; i < len; i++) {
          /** 如果 result[i]不是数组 则构造数组赋给它*/
          if (!Array.isArray(result[i])) {
            result[i] = [result[i]]
          }
          /** 处理spec_value_id数据标记 */
          let _arr = []
          result[i].forEach(key => {
            _arr.push(key.spec_value_id)
          })
          const _result_sim = cloneObj(result[i])
          _result_sim[_result_sim.length - 1].spec_value_id = _arr.join('|')

          if (this.isEditModel === 0 || !this.goodsSkuInfo || (Array.isArray(this.goodsSkuInfo) && this.goodsSkuInfo.length === 0)) { // 发布商品 || goodsSkuInfo规格本来就不存在
            result[i] = Object.assign({ }, ..._result_sim, this.origin)
          } else {
            const value_ids = result[i].map(key => {
              return key.spec_value_id
            }).join('|')
            result[i] = Object.assign({ }, ..._result_sim, ...this.isSpecValIdsExit(value_ids))
          }
        }
        _empty.push(result)

        /** 构造表头 */
        if (result[0]) {
          this.tablehead = Object.keys(result[0]).filter(key => {
            return key !== 'spec_value_id'
          })
        } else {
          this.tablehead = []
        }
        return _empty
      },

      /** 寻找goodsSkuInfo中的spec_values_id相同项 并且返回 对应的固定规格数据 */
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

      /** 更新表格部分skuInfo数据 */
      skuTable(target) {
        this.fixData = target.map(key => {
          let { cost, price, quantity, sn, weight, spec_value_id } = key
          return { cost, price, quantity, sn, weight, spec_value_id }
        })
        this.finalData()
      },

      /** 计算最终数据 */
      finalData() {
        /** 在此处可抛出最终数据 */
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
        /** 抛出最终数据 */
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
