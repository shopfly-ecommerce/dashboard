/**
 * Created by Andste on 2018/5/21.
 * 图片选择组件
 */

import Vue from 'vue'
import ImageUpload from './src/main'

ImageUpload.install = () => {
  Vue.component(ImageUpload.name, ImageUpload)
}

export default ImageUpload
