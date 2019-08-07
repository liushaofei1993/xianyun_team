<template>
  <div class="container" style="`url(${$axios.defaults.baseURL}+/assets/th01.jfif)`">
    <el-row type="flex" justify="center" align="middle" class="main">
      <div class="form-wrapper">
        <el-row type="flex" justify="center" class="tabs">
          <span
            v-for="(item,index) in ['登录','注册']"
            :key="index"
            @click="handleClick(index)"
            :class="{active:current===index}"
          >{{item}}</span>
        </el-row>
        <el-row>
          <LoginForm v-if="current===0" />
          <RegisterForm v-if="current===1" />
        </el-row>
      </div>
    </el-row>
  </div>
</template>
<script>
import LoginForm from "@/components/user/loginForm.vue";
import RegisterForm from "@/components/user/registerForm.vue";
export default {
  data() {
    return {
      current: 0
    };
  },
  methods: {
    handleClick(index) {
      this.current = index;
    }
  },
  components: {
    LoginForm,
    RegisterForm
  }
};
</script>

<style lang="less" scoped>
.container {
  min-width: 1000px;
  margin: 0 auto;
  height: 700px;
  background: url(http://127.1:1337/assets/images/th02.jfif) center 0;
  .main {
    width: 1000px;
    height: 100%;
    margin: 0 auto;
    position: relative;
    .form-wrapper {
      width: 400px;
      background-color: #fff;
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
      .tabs {
        span {
          display: block;
          width: 50%;
          color: #666;
          text-align: center;
          padding: 10px 0;
          box-sizing: border-box;
          border-top: 2px #eee solid;
          background-color: #eee;
          cursor: pointer;
          &.active {
            color: orange;
            border-top-color: orange;
            background-color: #fff;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
