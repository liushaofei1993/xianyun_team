<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="cacheFlightsData" @setDataList="setDataList" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <FlightsItem v-for="(item,index) in dataList" :key="index" :data="item" />
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="flightsData.total"
        ></el-pagination>
      </div>
      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
        <FlightsAside />
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from "@/components/air/flightsListHead.vue";
import FlightsItem from "@/components/air/flightsItem.vue";
import FlightsFilters from "@/components/air/flightsFilters.vue";
import FlightsAside from "@/components/air/flightsAside.vue";
import moment from "moment";

export default {
  data() {
    return {
      flightsData: {}, //航班总数据
      cacheFlightsData: {
        flights: [],
        info: {},
        options: {}
      }, //缓存一份数据
      dataList: [], //航班列表数据
      pagesize: 5, //显示条数
      pagenum: 1 //当前页数
    };
  },
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
  },
  methods: {
    getData() {
      this.$axios({
        url: "/airs",
        params: this.$route.query
      }).then(res => {
        this.flightsData = res.data;
        // 缓存数据传给过滤组件过滤
        this.cacheFlightsData = { ...res.data };
        console.log(this.cacheFlightsData);
        // 获取分页过滤后的数据
        this.setDataList();
      });
    },
    setDataList(arr) {
      if (arr) {
        this.pagenum = 1;
        this.flightsData.flights = arr;
        this.flightsData.total = arr.length;
      }
      const start = (this.pagenum - 1) * this.pagesize;
      const end = start + this.pagesize;
      this.dataList = this.flightsData.flights.slice(start, end);
    },
    // 显示条目发生变化时触发
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.setDataList();
    },
    // 当前页码发生变化时触发
    handleCurrentChange(val) {
      this.pagenum = val;
      this.setDataList();
    }
  },
  mounted() {
    this.getData();
  },
  watch: {
    $route() {
      this.getData();
    }
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  float: right;
  width: 240px;
}
</style>