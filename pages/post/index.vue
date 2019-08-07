<template>
  <div class="post">
    <div class="main">
      <div class="aside">
        <div class="menu" @mouseleave="menuIndex= -1">
          <div
            class="menu_item"
            v-for="(item,index) in menus"
            :key="index"
            @mouseenter="handlehover(index)"
            :class="{'active':menuIndex===index}"
          >
            <span>{{item.type}}</span>
            <i class="el-icon el-icon-arrow-right"></i>
          </div>
          <div class="sub_menu" v-if="menus[menuIndex]">
            <div
              class="submenu_item"
              v-for="( item,index ) in menus[menuIndex].children"
              :key="index"
            >
              <div class="top">{{index+1}}</div>
              <div class="city">{{item.city}}</div>
              <div class="desc">{{item.desc}}</div>
            </div>
          </div>
        </div>
        <div class="aside_recommend">
          <h3>推荐城市</h3>
          <img src="http://157.122.54.189:9093/images/pic_sea.jpeg" alt />
        </div>
      </div>
      <div class="content">
        <div class="search">
          <input type="text" v-model="query.city"  @keyup.enter="getPostList"/>
          <i class="el-icon el-icon-search" @click="getPostList"></i>
        </div>
        <!-- 推荐 -->
        <div class="tags">
          <span>推荐:</span>
          <span class="tags_item" v-for="(item,index) in tags" :key="index" @click="handlesearch(item)">{{item}}</span>
        </div>
        <!-- 推荐攻略 -->
        <div class="article">
          <div class="article_header">
            <div class="title">推荐攻略</div>
            <el-button type="primary">写游记</el-button>
          </div>
          <div class="article_body">
            <div class="article_item" v-for="(item,index) in list" :key="index">
              <img
                :src="item.images[0]"
                alt class="article_item_cover"
              />
              <div class="article_item_info">
                <nuxt-link to="/" class="title1">{{item.title}}</nuxt-link>
                <div class="desc">{{item.summary}}</div>
                <div class="info">
                  <div class="lt">
                    <div class="local">
                      <i class="el-icon el-icon-location-outline"></i>
                      <span>{{item.cityName}}</span>
                    </div>
                    <div class="user">
                        by
                        <img :src="`http://157.122.54.189:9095${item.account.defaultAvatar}`" alt="">
                        <nuxt-link to="/">{{item.account.nickname}}</nuxt-link>
                    </div>
                    <div class="watch">
                      <i class="el-icon el-icon-view"></i>
                      <span>{{item.watch}}</span>
                    </div>
                  </div>
                  <div class="like">{{item.like}}赞</div>
                </div>
              </div>
            </div>
          </div>
          <div class="article_footer">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="3"
                layout="total, sizes, prev, pager, next, jumper"
                :total="listTotal">
            </el-pagination>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        query: {
            city: "广州",
            _start: 0,
            _limit: 3
        },
        menus: [],
        menuIndex: -1,
        tags: ["北京", "上海", "广州"],
        list: [],
        listTotal: 0
    };
  },
  mounted() {
      this.getCities();
      this.getPostList()
  },
  methods: {
      handlesearch(item){
          console.log(item);
          this.query.city = item
          this.getPostList()
      },
    handlehover(index) {
      this.menuIndex = index;
    },
    getCities() {
        this.$axios({
        url: "/posts/cities"
        }).then(res => {
        // console.log(res);
        this.menus = res.data.data;
        });
    },
    getPostList(){
        this.$axios({
            url:'posts',
            params:this.query
        }).then(res=>{
            this.list = res.data.data;
            this.listTotal = res.data.total
        })
    },
    handleSizeChange(val) {
        this.query._limit = val;
    },
    handleCurrentChange(val) {
        this.query._start = (val-1) * this.query._limit;
    }
  }
};
</script>

<style lang="less" scoped>
.post {
  margin-top: 20px;
  .main {
    width: 1000px;
    margin: 0 auto;
    display: flex;

    .aside {
      margin-right: 50px;
      .menu {
        border: 1px solid #ccc;
        border-bottom: none;
        border-right: none;
        width: 260px;
        position: relative;
        box-sizing: border-box;
        .menu_item {
          position: relative;
          z-index: 2;
          height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          border-bottom: 1px solid #ccc;
          border-right: 1px solid #ccc;
          font-size: 14px;
          &.active {
            color: orange;
            border-right-color: #fff;
          }
        }
        .sub_menu {
          width: max-content;
          position: absolute;
          top: -1px;
          padding: 0 20px;
          left: 258px;
          background-color: #fff;
          border: 1px solid #ccc;
          z-index: 1;

          .submenu_item {
            display: flex;
            align-items: center;
            height: 40px;
            .top {
              font-size: 18px;
              color: orange;
              margin-right: 10px;
            }
            .city {
              font-size: 14px;
              color: orange;
              margin-right: 10px;
            }
            .desc {
              font-size: 14px;
              color: #ccc;
            }
          }
        }
      }
      .aside_recommend {
        h3 {
          padding: 10px 0;
          border-bottom: 1px solid #ccc;
          margin-bottom: 20px;
        }
        img {
          width: 260px;
        }
      }
    }
    .content {
      flex: 1;
      .search {
        width: 674px;
        height: 34px;
        padding: 0 10px;
        border: 3px solid orange;
        position: relative;
        input {
          width: 100%;
          height: 100%;
          
          border: none;
          &::-webkit-input-placeholder {
            color: #aab2bd;
          }
          &:focus {
            outline: 0;
          }
        }
        i {
          position: absolute;
          top: 50%;
          right: 10px;
          font-size: 20px;
          font-weight: bold;
          color: orange;
          transform: translateY(-50%);
        }
      }
      .tags {
        font-size: 14px;
        color: #000;
        margin-top: 10px;
        &_item {
          margin-left: 10px;
          cursor: pointer;
          &:hover {
            color: orange;
            text-decoration: underline;
          }
        }
      }
      .article {
        padding-top: 20px;
        &_header {
          display: flex;
          justify-content: space-between;
          height: 50px;
          border-bottom: 1px solid #ccc;
          align-items: center;
          .title {
            font-size: 20px;
            color: orange;
            border-bottom: 2px solid orange;
            height: 100%;
          }
        }
        &_body {
          .article_item {
            display: flex;
            padding: 20px 0;
            .article_item_cover {
              width: 220px;
              height: 150px;
              margin-right: 10px;
            }
            .article_item_info {
              flex: 1;
              .title1 {
                font-size: 18px;
                margin-bottom: 10px;
                display: block;
                
              }
              .desc {
                font-size: 14px;
                color: #ccc;
                min-height: 60px;
                margin-bottom: 15px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
              }
              .info {
                display: flex;
                justify-content: space-between;
                .lt {
                  display: flex;
                  line-height: 1;
                  .local {
                      padding-right: 10px;
                    i {
                      font-size: 14px;
                      color: #ccc;
                    }
                    span {
                      font-size: 14px;
                      color: #ccc;
                    }
                  }
                  .user {
                    padding-right: 10px;
                    font-size: 14px;
                    color: #ccc;
                    img{
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        vertical-align: middle;
                    }
                    a {
                      color: orange;
                    }
                  }
                  .watch {
                    i {
                      font-size: 14px;
                      color: #ccc;
                    }
                    span {
                      font-size: 14px;
                      color: #ccc;
                    }
                  }
                }
                .like {
                  color:orange;
                  font-size: 18px;
                }
              }
            }

          }
        }
        &_footer {
            display: flex;
            justify-content: center;

            
        }
      }
    }
  }
}
</style>

