<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->

      <OrderForm
        @setInfoData="setInfoData"
        @setTotalPrice="setTotalPrice"
        @setUsersLen="setUsersLen"
      />

      <!-- 侧边栏 -->

      <OrderAside :data="infoData" :totalPrice="totalPrice" :usersLen="usersLen" />
    </el-row>
  </div>
</template>

<script>
import OrderForm from "@/components/air/orderForm.vue";
import OrderAside from "@/components/air/orderAside.vue";
export default {
  data() {
    return {
      // 机票信息
      infoData: {
        seat_infos: {}
      },
      totalPrice: 0,
      usersLen: 0
    };
  },
  components: {
    OrderForm,
    OrderAside
  },
  methods: {
    setInfoData(data) {
      this.infoData = data;
    },
    setTotalPrice(price) {
      this.totalPrice = price;
    },
    setUsersLen(len) {
      this.usersLen = len;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 20px auto;
}

/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}
</style>