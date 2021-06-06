import { createStore, createLogger } from 'vuex'
import state from './state'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  getters,
  actions,
  mutations,
  // 严格模式 严格要求修改state的数据符合vuex流程
  strict: debug
  // plugins: debug ? [createLogger()] : []
})
