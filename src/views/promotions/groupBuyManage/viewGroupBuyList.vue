<template>
  <div>
    <en-table-layout
      toolbar
      pagination
      :tableData="tableData"
      :loading="loading">
      <template slot="table-columns">
        <el-table-column label="Commodity images" width="120">
          <template slot-scope="scope">
            <img :src="scope.row.img_url" class="goods-image"/>
          </template>
        </el-table-column>
        <el-table-column label="Group name" >
          <template slot-scope="scope">
            <div>
              <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank" style="color: #266fd4;">{{ scope.row.gb_name }}</a>
            </div>
            <div>{{ scope.row.gb_title }}</div>
          </template>
        </el-table-column>
        <el-table-column  label="Activity information" >
          <template slot-scope="scope">
            <!--The name of the event-->
            <div>{{ scope.row.title }}</div>
            <!--Activity start time----End time-->
            <div>{{ scope.row.start_time| unixToDate('yyyy-MM-dd') }} - {{ scope.row.end_time| unixToDate('yyyy-MM-dd') }}
            </div>
          </template>
        </el-table-column>
        <!--Number of Group purchases-->
        <el-table-column prop="buy_num" label="Is a bulk" width="120"/>
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
  </div>
</template>

<script>
  import * as API_groupBuy from '@/api/groupBuy'
  import { CategoryPicker } from '@/components'
  export default {
    name: 'viewGroupBuyList',
    components: {
      [CategoryPicker.name]: CategoryPicker
    },
    data() {
      return {
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10,
          act_id: this.$route.params.id
        },

        /** The list of data*/
        tableData: [],

        /** List paging data*/
        pageData: [],

        /** Current group purchase status*/
        currentGroupBuyStatus: '',

        /** A bulk state*/
        groupBuyStatus: this.$route.params.status_text
      }
    },
    mounted() {
      this.GET_GroupGoodsList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_GroupGoodsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_GroupGoodsList()
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        delete this.params.keywords
        this.params = {
          ...this.params,
          keywords: data
        }
        this.GET_GroupGoodsList()
      },

      /** Groupon status has changed*/
      groupBuyStatusChange(val) {
        delete this.params.status
        if (val >= 0) {
          this.params = {
            ...this.params,
            status: val
          }
        }
        this.GET_GroupGoodsList()
      },

      /** Get a list of group purchase items*/
      GET_GroupGoodsList() {
        this.loading = true
        API_groupBuy.getGroupBuyGoods(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          this.tableData = response.data
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

  div.toolbar-btns {
    width: 100%;
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
      margin-right: 30px;
    }
  }

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

  .goods-image {
    width: 50px;
    height: 50px;
  }

</style>
