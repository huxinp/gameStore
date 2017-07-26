import router from '../../router';
const PrestartState = function () {};
PrestartState.prototype.create = function () {
	this._drawLogo();
	this._drawStartBtn();
	this._drawBackBtn();
	// this.state.start('MainState');
};
PrestartState.prototype._drawLogo = function () {
	this.logo = this.add.image(this.world.centerX, this.world.centerY / 3 * 2, 'logo');
	this.logo.anchor = {x: 0.5, y: 0.5};
	this.logo.scale.setTo(2);
};
PrestartState.prototype._drawStartBtn = function(){
	this.btnbg1 = this.add.image(this.world.centerX, this.world.centerY / 3 * 4, 'btnbg1');
	this.btnbg1.anchor = {x: 0.5, y: 0.5};
	this.btnbg1.scale.setTo(0.8, 0.6);
	this.btntxt1 = this.add.text(this.world.centerX, this.world.centerY / 3 * 4 + 3, '开始游戏', {fill: '#fff', fontSize: '16px'});
	this.btntxt1.anchor = {x: 0.5, y: 0.5};

	this.btnbg1.inputEnabled = true;//开启输入事件
	let _this = this;
	this.btnbg1.events.onInputDown.add(function () {
		_this.state.start('MainState');
	})
};
PrestartState.prototype._drawBackBtn = function(){
	this.btnbg2 = this.add.image(this.world.centerX, this.world.centerY / 2 * 3 + 20, 'btnbg1');
	this.btnbg2.anchor = {x: 0.5, y: 0.5};
	this.btnbg2.scale.setTo(0.8, 0.6);
	this.btntxt2 = this.add.text(this.world.centerX, this.world.centerY / 2 * 3 + 23, '返回', {fill: '#fff', fontSize: '16px'});
	this.btntxt2.anchor = {x: 0.5, y: 0.5};

	this.btnbg2.inputEnabled = true;//开启输入事件
	this.btnbg2.events.onInputDown.add(function () {
		router.go(-1);
	})
};

export default PrestartState;
