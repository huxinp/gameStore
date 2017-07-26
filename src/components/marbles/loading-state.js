
const LoadingState = function () {};
LoadingState.prototype.init = function(){
	this.progress = this.add.image(this.world.centerX, this.world.centerY, 'progress');
	this.progress.anchor = {x: 0.5, y: 0.5};
	this.progressText = this.add.text(this.world.centerX, this.world.centerY + 30, '0%', {fill: '#fff', fontSize: '16px'});
	this.progressText.anchor = {x: 0.5, y: 0.5};
};
LoadingState.prototype.preload = function () {
	this.load.image('board', 'static/assets/marbles/images/board.png');
	this.load.image('ball', 'static/assets/marbles/images/ball.png');
	this.load.image('brick1', 'static/assets/marbles/images/brick1.png');
	this.load.image('logo', 'static/assets/marbles/images/logo.png');
	this.load.image('btnbg1', 'static/assets/marbles/images/btnbg1.png');
	let _this = this;
	this.load.onFileComplete.add(function (progress) {
		_this.progressText.text = progress + '%';
	});
};
LoadingState.prototype.create = function () {
	//资源加载完成后自动开始下一个场景state
	this.state.start('PrestartState');
};

export default LoadingState;
