export default module = {
	namespaced: true,
    state: {
		userInfo: {} // 当前登录用户
    },
    mutations: {
        setUserInfo(state, data) {
            state.userInfo =  data
        }
    },
    actions: {
        // actions一般是处理异步逻辑
        // someAction(context, componentData) {
        //     context.commit('increment', componentData);
        // }
    }
}