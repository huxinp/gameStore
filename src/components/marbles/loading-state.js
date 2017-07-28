
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
	this.load.image('startbtn', 'static/assets/common/images/startbtn.png');
	this.load.image('pausebtn', 'static/assets/common/images/pausebtn.png');
	this.load.image('backbtn', 'static/assets/common/images/backbtn.png');
	this.load.image('fireball', 'static/assets/marbles/images/fireball_1.png');
	this.load.image('finger', 'static/assets/common/images/finger.png');
	this.load.image('buff_fire', 'static/assets/marbles/images/buff_fire.png');
	this.load.image('buff_lang', 'static/assets/marbles/images/buff_lang.png');
	this.load.image('buff_short', 'static/assets/marbles/images/buff_short.png');
	this.load.image('buff_slow', 'static/assets/marbles/images/buff_slow.png');
	this.load.image('buff_fast', 'static/assets/marbles/images/buff_fast.png');

	this.load.onFileComplete.add(progress => {
		this.progressText.text = progress + '%';
	});
};
LoadingState.prototype.create = function () {
	//资源加载完成后自动开始下一个场景state
	this.state.start('MainState');
};

export default LoadingState;
