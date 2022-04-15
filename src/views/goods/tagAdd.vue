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
          <el-button type="primary" @click="selectgoodslist" >Choose goods</el-button>
          <el-button type="danger" @click="cancelall">Batch cancelled</el-button>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column type="selection"/>
        <el-table-column label="Product information" width="1000">
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
        <el-table-column label="Inventory">
          <template slot-scope="scope">
             <span v-if="scope.row.enable_quantity || scope.row.enable_quantity === 0">{{ scope.row.enable_quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button
              type="danger"
              @click="canceljoin(scope)">Cancel to
            </el-button>
          </template>
        </el-table-column>
      </template>
    </en-table-layout>
    <div class="save-tag">
      <el-button type="primary" @click="savesetup">Save Settings</el-button>
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
        /** Labeled goods listloadingStatus*/
        loading: false,

        /** Label item list parameters*/
        params: {
          page_no: 1,
          page_size: 10,
          tag_id: ''
        },

        /** The labelid */
        tag_id: '',

        /** Tag name*/
        tag_name: '',

        /** Tagged item list data*/
        tableData: [],

        /** Label items selectedidA collection of*/
        selectionids: [],

        /** Maximum length of commodity selector*/
        maxsize: 0,

        /** Product selector listapi*/
        goodsApi: 'seller/goods?market_enable=1&is_auth=1',

        multipleApi: 'seller/goods/@ids/details',

        /** Mall classificationapi */
        categoryApi: 'seller/goods/category/0/children',

        /** According to/Hide the product selector*/
        showDialog: false,

        /** productids */
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
      /**  Displays the product selector*/
      selectgoodslist() {
        this.showDialog = true
      },

      /** Save the item selected by the commodity selector*/
      refreshFunc(val) {
        this.tableData = val
        /** To weight conversion*/
        const res = new Map()
        this.tableData = this.tableData.filter((key) => !res.has(key.goods_id) && res.set(key.goods_id, 1))
        this.goodsIds = this.tableData.map(key => {
          return key.goods_id
        })
      },

      /** Gets the list of items under the label**/
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

      /**  Cancel to*/
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

      /** Batch cancelled*/
      cancelall() {
        if (this.selectionids.length <= 0) {
          this.$message.error('Please select the item to cancel')
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
      /** Save Settings*/
      savesetup() {
        let _goods_ids = this.tableData.map(key => {
          return key.goods_id
        })
        if (!_goods_ids.length) _goods_ids = -1
        API_goodsTag.saveTagGoodsList(this.params.tag_id, _goods_ids, this.params).then(() => {
          this.loading = false
          this.$message.success('Save Settings successfully！')
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

  /*Product information*/
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



  /*Save labelled goods*/
  .save-tag {
    text-align: center;
    button {
      margin-top: 15px;
    }
  }

</style>
