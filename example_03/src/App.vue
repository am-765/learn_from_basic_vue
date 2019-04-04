<template>
  <div class="app">
    <h1>{{ message }}</h1>
    <EditForm/>
  </div>
</template>
<script>
// 子コンポーネントを読み込む
import EditForm from "./components/EditForm";
export default {
  name: "app",
  components: {
    EditForm
  },
  computed: {
    // ローカルの message とストアの message を同期
    message() {
      return this.$store.getters.message;
    }
  }
};
</script>
