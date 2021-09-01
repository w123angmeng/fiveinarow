<template>
	<view class="content">
		<view class="part1" v-if="status == 0">
			<image class="logo" :src="userInfo.avatarUrl || '/static/logo.png'"></image>
			<view>
				<text class="title">{{ userInfo.nickName }}</text>
			</view>
			<button v-if="!userInfo.nickName" @click="btnClickAuth">点我授权</button>
			<button @click="btnClickLogin">登录</button>
			<button @click="btnClickShare">邀请好友</button>
		</view>
		<view class="part2" v-else-if="[1, 2].includes(status)">
			<image class="logo" :src="userInfo.avatarUrl || '/static/logo.png'"></image>
			等待连接
			<image class="logo" :src="playmate.avatarUrl || '/static/logo.png'"></image>
			<button v-if="status == 2" @click="btnClickStart">开始游戏</button>
		</view>
		<view class="part3" v-else-if="status == 3">
			<view class="part3Header">
				<image class="pkLogo" :src="userInfo.avatarUrl || 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'"></image>
				<text>&nbsp; pk &nbsp;</text>
				<image class="pkLogo" :src="playmate.avatarUrl || '/static/logo.png'"></image>
			</view>
			<view class="resCont" v-if="resMes">
				<text>{{resMes}}</text>
			</view>
			
			<Chessboard @resMes="getResMes" @moveChess="moveChess" ref="chessboard"></Chessboard>
		</view>
		<view><canvas style="width: 300px; height: 200px;" canvas-id="firstCanvas" id="firstCanvas"></canvas></view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Chessboard from '@/components/chessboard/chessboard.vue';
export default {
	components: {
		Chessboard
	},
	data() {
		return {
			title: 'Hello',
			id: '',
			resMes: ''
		};
	},
	computed: {
		...mapState({
			status: state => state.chess.status,
			userInfo: state => state.login.userInfo,
			playmate: state => state.chess.playmate
		})
	},
	onLoad(e) {
		console.log('onload page index');
		if (e.id) {
			this.id = e.id;
			let uInfo = {
				nickName: '微信用户',
				avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
				gender: 1,
				uid: 'B'
			};
			this.setUserInfo(uInfo);
			this.setGameStatus(3);
			this.initGame(true);
		}
	},
	onReady() {
		// console.log('ref:',this.$refs.chessboard.drawChess(x, y, true))
		// var context = uni.createCanvasContext('firstCanvas',this);
		// console.log('context:', context);
		// context.setStrokeStyle('#00ff00');
		// context.setLineWidth(1);
		// context.rect(0, 0, 200, 200);
		// context.stroke();
		// context.setStrokeStyle('#ff0000');
		// context.setLineWidth(2);
		// context.moveTo(160, 100);
		// context.arc(100, 100, 60, 0, 2 * Math.PI, true);
		// context.moveTo(140, 100);
		// context.arc(100, 100, 40, 0, Math.PI, false);
		// context.moveTo(85, 80);
		// context.arc(80, 80, 5, 0, 2 * Math.PI, true);
		// context.moveTo(125, 80);
		// context.arc(120, 80, 5, 0, 2 * Math.PI, true);
		// context.stroke();
		// context.draw();
	},
	methods: {
		getResMes(data) {
			this.resMes = data
		},
		canvasIdErrorCallback: function(e) {
			console.error(e.detail.errMsg);
		},
		...mapMutations({
			setGameStatus: 'chess/setGameStatus',
			setUserInfo: 'login/setUserInfo',
			setPlaymate: 'chess/setPlaymate'
		}),
		btnClickStart() {
			this.setGameStatus(3);
		},
		moveChess(data) {
			let that = this
			uni.sendSocketMessage({
				data: JSON.stringify({
					type: !that.id ? 'game1' : 'game2',
					message: data
				}),
				success: function() {
					
				}
			});
		},
		initGame() {
			console.log("初始化");
			let that = this;
			var socketTask = uni.connectSocket({
				url: 'ws://127.0.0.1:8081',
				// data: JSON.stringify({
				// 	text: 'game2'
				// }),
				header: {
					'content-type': 'application/json;charset=utf8'
				},
				// protocols: ['chat'],
				method: 'GET',
				success: () => {
					console.log('客户端：连接成功');
					uni.onSocketOpen(function(res) {
						console.log('WebSocket连接已打开！');
						uni.sendSocketMessage({
							data: JSON.stringify({
								type: !that.id ? 'game1' : 'game2',
								user: that.userInfo
							}),
							success: function() {
								uni.onSocketMessage(function(res) {
									let data = JSON.parse(res.data);
									console.log(data, '收到服务器内容：' + data.data);
									if ((data.type == 'user')) {
										that.setPlaymate(data.data);
										!that.id ? that.setGameStatus(2) : null;
									} else if(data.type == 'message') {
										console.log("根据消息绘制")
										this.$refs.chessboard.drawChess(1, 1, true)
									}
								});
							}
						});
					});
				}
			});
			console.log('socketTask：', socketTask);

			uni.onSocketError(function(res) {
				console.log('WebSocket连接打开失败，请检查！');
			});
			// uni.onSocketClose(function (res) {
			//   console.log('WebSocket 已关闭！');
			// });
		},
		btnClickShare() {
			uni.share({
				provider: 'weixin',
				imageUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
				scene: 'WXSceneSession',
				type: 5,
				title: '来挑战我吧',
				miniProgram: {
					id: 'wx37cca9830b648391',
					path: 'pages/index/index?id=1',
					type: 2
				},
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
		},
		btnClickLogin() {
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					console.log(loginRes, loginRes.authResult);
					// 获取用户信息
					uni.getUserInfo({
						provider: 'weixin',
						success: function(infoRes) {
							console.log(infoRes, '用户昵称为：' + infoRes.userInfo.nickName);
						}
					});
				}
			});
		},
		btnClickAuth() {
			console.log('点击授权');
			let that = this;
			uni.getUserProfile({
				desc: 'dev test',
				lang: 'en',
				success: res => {
					console.log('用户信息：', res.userInfo);
					let resInfo = res.userInfo;
					// this.userInfo = {
					// 	avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJYfpsL820Sk5ddu5BPQ9SRuxSrGszoQuPtsBJNRiaf7Tic9NgA3fu03W8icEiczhNpdHUeJ96bLcKNAQ/132"
					// 	city: "Zhangye"
					// 	country: "China"
					// 	gender: 2
					// 	language: "zh_CN"
					// 	nickName: "王梦"
					// 	province: "Gansu"
					// }
					let uInfo = {
						nickName: resInfo.nickName,
						avatarUrl: resInfo.avatarUrl,
						gender: resInfo.gender,
						uid: 'A'
					};
					this.setUserInfo(uInfo);
					// 等待状态
					this.setGameStatus(1);
					this.initGame();
				},
				fail: err => {
					console.log('获取信息失败：', err);
				}
			});
		}
	}
};
</script>

<style lang="scss">
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #faebd7;
	font-size: 14px;
	.part3 {
		.part3Header {
			display: flex;
			padding: 6px 0;
			.pkLogo {
				width: 26px;
				height: 26px;
				border-radius: 50%;
			}
			text{
				padding: 0 10px;
			}
		}
	}
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin: 200rpx auto 50rpx auto;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
