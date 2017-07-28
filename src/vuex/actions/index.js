import pixi from 'phaser/build/custom/pixi';
import p2 from 'phaser/build/custom/p2';
import phaser from 'phaser/build/custom/phaser-split';

import axios from 'axios';
import router from '../../router';

import marbles from '../../components/marbles';
import snake from '../../components/snake';

export default {
	//开始渲染游戏
	init({commit, state}, payload){
		let _g = new Phaser.Game(document.body.offsetWidth, document.body.offsetHeight, Phaser.AUTO, 'game');
		commit('start', _g);
		if(payload === 'marbles'){
			marbles(_g);
		}else if(payload === 'snake'){
			snake(_g);
		}
	},
	//再来一次
	reStart({commit, state}){
		state.game.paused = false;
		state.game.state.start('PassOneState');
		commit('back', 'PassOneState');
		commit('hide');
	},
	//返回  （到游戏开始state)
	goBack({commit, state}, payload){
		state.game.paused = false;
		state.game.state.start('MainState');
		commit('back', 'MainState');
		if(payload === 'gameover'){
			commit('hide');
		}else if(payload === 'paused'){
			commit('play');
		}
		console.log(payload);
	},
	//gameover
	defeated({commit}){
		commit('defeated');
	},
	//过关
	pass({commit, state}, payload){
		commit('pass', payload);
	},
	//暂停
	paused({commit}){
		commit('paused');
	},
	//开始  （相对于暂停）
	play({commit, state}){
		state.game.paused = false;
		commit('play');
	}
}
