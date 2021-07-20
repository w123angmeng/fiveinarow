export default module = {
	namespaced: true,
    state: {
		status: 3, // 状态 0 未开始、1 邀请中
		curGameId: '', //
		playmate: {}, // 伙伴
    },
    mutations: {
        setGameStatus(state, data) {
            state.status =  data
        },
		setGameId(state, data) {
		    state.curGameId =  data
		},
		setPlaymate(state, data) {
		    state.playmate =  data
		}
    },
    actions: {
        // actions一般是处理异步逻辑
        // someAction(context, componentData) {
        //     context.commit('increment', componentData);
        // }
    }
}