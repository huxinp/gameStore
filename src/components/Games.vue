
<style lang="scss">
	div, .model{
		width: 100%;
		height: 100%;
	}
	.model{
		position: absolute;
		left: 0;
		top: 0;
		background-color: rgba(125, 125, 125, 0.4);
	}
	.model.gameover {
		background-color: rgba(125, 125, 125, 0.4);
		a{
			position: absolute;
			left: 0;
			right: 0;
			margin: 0 auto;
			display: block;
			width: 145px;
			height: 35px;
			text-align: center;
			line-height: 35px;
			color: #fff;
			font-weight: bold;
			text-decoration: none;
			font-size: 16px;
			background: url("../assets/marbles/images/btnbg1.png") no-repeat;
			-webkit-background-size: 100% 100%;
			background-size: 100% 100%;
		}
		a.start{
			top: 64%;
		}
		a.back{
			top: 75%;
		}
	}
	.model.paused{
		text-align: center;
		background-color: rgba(125, 125, 125, 0.6);
		img{
			max-width: 80%;
			max-height: 80%;
			margin-top: 30px;
		}
		p{
			text-align: center;
			img{
				max-width: 50px;
			}
		}
		img.start{
			margin-right: 30px;
		}
		img.back{
			margin-left: 30px;
		}
	}
</style>
<template>
	<div>
		<div id="game"></div>
		<div class="model gameover" v-show="gameover">
			<a href="javascript:;" class="start" @click="reStart">再来一次</a>
			<a href="javascript:;" class="back" @click="goBack('gameover')">返回</a>
		</div>
		<div class="model paused" v-show="paused">
			<img src="../assets/common/images/stop.png" alt="">
			<p>
				<img class="start" @click="play" src="../assets/common/images/startbtn.png" alt="">
				<img class="back" @click="goBack('paused')" src="../assets/common/images/backbtn.png" alt="">
			</p>
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
	import {mapActions, mapGetters} from 'vuex';

	export default {
		data(){
			return {

			}
		},
		mounted(){
			this.init(this.$route.params.gameName);
		},
		created(){

		},
		methods: {
			...mapActions([
				'init',
				'reStart',
				'goBack',
				'play'
			])
		},
		computed: {
			...mapGetters([
				'gameover',
				'paused'
			])
		}
	}
</script>
