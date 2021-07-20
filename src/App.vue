<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			// uni.getUserProfile({
			// 	desc: 'dev test',
			// 	lang: 'en',
			// 	success: (res)=> {
			// 		console.log("用户信息：", res.userInfo)
			// 	},
			// 	fail: ()=> {}
			// })
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
