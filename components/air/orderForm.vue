<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info">
        <div class="member-info-item" v-for="(item,index) in users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div
          class="insurance-item"
          v-for="(item,index) in infoData.insurances"
          :key="index"
          @change="handleInsurances(item.id)"
        >
          <el-checkbox
            :label="`${item.type}：￥${item.price}/份×${users.length}  最高赔付${item.compensation}`"
            border
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入手机号码" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
    <input type="hidden" :value="totalPrice" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [{ username: "", id: "" }],
      insurances: [],
      contactName: "",
      contactPhone: "",
      invoice: false,
      captcha: "000000",
      infoData: {}
    };
  },
  computed: {
    totalPrice() {
      let price = 0;
      //   接口没有返回的时候默认为0
      if (!this.infoData.seat_infos) {
        return 0;
      }
      //   机票金额
      price += this.infoData.seat_infos.org_settle_price;

      //   基建燃油费
      price += this.infoData.airport_tax_audlet;
      //   保险
      price += this.insurances.length * 30;
      //   人数
      price *= this.users.length;

      this.$emit("setTotalPrice", price);
      this.$emit("setUsersLen", this.users.length);
      return price;
    }
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      this.users = [...this.users, { username: "", id: "" }];
    },

    // 移除乘机人
    handleDeleteUser(index) {
      this.users.splice(index, 1);
    },

    // 发送手机验证码
    handleSendCaptcha() {
      if (!this.contactPhone) {
        this.$alert("手机号码不能为空", "提示", { type: "warning" });
        return;
      }
      if (this.contactPhone.length !== 11) {
        this.$alert("手机号码格式错误,请输入正确手机号码", "提示", {
          type: "warning"
        });
        return;
      }
      this.$axios({
        url: "captchas",
        method: "POST",
        data: {
          tel: this.contactPhone
        }
      }).then(res => {
        const { code } = res.data;
        this.$alert(`模拟手机号码为:${code}`, "提示", { type: "success" });
      });
    },

    // 提交订单
    handleSubmit() {
      // 需要提交给接口的数据
      const data = {
        users: this.users,
        insurances: this.insurances,
        contactName: this.contactName,
        contactPhone: this.contactPhone,
        invoice: false,
        seat_xid: this.$route.query.seat_xid,
        air: this.$route.query.id,
        captcha: this.captcha
      };
      //   判断表单是否通过
      let valid = true;
      //   判断乘机人信息
      this.users.forEach(item => {
        if (!item.username || !item.id) {
          valid = false;
          this.$alert("乘机人信息不能为空", "提示", {
            type: "warning"
          });
        }
      });
      // 如果valid为false直接返回
      if (!valid) return;

      //   判断联系人信息
      if (!this.contactName) {
        this.$alert("联系人姓名不能为空", "提示", {
          type: "warning"
        });
        return;
      }
      if (!this.contactPhone) {
        this.$alert("联系人手机号码不能为空", "提示", {
          type: "warning"
        });
        return;
      }
      if (!this.captcha) {
        this.$alert("手机验证码不能为空", "提示", {
          type: "warning"
        });
      }
      this.$axios({
        url: "airorders",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      }).then(res => {
        const {
          data: { id }
        } = res.data;
        this.$router.push({
          path: "/air/pay",
          query: {
            id
          }
        });
      });
    },

    //保险
    handleInsurances(id) {
      if (this.insurances.indexOf(id) > -1) {
        this.insurances.splice(this.insurances.indexOf(id), 1);
      } else {
        this.insurances.push(id);
      }
    }
  },
  mounted() {
    const { id, seat_xid } = this.$route.query;
    this.$axios({
      url: `airs/${id}`,
      params: {
        seat_xid
      }
    }).then(res => {
      //   console.log(res);
      this.infoData = res.data;
      this.$emit("setInfoData", this.infoData);
    });
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>