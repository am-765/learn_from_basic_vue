# 【基礎から学ぶVue.js 輪読会資料】 CHAPTER8 Vuex でアプリケーションの状態を管理

### 参考サイト
<a href="https://cr-vue.mio3io.com/guide/chapter8.html#s42-%E3%82%B7%E3%83%B3%E3%83%97%E3%83%AB%E3%81%AA%E3%82%B9%E3%83%88%E3%82%A2%E6%A7%8B%E9%80%A0" target="_blank">基礎から学ぶVue.js</a><br>
<a href="https://vuex.vuejs.org/ja/" target="_blank">Vuex ドキュメント</a>	

## SECTION41 Vuexとは

Vuex は Vue.js アプリケーションのための 状態管理パターン + ライブラリ。  

### Vuexを導入するメリット
Vuexによって管理されているデータもリアクティブになっているため、コンポーネント構造状態にかかわらず、使用している場所で常に同期可能。

## SECTION42 シンプルなストア構造

Vuexは状態を管理するための「ストア」を作成します。ストアはアプリケーション内に作った「仮想のデータベースのようなもの」と思って下さい。

src/store.js
```js
import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// ストアを作成
const store = new Vuex.Store({
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
export default store

```

Vue.use() はグローバルメソッド、呼び出すことによってプラグインを使用することが可能。

src/main.js
```js
import store from '@/store.js'

console.log(store.state.count) // -> 0
// incrementをコミットする
store.commit('increment')
// もう一度アクセスしてみるとカウントが増えている
console.log(store.state.count) // -> 1

```

store.state.countでストアの状態を取得し、store.state.countでストアの状態を更新する

## SECTION43 コアコンセプト

state ・・・値を保持する   
getter ・・・テンプレートへ値を返します   
mutation・・・stateの値を変更する   
action ・・・mutationを呼び出す

### ステート
コンポーネントで言うところのdata。  
ステートはミューテーション以外の場所から変更できない。

### ゲッター（getter）
ステートを取得するための算出データ。  
引数を渡せるがセッター機能はない。

### ミューテーション（mutations）
ステートを変更できる唯一のメソッド。  
コンポーネントでのmtthodsにあたる。

#### コミット（commit）
コミット（commit）は登録されているミューテーションを呼び出すインスタンスメソッド。

### アクション（actions）
データの加工や非同期処理を行い、その結果をミューテーションにコミットする。

アクションの第一引数は次のようなオブジェクトになっている。
```js
{
  state,      // `store.state` と同じか、モジュール内にあればローカルステート
  rootState,  // `store.state` と同じ。ただしモジュール内に限る
  commit,     // `store.commit` と同じ
  dispatch,   // `store.dispatch` と同じ
  getters,    // `store.getters` と同じか、モジュール内にあればローカルゲッター
  rootGetters // `store.getters` と同じ。ただしモジュール内に限る
}
```

## SECTION44 コンポーネントでストアを使用しよう

src/store.js
```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
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
  actions: { // メッセージの更新処理
    doUpdate({
      commit
    }, message) {
      commit('setMessage', {
        message
      })
    }
  }
})
export default store

```

ストアを定義し・・・

src/main.js
```js

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store, // storeをローカルに登録
  render: h => h(App)
}).$mount('#app') // VueインスタンスをHTMLにマウントする

```

main.jsでこのファイルを読み込みアプリケーションに登録。  
これでどこからでもストアのメッセージを使用したり、更新するためのコミットが可能になる。  
使用する際は$storeを指定する。

## SECTION45 モジュールで大きくなったストアを分割

### モジュールの使い方
Vuex ではストアをモジュールに分割できるようになっている。  
それぞれのモジュールは、モジュール自身の状態（state）、ミューテーション、アクション、ゲッター、モジュールさえも内包できる（モジュールをネストできる）。

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> `moduleA` のステート
store.state.b // -> `moduleB` のステート
```

<a href="https://vuex.vuejs.org/ja/guide/structure.html" target="_blank">モジュール化されたディレクトリ例</a>	

### ネームスペース
モジュールをより自己完結型にまた再利用可能なものにしたい場合は、namespaced: true によって名前空間に分けることができる。  
モジュールが登録されると、そのゲッター、アクション、およびミューテーションのすべてが、モジュールが登録されているパスに基づいて自動的に名前空間に入れられる。

```js
const moduleA = {
  namespaced: true,
  state: {
    count: 1
  },
  mutations: {
    update(state) {
      state.count += 100
    }
  }
}
const moduleB = {
  namespaced: true,
  state: {
    count: 2
  },
  mutations: {
    update(state) {
      state.count += 200
    }
  }
}

store.commit('moduleA/update') // -> moduleA の update をコミット
store.commit('moduleB/update') // -> moduleB の update をコミット
```
<a href="https://vuex.vuejs.org/ja/guide/modules.html#%E5%90%8D%E5%89%8D%E7%A9%BA%E9%96%93" target="_blank">より詳しくはこちら</a>	

## SECTION46 その他の機能やオプション

### ストアの状態を監視する

```js
watch(fn: Function, callback: Function, options?: Object): Function
```

fnが返す値をリアクティブに監視し、値が変わった時にコールバックを呼ぶ。fnは最初の引数としてストアのステートを、2番目の引数としてゲッターを受け取る。

### Vuexでホットリロードを使用する
Vuex は webpack の Hot Module Replacement API を使用することで、アプリケーションの開発を行っている間のミューテーション、モジュール、アクション、ゲッターのホットリロードが可能。    
ミューテーションとモジュールのホットリローディングのために、store.hotUpdate() API メソッドの利用が必要。

## まとめ
・設計段階や初期段階でデータのやり取りが増えそうならVuexの導入を検討する。
・ステートはミューテーション以外から変更してはいけない！
・ストアはモジュール化すると管理しやすい！
・データの扱いをストアメインにするか、コンポーネントメインにするかはお好みで！

