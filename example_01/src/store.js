import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    // カウントアップするミューテーションを登録
    increment(state) {
      state.count++
    }
  }
})
