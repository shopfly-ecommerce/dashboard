<template>
  <div>
    <en-table-layout
      toolbar
      pagination
      :tableData="tableData"
      :loading="loading"
      :selectionChange="selectionChange">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button type="primary" @click="selectgoodslist" >选择商品</el-button>
          <el-button type="danger" @click="cancelall">批量取消</el-button>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column type="selection"/>
        <el-table-column label="商品信息" width="1000">
          <template slot-scope="scope">
            <div class="goods-info">
              <a class="goods-name" :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`">
                <img v-if="scope.row.thumbnail" :src="scope.row.thumbnail" class="goods-image"/>
              </a>
              <div class="goodsinfo-txt">
                <a class="goods-name" :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`">{{ scope.row.goods_name }}</a>
                <span class="goods-price">{{ scope.row.price | unitPrice('￥') }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="库存">
          <template slot-scope="scope">
             <span v-if="scope.row.enable_quantity || scope.row.enable_quantity === 0">{{ scope.row.enable_quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="danger"
              @click="canceljoin(scope)">取消参加
            </el-button>
          </template>
        </el-table-column>
      </template>
    </en-table-layout>
    <div class="save-tag">
      <el-button type="primary" @click="savesetup">保存设置</el-button>
    </div>
    <en-goods-picker
      type="seller"
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
  import * as API_goodsTag from '@/api/goodsTag'
  export default {
    name: 'tagAdd',
    data() {
      return {
        /** 标签商品列表loading状态 */
        loading: false,

        /** 标签商品列表参数*/
        params: {
          page_no: 1,
          page_size: 10,
          tag_id: ''
        },

        /** 标签id */
        tag_id: '',

        /** 标签名称 */
        tag_name: '',

        /** 标签商品列表数据 */
        tableData: [],

        /** 标签商品已选择项id的集合 */
        selectionids: [],

        /** 商品选择器最大长度*/
        maxsize: 0,

        /** 商品选择器列表api*/
        goodsApi: 'seller/goods?market_enable=1&is_auth=1',

        multipleApi: 'seller/goods/@ids/details',

        /** 商城分类api */
        categoryApi: 'seller/goods/category/0/children',

        /** 显示/隐藏商品选择器 */
        showDialog: false,

        /** 商品ids */
        goodsIds: []
      }
    },
    watch: {
      tag_id: 'GET_TagGoodsList'
    },
    beforeRouteUpdate(to, from, next) {
      this.params.tag_id = this.tag_id = to.params.tag_id
      this.tag_name = to.query.tag_name
      next()
    },
    activated() {
      this.params.tag_id = this.tag_id = this.$route.params.tag_id
      this.tag_name = this.$route.query.tag_name
    },
    mounted() {
      this.params.tag_id = this.tag_id = this.$route.params.tag_id
      this.tag_name = this.$route.query.tag_name
    },
    methods: {
      /**  显示商品选择器*/
      selectgoodslist() {
        this.showDialog = true
      },

      /** 保存商品选择器选择的商品 */
      refreshFunc(val) {
        this.tableData = val
        /** 去重 转化 */
        const res = new Map()
        this.tableData = this.tableData.filter((key) => !res.has(key.goods_id) && res.set(key.goods_id, 1))
        this.goodsIds = this.tableData.map(key => {
          return key.goods_id
        })
      },

      /** 获取标签下的商品列表**/
      GET_TagGoodsList() {
        this.loading = true
        API_goodsTag.getTagGoodsList(this.params.tag_id, {}).then(response => {
          this.loading = false
          this.tableData = response.data
          this.goodsIds = this.tableData.map(key => {
            return key.goods_id
          })
          this.maxsize = 0
        })
      },

      /**  取消参加 */
      canceljoin(scope) {
        this.tableData.forEach((elem, index) => {
          if (elem.goods_id === scope.row.goods_id) {
            this.tableData.splice(index, 1)
          }
        })
        this.goodsIds = this.tableData.map(key => {
          return key.goods_id
        })
      },

      selectionChange(val) {
        this.selectionids = val.map(item => item.goods_id)
      },

      /** 批量取消 */
      cancelall() {
        if (this.selectionids.length <= 0) {
          this.$message.error('请选择要取消的商品')
          return
        }
        this.selectionids.forEach(key => {
          this.tableData.forEach((elem, index) => {
            if (elem.goods_id === key) {
              this.tableData.splice(index, 1)
            }
          })
        })
        this.goodsIds = this.tableData.map(key => {
          return key.goods_id
        })
      },
      /** 保存设置 */
      savesetup() {
        let _goods_ids = this.tableData.map(key => {
          return key.goods_id
        })
        if (!_goods_ids.length) _goods_ids = -1
        API_goodsTag.saveTagGoodsList(this.params.tag_id, _goods_ids, this.params).then(() => {
          this.loading = false
          this.$message.success('保存设置成功！')
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

  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }
  /deep/ thead>tr {
    /deep/ th:nth-child(2) {
      text-align: left !important;
    }
  }

  /*商品信息*/
  .goods-info {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    .goods-image {
      width: 50px;
      height: 50px;
    }
    .goodsinfo-txt {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: flex-start;
      .goods-name {
        color: #6289ff;
      }
      .goods-price {
        color: #f60;
      }
    }
  }



  /*保存标签商品*/
  .save-tag {
    text-align: center;
    button {
      margin-top: 15px;
    }
  }

</style>
