import Vue from "vue";
import Vuex from "vuex";

// 依赖
// import state from "./state";
// import * as getters from "./getters";
// import mutations from "./mutations";
// import * as actions from "./actions";
// 模块化依赖
import { modules } from './modules.js'

// 注册vuex
Vue.use(Vuex);
const store = new Vuex.Store(modules);
export default store;