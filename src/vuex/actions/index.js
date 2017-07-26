import pixi from 'phaser/build/custom/pixi';
import p2 from 'phaser/build/custom/p2';
import phaser from 'phaser/build/custom/phaser-split';

import axios from 'axios';
import router from '../../router';

import marbles from '../../components/marbles';
import snake from '../../components/snake';
export default {
	start({commit}, payload){
		let _g = new Phaser.Game(document.body.offsetWidth, document.body.offsetHeight, Phaser.AUTO, 'game');
		if(payload === 'marbles'){
			marbles(_g);
		}else if(payload === 'snake'){
			snake(_g);
		}
	}
}
