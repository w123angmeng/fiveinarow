<template>
	<view>
		<canvas style="width: 300px; height: 300px;" canvas-id="chessboard1" id="chessboard1" @touchend="touchend" @error="canvasIdErrorCallback"></canvas>
	</view>
</template>

<script>
	export default {
		name:"chessboard",
		data() {
			return {
				ctx: null,
				tArr: [],
				hArr: [],
				num: 1,
				chessArr: []
			};
		},
		created() {
			console.log("onReady")
			this.ctx = uni.createCanvasContext('chessboard1', this)
			console.log("this.ctx1:",this.ctx)
			this.initData(10)
			this.drawChessboard()
			// this.testReturn()
		},
		methods: {
			// testReturn() {
			// 	for(let i=0;i<3;i++) {
			// 		if(i<1) {
			// 			console.log("i",i)
			// 			this.check()
			// 			// return
			// 		}
			// 		console.log("外部",i)
			// 	}
			// 	console.log('函数')
			// },
			// check() {
			// 	return ()=> {
			// 		return;
			// 	};
			// },
			// 初始化棋盘
			initData(num) {
				let itemW = 300 / num
				for(let i = 0; i <= 10; i++) {
					this.tArr.push([[0, itemW * i],[300, itemW * i]])
					this.tArr.push([[itemW * i, 0],[itemW * i, 300]])
					
					this.chessArr[i] = new Array()
					for(let j = 0; j<= 10; j++) {
						// this.chessArr[i][j] = {x: 0, y: 0, chess: 0}
						this.chessArr[i][j] = 0 // 0未落子 1白子 2黑子
					}
					
				}
				console.log('this.chessArr:',this.chessArr)
			},
			drawChessboard() {
				this.ctx.setStrokeStyle("#ff0000")
		        this.ctx.setLineWidth(1)
				this.ctx.lineCap = 'round';
				this.ctx.lineJoin = 'round';
		        // this.ctx.rect(0, 0, 300, 300)
				this.ctx.stroke()
				this.tArr.forEach((item, key) => {
					this.ctx.moveTo(item[0][0], item[0][1])
					this.ctx.lineTo(item[1][0], item[1][1])
				})
		        this.ctx.stroke()
		        this.ctx.draw()
			},
			isWinGame(x,y,who) {
				// this.chessArr = []
				let indX = x / 30,
					indY = y / 30,
					resNum = 0
				// this.chessArr[indX][indeY]
				console.log('x,y:',indX,indY,who)
				let minX = indX - 4 >= 0 ? indX - 4 : 0,
					maxX = indX + 4 <= this.chessArr[0].length -1 ? indX + 4 : this.chessArr[0].length -1,
					minY = indY - 4 >= 0 ? indY - 4 : 0,
					maxY = indY + 4 <= this.chessArr.length - 1 ? indY + 4 : this.chessArr.length - 1
				console.log(`minX:${minX} maxX:${maxX} minY:${minY} maxY:${maxY}`)
				// k = x
				for(let i = minX; i<=maxX; i++) {
					console.log('k = x')
					if(this.chessArr[indY][i] == who) {
						resNum++
						// this.checkResNum(resNum)?return true:null;
						if(this.checkResNum(resNum)) return true
					} else {
						resNum = 0
						continue;
					}
				}
				// y = k
				for(let i = minY; i<= maxY; i++) {
					console.log('y = k')
					if(this.chessArr[i][indX] == who) {
						resNum++
						if(this.checkResNum(resNum)) return true
					} else {
						resNum = 0
						continue;
					}
				}
				// y = x + b 
				for(let i = minX; i <= maxX && i+indY-indX >= minY && i+indY-indX <= maxY; i++) {
					console.log('y = x + b')
					if(this.chessArr[i+indY-indX][i] == who) {
						resNum++
						if(this.checkResNum(resNum)) return true
					} else {
						resNum = 0
						continue;
					}
				}
				// y = -x + b
				for(let i = minX; i <= maxX && indY+indX-i >= minY && indY+indX-i <= maxY; i++) {
					console.log('y = -x + b')
					if(this.chessArr[indY+indX-i][i] == who) {
						resNum++
						if(this.checkResNum(resNum)) return true
					} else {
						resNum = 0
						continue;
					}
				}
				console.log('who:',who,"resNum:",resNum,this.chessArr)
				return false
			},
			checkResNum(num) {
				if(num == 5) {
					return true;
				}
				return false
			},
			drawChess(x, y, white = false) {
				console.log("drawChess",x,y)
				// this.ctx.stroke()
				// this.ctx.moveTo(x, y)
				this.ctx.arc(x, y, 14, 0, 2*Math.PI, false)
				// const grd = this.ctx.createCircularGradient(100, 100, 50)
				// grd.addColorStop(0, 'red')
				// grd.addColorStop(1, 'white')
				
				// // Fill with gradient
				// this.ctx.setFillStyle(grd)
				let chessClor = white ? '#FFFFFF' : '#333333'
				this.ctx.setFillStyle(chessClor)
				this.ctx.setStrokeStyle(chessClor)
				this.ctx.fill()
				this.ctx.stroke()
				this.ctx.draw(true)
			},
			touchend(e) {
				let dot = e.changedTouches[0],
					x = dot.x,
					y = dot.y
				x = Math.round(x / 30) * 30
				y = Math.round(y / 30) * 30
				// console.log("touchend",e,x,y)
				// 更新视图
				this.drawChess(x, y, this.num % 2 == 0 ? true : false)
				// 更新数据
				let indX = x / 30,
					indY = y / 30
				this.chessArr[indY][indX] = this.num % 2 == 0 ? 1 : 2
				
				// 判断输赢
				if(this.isWinGame(x, y, this.num % 2 == 0 ? 1 : 2)) {
					console.log("this.isWinGame():true")
					let chessColor = this.num % 2 == 0? '白棋': '黑棋'
					this.$emit('resMes',`${chessColor}胜利`)
				}
				this.num++
			},
			canvasIdErrorCallback(e) {
				console.log("canvas 报错")
				console.log("canvas error", e.detail.errMsg)
			}
		}
	}
</script>

<style lang="scss">

</style>
