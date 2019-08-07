// 保存数据的属性state
export const state = () => {
  // 用户信息
  return {
    userInfo: {
      token: '',
      user: {}
    }
  }
}

// 同步修改数据mutations
export const mutations = {

  // state就是上面的state,这个参数是固定默认的
  // data使用调用该方法的时候传入参数
  setUserInfo(state, data) {
    state.userInfo = data
  },
  cleanUserInfo(state) {
    state.userInfo = {}
  }
}

// 异步修改数据 actions
export const actions = {
  // 登录
  login({
    commit
  }, data) {
    return this.$axios({
      url: '/accounts/login',
      method: 'POST',
      data
    }).then(res => {
      const {
        data
      } = res
      commit('setUserInfo', data);
      return data;
    })
  },
  register({
    commit
  }, data) {
    return this.$axios({
      url: '/accounts/register',
      method: 'POST',
      data
    }).then(res => {
      const {
        data
      } = res
      commit('setUserInfo', data);
      return data;
    })
  }
}
