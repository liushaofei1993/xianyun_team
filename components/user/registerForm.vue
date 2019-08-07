<template>
  <el-form class="regForm" :model="regForm" ref="regForm" :rules="rules">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名/手机" v-model="regForm.username"></el-input>
    </el-form-item>
    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="验证码" v-model="regForm.captcha">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="你的名字" v-model="regForm.nickname"></el-input>
    </el-form-item>
    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="regForm.password"></el-input>
    </el-form-item>
    <el-form-item class="form-item" prop="checkPassword">
      <el-input placeholder="确认密码" type="password" v-model="regForm.checkPassword"></el-input>
    </el-form-item>
    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>
<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.regForm.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      regForm: {
        username: "",
        captcha: "",
        nickname: "",
        password: "",
        checkPassword: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        checkPassword: [
          {
            validator: validatePass,
            trigger: "blur"
          }
        ],
        nickname: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "blur"
          }
        ],
        captcha: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleSendCaptcha() {
      if (!this.regForm.username) {
        this.$message.warning("手机号码不能为空");
        return false;
      } else if (this.regForm.username.length !== 11) {
        this.$message.warning("手机号码格式错误");
        return false;
      }
      this.$axios({
        url: "captchas",
        method: "POST",
        data: {
          tel: this.regForm.username
        }
      })
        .then(res => {
          //   console.log(res);
          const { code } = res.data;
          this.$alert(`模拟手机验证码为:${code}`);
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleRegSubmit() {
      this.$refs["regForm"].validate(valid => {
        if (valid) {
          const { checkPassword, ...props } = this.regForm;
          this.$store.dispatch("user/register", props).then(res => {
            //   成功提示
            this.$message.success("注册用户成功");
            // 跳转到首页
            setTimeout(() => {
              this.$router.replace("/");
            }, 1000);
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.regForm {
  padding: 25px;
  .submit {
    width: 100%;
  }
}
</style>
