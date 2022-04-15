/**
 * Created by Andste on 2018/5/21.
 * Image selection component
 */

import Vue from 'vue'
import ImageUpload from './src/main'

ImageUpload.install = () => {
  Vue.component(ImageUpload.name, ImageUpload)
}

export default ImageUpload
