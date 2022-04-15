/**
 * Created by Andste on 2018/5/13.
 * A hierarchical selector that provides the underlying functionality
 */

import Vue from 'vue'
import GradeEditor from './src/main'

GradeEditor.install = () => {
  Vue.component(GradeEditor.name, GradeEditor)
}

export default GradeEditor
