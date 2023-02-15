<script>
	import chatInput from '@/components/chatinput.vue';
	// import messageShow from '@/components/messageshow.vue';

	export default {
		data() {
			return {
				style: {
					pageHeight: 0,
					contentViewHeight: 0,
					footViewHeight: 90,
					mitemHeight: 0,
				},
				scrollTop: 0,
				messages: [{
					user: 'home',
					type: 'head', //input,content 
					content: '你好!'
				}]
			}
		},
		components: {
			chatInput,
			// messageShow
		},
		created: function () { 
			const res = uni.getSystemInfoSync();
			this.style.pageHeight = res.windowHeight;
			this.style.contentViewHeight = res.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * (100); //像素
		},
		methods: {
			getInputMessage: function (message) { //获取子组件的输入数据
				// console.log(message);
				this.addMessage('customer', message.content, false);
				this.toRobot(message.content);
			},
			addMessage: function (user, content, hasSub, subcontent) {
				var that = this;
				that.messages.push({
					user: user,
					content: content,
					hasSub: hasSub,
					subcontent: subcontent
				});
			},
			scrollToBottom: function () {
				var that = this;
				var query = uni.createSelectorQuery();
				query.selectAll('.m-item').boundingClientRect();
				query.select('#scrollview').boundingClientRect();

				query.exec(function (res) {
					that.style.mitemHeight = 0;
					res[0].forEach(function (rect) {
						console.info("ccc:", rect.height, that.style.mitemHeight);
						that.style.mitemHeight = that.style.mitemHeight + rect.height + 20;
					});
					if (that.style.mitemHeight > that.style.contentViewHeight) {
						that.scrollTop = that.style.mitemHeight - that.style.contentViewHeight;
					}
				});
			},
			toRobot: function (info) {
				// var apiUrl = 'http://localhost:3000/api/chat';
				var apiUrl = 'http://3.38.180.76:3000/api/chat';
				uni.request({
					url: apiUrl,
					method: "post",
					data: {
						"msg": info
					},
					header: {
						// "content-type": "application/json"
						'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
					},
					success: (res) => {
						this.addMessage('home', res.data.result, false);
						this.scrollToBottom();
						console.log('request success:' + res.data.result);
					},
					fail: (err) => {
						console.log('request fail', err);
						uni.showModal({
							content: "我要出去玩了，抱歉" || err.errMsg,
							showCancel: false
						})
					}
				});
			}
		}
	}
</script>
<template>
	<view class="uni-column">
		<view class="content" id="content" :style="{height:style.contentViewHeight+'px'}" ref="msgwrap">
			<scroll-view id="scrollview" scroll-y="true" :style="{height:style.contentViewHeight+'px'}" :scroll-with-animation="true"
			    :scroll-top="scrollTop">
				<!-- <message-show v-for="(message,index) in messages" :key="index" v-bind:message="message" :id="index"></message-show>
				<view id="bottom"></view> -->
				
				<view class="m-item" v-for="(message,index) in messages" :key="index" :id="'message'+index">
					<view class="m-left">
						<image class="head_icon" src="../../static/homeHL1.png" v-if="message.user=='home'"></image>
					</view>
					<view class="m-content">
						<view class="m-content-head" :class="{'m-content-head-right':message.user=='customer'}">
							<view :class="'m-content-head-'+message.user">{{message.content}} </view>
						</view>
					</view>
					<view class="m-right">
						<image class="head_icon" src="../../static/customerHL.png" v-if="message.user=='customer'"></image>
					</view>
				</view>
				<view id="bottom"></view>
			</scroll-view>
		</view>
		<view class="foot">
			<chat-input @send-message="getInputMessage" ></chat-input>
		</view>
	</view>
</template>

<style>
	#bottom{
		width:100%;
		height: 80px;
	}
	.uni-column {
		display: flex;
		flex-direction: column;
	}
	.content {

		display: flex;
		flex: 1;
		margin-bottom: 100px;
		 
	}
	.foot {
		position: fixed;
		width: 100%;
		height: 90px;
		min-height: 90px;
		left: 0px;
		bottom: 0px;
		overflow: hidden;
	}
	.m-item {
		display: flex;
		flex-direction: row;
		padding-top: 20px;
	}
	.m-left {
		display: flex;
		width: 60px;
		justify-content: center;
		align-items: center;
	}
	.m-content {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		word-break: break-all;
	}
	.m-right {
		display: flex;
		width: 60px;
		justify-content: center;
		align-items: center;
	}
	.head_icon {
		width: 40px;
		height: 40px;
	}
	.m-content-head {
		position: relative;
	}
	.m-content-head-right {
		display: flex;
		justify-content: flex-end;
	}
	.m-content-head-home {
		text-align: left;
		background: #1482d1;
		border: 1px #1482d1 solid;
		border-radius: 20px;
		padding: 20px;
		color: white;
	}
	.m-content-head-home:before {
		border: 15px solid transparent;
		border-right: 15px solid #1482d1;
		left: -26px;
		width: 0;
		height: 0;
		position: absolute;
		content: ' '
	}
	.m-content-head-customer {
		border: 1px white solid;
		background: white;
		border-radius: 20px;
		padding: 20px;
	}
	.m-content-head-customer:after {
		border: 15px solid transparent;
		border-left: 15px solid white;
		top: 20px;
		right: -26px;
		width: 0;
		height: 0;
		position: absolute;
		content: ' '
	}
</style>
