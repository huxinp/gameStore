
const InitState = function () {};
InitState.prototype.preload = function () {
	this.load.image('progress', 'static/assets/marbles/images/progress.png');
};
InitState.prototype.create = function () {
	this.state.start('LoadingState');
};

export default InitState;
