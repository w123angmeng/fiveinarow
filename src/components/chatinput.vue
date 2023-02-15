<template>
	<view class="footer">
		<!-- <view class="footer-left">
			<view class="uni-icon uni-icon-mic" @tap="startRecognize"></view>
		</view> -->
		<view class="footer-center">
			<input :cursor-spacing="300" class="input-text" type="text" v-model="inputValue"></input>
			<!-- <textarea
			class="input-text"
			          v-model="inputValue"
			          :maxlength="-1"
			          :auto-height="true"
			          :show-confirm-bar="false"
			          :cursor-spacing="10"
			          :fixed="true"
			          :adjust-position="false"
			        /> -->
		</view>
		<view class="footer-right" @tap="sendMessge">
			<view id='msg-type' >发送</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "chat-input",
		data() {
			return {
				inputValue: ''
			}
		},
		methods: {
			startRecognize: function () {
				var options = {};
				var that = this;
				options.engine = 'iFly';
				that.inputValue = "";
				plus.speech.startRecognize(options, function (s) {
					console.log(s);
					that.inputValue += s;
				}, function (e) {
					console.log("语音识别失败：" + e.message);
				});
			},
			sendMessge: function () {
				var that = this;
				if (that.inputValue.trim() == '') {

					that.inputValue = '';
				} else {

					//点击发送按钮时，通知父组件用户输入的内容
					this.$emit('send-message', {
						type: 'text',
						content: that.inputValue
					});
					that.inputValue = '';
				}
			}
		}
	}
</script>

<style>
	@import "@/components/common/icon.css";

	.footer {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 80px;
		min-height: 80px;
		border-top: solid 1px #dbdbdb;
		overflow: hidden;
		padding: 5px;
		background-color: #fafafa;
	}
	.footer-left {

		width: 80px;
		height: 80px;

		display: flex;
		justify-content: center;
		align-items: center;
	}
	.footer-right {
		width: 120px;
		height: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #1482D1;
	}
	.footer-center {
		flex: 1;
		height: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.footer-center .input-text {
		flex: 1;
		background: #fff;
		border: solid 1px #ddd;
		padding: 10px !important;
		font-family: verdana !important;
		overflow: hidden;
		border-radius: 15px;
	}
</style>
