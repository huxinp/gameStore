

export default {
	defeated(state){
		state.gameover = true;
	},
	start(state, payload){
		state.game = payload;
	},
	hide(state){
		state.gameover = false;
	},
	pass(state, payload){
		state.currentPass = payload;
	},
	back(state, payload){
		state.currentPass = payload;
	},
	paused(state){
		state.paused = true;
	},
	play(state){
		state.paused = false;
	}
}
