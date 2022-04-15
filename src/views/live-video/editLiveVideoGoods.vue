<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" @click="handleliveVideoGoods">Edit commodity</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent" placeholder="Please enter the keywords"/>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column label="Name">
          <template slot-scope="scope">
            <div class="goods-info">
              <div class="goods-image" style="margin: 0 20px;">
                <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank">
                  <img :src="scope.row.img_show_url"/>
                </a>
              </div>
              <div class="goods-name-box">
                <div class="goods-name">
                  <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank" style="color: #00a2d4;"><span v-html="scope.row.name">{{ scope.row.name }}</span></a>
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
        <el-table-column label="Price">
          <template slot-scope="scope">{{ scope.row.price | unitPrice('￥') }}</template>
        </el-table-column>
        <el-table-column label="Operation" width="350">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleDeleteLiveVideoGoods(scope.$index, scope.row)">delete</el-button>
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
    <!--Commodity selector-->
    <en-goods-sku-picker
      type="seller"
      goods-type="NORMAL"
      :sku="true"
      :show="showDialog"
      :api="goodsApi"
      :defaultData="defaultIds"
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
  import { GoodsSkuPicker } from '@/components'
  import { RegExp } from '~/ui-utils'
  import { api } from '~/ui-domain'

  export default {
    name: 'liveVideoGoodsList',
    components: {
      [GoodsSkuPicker.name]: GoodsSkuPicker
    },
    data() {
      return {
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },

        /** Commodity list data*/
        tableData: {
          data: [],
          page_no: 1,
          page_size: 10,
          data_total: 1
        },

        roomId: this.$route.params.room_id,

        /** Maximum length of commodity selector*/
        maxsize: 0,

        /** Product selector listapi*/
        goodsApi: `${api.live}/seller/live-video/goods/sku`,

        /** Mall classificationapi */
        categoryApi: 'seller/goods/category/0/children',

        /** Echo data usage*/
        multipleApi: 'seller/goods/skus/@ids/details',

        /** According to/Hide the product selector*/
        showDialog: false
      }
    },
    watch: {
      $route() {
        if (this.$route.params.room_id) {
          this.roomId = this.$route.params.room_id
          this.GET_LiveVideoGoodsList()
        }
      }
    },
    computed: {
      defaultIds() {
        return this.tableData.data.map(item => item.sku_id)
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

      /** Edit live merchandise*/
      handleliveVideoGoods() {
        this.showDialog = true
      },

      /** Save the item selected by the commodity selector*/
      refreshFunc(val) {
        val.forEach(key => {
          API_Live.bindLiveVideoGoods(this.roomId, key.we_chat_goods_id).then(response => {
            this.showDialog = false
            this.GET_LiveVideoGoodsList()
          })
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

      /** Get a list of live merchandise*/
      GET_LiveVideoGoodsList() {
        this.loading = true
        API_Live.getLiveVideoGoods(this.roomId, this.params).then(response => {
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
</style>
