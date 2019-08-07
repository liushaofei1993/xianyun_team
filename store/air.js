export const state = () => {
  return {
    infoData: {
      seat_infos: {}
    },
    allPrice: {}
  }
}

export const mutations = {
  // 设置机票信息
  setInfoData(state, data) {
    state.infoData = data
  },
  //   设置机票信息
  setAllPrice(state, data) {
    state.allPrice = data
  }
}
