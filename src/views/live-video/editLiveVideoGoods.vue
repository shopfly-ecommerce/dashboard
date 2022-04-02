<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" @click="handleliveVideoGoods">编辑商品</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent" placeholder="请输入关键字"/>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column label="商品名称">
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
        <el-table-column label="商品价格">
          <template slot-scope="scope">{{ scope.row.price | unitPrice('￥') }}</template>
        </el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleDeleteLiveVideoGoods(scope.$index, scope.row)">删除</el-button>
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
    <!--商品选择器-->
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
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },

        /** 商品列表数据 */
        tableData: {
          data: [],
          page_no: 1,
          page_size: 10,
          data_total: 1
        },

        roomId: this.$route.params.room_id,

        /** 商品选择器最大长度*/
        maxsize: 0,

        /** 商品选择器列表api*/
        goodsApi: `${api.live}/seller/live-video/goods/sku`,

        /** 商城分类api */
        categoryApi: 'seller/goods/category/0/children',

        /** 回显数据使用 */
        multipleApi: 'seller/goods/skus/@ids/details',

        /** 显示/隐藏商品选择器 */
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

      /** 编辑直播商品 */
      handleliveVideoGoods() {
        this.showDialog = true
      },

      /** 保存商品选择器选择的商品 */
      refreshFunc(val) {
        val.forEach(key => {
          API_Live.bindLiveVideoGoods(this.roomId, key.we_chat_goods_id).then(response => {
            this.showDialog = false
            this.GET_LiveVideoGoodsList()
          })
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

      /** 获取直播商品列表 */
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
