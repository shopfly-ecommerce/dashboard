<template>
  <div class="container">
    <el-form :model="articleForm" :rules="articleRules" ref="articleForm" label-width="100px">
      <el-form-item label="The article name" prop="article_name" style="width: 500px">
        <el-input v-model="articleForm.article_name"></el-input>
      </el-form-item>
      <el-form-item label="The article classification" prop="category_id">
        <el-cascader
          :options="articleCategoryTree"
          :props="{children: 'children',label: 'name',value: 'id'}"
          :show-all-levels="false"
          :value="defaultCascaderValue"
          @change="handleCascaderChange"
          change-on-select
        ></el-cascader>
      </el-form-item>
      <el-form-item label="The article sorted" prop="sort">
        <el-input-number v-model="articleForm.sort" controls-position="right" :min="0" :max="99999"></el-input-number>
      </el-form-item>
      <el-form-item label="The article content" prop="content">
        <UE ref="ue" :defaultMsg="articleForm.content"></UE>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="submitArticleForm">Save the paper</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as API_Article from '@/api/article'
  import { UE } from '@/components'

  export default {
    name: 'addArticle',
    components: { UE },
    data() {
      const checkCategory = (rule, value, callback) => {
        if (!value && value === 0) {
          callback(new Error('Please select the article category！'))
        } else {
          callback()
        }
      }
      const { article_id, category } = this.$route.params
      return {
        // If it is a modification, there is a value
        article_id,
        // Classification tree
        articleCategoryTree: [],
        // Add and modify article forms
        articleForm: {
          article_name: '',
          content: '',
          category_id: 0
        },
        // Add and modify article form rules
        articleRules: {
          article_name: [this.MixinRequired('Please enter the name of the article！')],
          category_id: [
            { required: true, message: 'Please enter the article category', trigger: 'blur' },
            { validator: checkCategory, trigger: 'blur' }
          ],
          content: [this.MixinRequired('Please enter the content of the article！')]
        },
        // Cascading selector default
        defaultCascaderValue: []
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.article_id = to.params.article_id
      next()
    },
    activated() {
      this.article_id = this.$route.params.article_id
    },
    watch: {
      article_id() {
        if (this.article_id) {
          this.Get_ArticleData()
        } else {
          this.articleForm = {
            article_name: '',
            content: '',
            category_id: 0
          }
          this.defaultCascaderValue = []
        }
      }
    },
    mounted() {
      if (this.article_id) this.Get_ArticleData()
      API_Article.getAritcleCategoryTree().then(response => {
        const rmEmptyChildren = (item) => {
          if (Array.isArray(item.children) && !item.children.length) {
            delete item.children
          }
        }
        this.articleCategoryTree = response.map(item => {
          rmEmptyChildren(item)
          if (item.children) {
            item.children.map(_item => {
              rmEmptyChildren(_item)
              return _item
            })
          }
          return item
        })
      })
    },
    methods: {
      /** When the classification changes*/
      handleCascaderChange(data) {
        this.articleForm.category_id = data[data.length - 1]
      },
      /** add、Edit the article form submission*/
      submitArticleForm() {
        this.articleForm.content = this.$refs['ue'].getUEContent()
        this.$refs['articleForm'].validate((valid) => {
          if (valid) {
            const saveScuess = () => {
              this.$message.success('Save success！')
              this.$route.params.callback()
              this.$store.dispatch('delCurrentViews', {
                view: this.$route,
                $router: this.$router
              })
            }
            const { article_id } = this
            if (article_id) {
              API_Article.editArticle(article_id, this.articleForm).then(saveScuess)
            } else {
              API_Article.addArticle(this.articleForm).then(saveScuess)
            }
          } else {
            this.$message.error('There is an error in the form. Please check it！')
            return false
          }
        })
      },
      /** Get article details*/
      Get_ArticleData() {
        API_Article.getArticleDetail(this.article_id).then(response => {
          this.articleForm = response
          let d = []
          const { category_id } = response
          // this.articleCategoryTree.forEach(item => {
          //   if (item.id === category_id) {
          //     d = [item.id]
          //   } else {
          //     item.children && item.children.forEach(_item => {
          //       if (_item.id === category_id) {
          //         d = [item.id, _item.id]
          //       }
          //     })
          //   }
          // })
          this.defaultCascaderValue = d
        })
      }
    }
  }
</script>

