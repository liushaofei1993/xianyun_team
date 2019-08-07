<template>
  <header class="header">
    <el-row type="flex" justify="space-between" class="main">
      <!-- logo -->
      <div class="logo">
        <nuxt-link to="/">
          <img src="@/assets/images/logo.jpg" alt />
        </nuxt-link>
      </div>
      <!-- 菜单栏 -->
      <el-row type="flex" class="navs">
        <nuxt-link to="/">首页</nuxt-link>
        <nuxt-link to="/post">旅游攻略</nuxt-link>
        <nuxt-link to="/hotel">酒店</nuxt-link>
        <nuxt-link to="/air">国内机票</nuxt-link>
      </el-row>
      <el-row type="flex">
        <nuxt-link to="/user/login" v-if="!$store.state.user.userInfo.token">登录 / 注册</nuxt-link>
        <el-dropdown v-else>
          <span class="el-dropdown-link">
            <img :src="$axios.defaults.baseURL+$store.state.user.userInfo.user.defaultAvatar" alt />
            {{$store.state.user.userInfo.user.nickname}}
            <i
              class="el-icon-arrow-down el-icon--right"
            ></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <nuxt-link to="#">个人中心</nuxt-link>
            </el-dropdown-item>
            <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </el-row>
  </header>
</template>
<script>
export default {
  mounted() {
    // console.log(this.$store.state);
  },
  methods: {
    handleLogout() {
      if (process.browser) {
        localStorage.removeItem("userInfo");
      }
      this.$store.commit("user/cleanUserInfo");
      this.$router.push("/");
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #ccc;
  box-shadow: 0 3px 0 #f5f5f5;
  .main {
    width: 1000px;
    margin: 0 auto;
    .logo {
      width: 156px;
      img {
        display: block;
        width: 100%;
        padding-top: 8px;
      }
    }
    .navs {
      flex: 1;
      margin: 0 20px;
      a {
        display: block;
        height: 60px;
        padding: 0 20px;
        box-sizing: border-box;
        &:hover {
          color: #409eff;
          border-bottom: 5px solid #409eff;
        }
      }
      //   菜单高亮时的颜色
      /deep/ .nuxt-link-exact-active {
        background-color: #409eff;
        color: #fff !important;
      }
    }
    .el-dropdown-link {
      margin-left: 20px;
      &:hover {
        img {
          border-color: #409eff;
        }
      }

      a {
        display: block;
      }

      img {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        border: 2px #fff solid;
        border-radius: 50%;
      }
    }
  }
}
</style>
