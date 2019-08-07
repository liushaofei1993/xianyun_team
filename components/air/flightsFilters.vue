<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>
      <el-col :span="4">
        <el-select
          size="mini"
          placeholder="起飞机场"
          v-model="airport"
          @change="handleAirport"
          clearable
          @clear="handleAirport"
        >
          <el-option
            v-for="(item,index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          size="mini"
          placeholder="起飞时间"
          v-model="flightTimes"
          @change="handleFlightTimes"
          clearable
          @clear="handleFlightTimes"
        >
          <el-option
            v-for="(item,index) in data.options.flightTimes"
            :key="index"
            :label="`${item.from}:00 - ${item.to}:00`"
            :value="`${item.from},${item.to}`"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          size="mini"
          placeholder="航空公司"
          v-model="companyName"
          @change="handleCompany"
          clearable
          @clear="handleCompany"
        >
          <el-option
            v-for="(item,index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          size="mini"
          placeholder="机型"
          v-model="airSize"
          @change="handleAirSize"
          clearable
          @clear="handleAirSize"
        >
          <el-option
            v-for="(item,index) in sizeOptions"
            :key="index"
            :label="item.name"
            :value="item.size"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选:
      <el-button type="primary" round size="mini" @click="handleCancelFilter">撤销</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      airport: "", // 机场
      flightTimes: "", // 出发时间
      companyName: "", // 航空公司
      airSize: "", // 机型大小
      sizeOptions: [
        { name: "小", size: "S" },
        { name: "中", size: "M" },
        { name: "大", size: "L" }
      ],
      //   定义用来实现多选的条件
      filters: {
        airportName: { value: "", key: "org_airport_name" },
        company: { value: "", key: "airline_name" },
        planeSize: { value: "", key: "plane_size" }
      },
      //   定义筛选时间的变量
      filterTime: ""
    };
  },

  //   props除了可以等于数组,还可以等于对象
  props: {
    data: {
      type: Object, //表示数据类型
      default: {} //如果调用组件的时候不传该属性,会取这个默认值
    }
  },
  methods: {
    //  封装条件过滤函数,以实现多条件筛选
    handleFliter() {
      const arr = this.data.flights.filter(v => {
        let pass = true;
        Object.keys(this.filters).forEach(item => {
          // 判断对应的字段是否有值
          if (!this.filters[item].value) return;
          // 多条件
          if (v[this.filters[item].key] !== this.filters[item].value) {
            pass = false;
          }
        });
        return pass;
      });
      return arr;
    },
    handleTimeFilter(arr1) {
      const [from, to] = this.filterTime.split(",");
      if (this.filterTime) {
        const arr = arr1.filter(v => {
          const [start] = v.dep_time.split(":");
          return +start >= +from && +start < +to;
        });
        return arr;
      } else {
        return arr1;
      }
    },

    // 筛选机场
    handleAirport(value) {
      //   const arr = this.data.flights.filter(v => v.org_airport_name === value);
      this.filters.airportName.value = value;
      const arr1 = this.handleFliter();
      const arr = this.handleTimeFilter(arr1);
      this.$emit("setDataList", arr);
    },
    // 筛选时间
    handleFlightTimes(value) {
      if (!value) {
        this.filterTime = "";
      } else {
        this.filterTime = value;
      }
      const arr1 = this.handleFliter();
      const arr = this.handleTimeFilter(arr1);
      this.$emit("setDataList", arr);
    },
    // 筛选航空公司
    handleCompany(value) {
      this.filters.company.value = value;
      const arr1 = this.handleFliter();
      const arr = this.handleTimeFilter(arr1);
      this.$emit("setDataList", arr);
    },
    // 筛选机型
    handleAirSize(value) {
      this.filters.planeSize.value = value;
      const arr1 = this.handleFliter();
      const arr = this.handleTimeFilter(arr1);
      this.$emit("setDataList", arr);
    },
    // 撤销筛选
    handleCancelFilter() {
      //撤销筛选重置数据
      this.airport = "";
      this.flightTimes = "";
      this.companyName = "";
      this.airSize = "";
      this.filterTime = "";
      //   重置多条件筛选对象
      this.filters = {
        airportName: { value: "", key: "org_airport_name" },
        company: { value: "", key: "airline_name" },
        planeSize: { value: "", key: "plane_size" }
      };
      this.$emit("setDataList", this.data.flights);
    }
  },
  watch: {
    //  路由变化时清空筛选条件
    $route(val, oldVal) {
      //撤销筛选重置数据
      this.airport = "";
      this.flightTimes = "";
      this.companyName = "";
      this.airSize = "";
      this.filterTime = "";
    }
  }
};
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
  margin-left: 0;

  .filters-top {
    margin-bottom: 20px;
    /deep/ .el-select {
      margin-left: 20px;
    }
  }
}
</style>