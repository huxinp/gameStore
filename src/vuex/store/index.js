import pixi from 'phaser/build/custom/pixi';
import p2 from 'phaser/build/custom/p2';
import phaser from 'phaser/build/custom/phaser-split';

import Vue from 'vue';
import Vuex from 'vuex';

import getters from '../getters';
import actions from '../actions';
import mutations from '../mutations';

const game = function () {
	return new Phaser.Game(document.body.offsetWidth, document.body.offsetHeight, Phaser.AUTO, 'game');
};

Vue.use(Vuex);

const state = {
	gameover: false,
	paused: false,
	game: '',
	currentPass: 'PassOneState',
};

export default new Vuex.Store({
	state,
	actions,
	getters,
	mutations
});
