<template>
  <el-form :model="loginForm" ref="loginForm" class="loginForm" :rules="rules">
    <el-form-item calss="form-item" prop="username">
      <el-input placeholder="用户名/手机" v-model="loginForm.username" ref="defaultFocus"></el-input>
    </el-form-item>
    <el-form-item calss="form-item" prop="password">
      <el-input
        placeholder="密码"
        type="password"
        v-model="loginForm.password"
        @keyup.enter.native="handleLoginSubmit"
      ></el-input>
    </el-form-item>
    <p class="form-text">
      <nuxt-link to="#">忘记密码</nuxt-link>
    </p>
    <el-button class="submit" type="primary" @click="handleLoginSubmit">登录</el-button>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleLoginSubmit() {
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          //   this.$axios({
          //     url: "/accounts/login",
          //     method: "POST",
          //     data: this.loginForm
          //   }).then(res => {
          //     // console.log(res.data);
          //     // 保存到store,要使用mutations方法
          //     // mutations下的方法都必须要使用commit来调用
          //     // 第一个参数是调用的方法名,第二个参数就是数据
          //     this.$store.commit("user/setUserInfo", res.data);
          //     this.$router.push("/");
          //   });
          this.$store.dispatch("user/login", this.loginForm).then(res => {
            // 成功提示
            this.$message.success("登录成功,正在跳转");
            // 跳转到首页
            setTimeout(() => {
              //   this.$router.push("/");
              this.$router.back();
            }, 1000);
          });
        }
      });
    }
  },
  mounted() {
    this.$refs.defaultFocus.focus();
  }
};
</script>
<style lang="less" scoped>
.loginForm {
  padding: 25px;
  .form-text {
    font-size: 12px;
    color: #409eff;
    text-align: right;
    line-height: 1;
  }
  .submit {
    width: 100%;
    margin-top: 10px;
  }
}
</style>

