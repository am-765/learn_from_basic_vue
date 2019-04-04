import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: '初期メッセージ'
  },
  getters: {
    // messageを使用するゲッター
    message(state) {
      return state.message
    }
  },
  mutations: {
    // メッセージを変更するミューテーション
    setMessage(state, payload) {
      state.message = payload.message
    }
  },
  actions: {
    // メッセージの更新処理
    doUpdate({
      commit
    }, message) {
      commit('setMessage', {
        message
      })
    }
  }
})
