
const MainState = function () {};
MainState.prototype.create = function () {
	//开启 ARCADE 物理场景
	this.physics.startSystem(Phaser.Physics.ARCADE);

	this._drawWall();
	this._drawBall();
	this._drawBoard();
};
MainState.prototype._drawWall = function () {
	this.wall = this.add.group();
	this.wall.enableBody = true;

	for(let i = 1; i < 8; i++){
		for(let j = 1; j < 8; j++){
			let brick = this.wall.create(40 * i, 20 * j, 'brick1');
			brick.body.immovable = true;
			brick.scale.setTo(0.7);
			brick.anchor.setTo(0.5);
		}
	}
};
MainState.prototype._drawBall = function () {
	this.ball = this.add.graphics(this.world.centerX - 10, this.world.height - 70);
	this.ball.beginFill(0xFFFFFF, 0);
	this.ball.drawCircle(10, 10, 20);
	this.ball.endFill();

	this.ballbg = this.add.sprite(this.ball.position.x, this.ball.position.y, 'ball');
	this.ballbg.anchor.setTo(0.5);
	this.ballbg.scale.setTo(0.25);

	this.physics.enable(this.ball, Phaser.Physics.ARCADE);

	this.ball.body.collideWorldBounds = true;
	this.ball.body.bounce.set(1);
	this.ball.body.velocity.x = 150;
	this.ball.body.velocity.y = -150;

};
MainState.prototype._drawBoard = function () {
	this.board = this.add.sprite(this.world.centerX, this.world.height - 40, 'board');
	this.board.anchor = {x: 0.5, y: 0.5};
	this.board.scale.setTo(1, 0.8);

	this.physics.enable(this.board, Phaser.Physics.ARCADE);
	this.board.body.collideWorldBounds = true;
	this.board.body.immovable = true;

	this.board.inputEnabled = true;
	this.board.input.enableDrag();
	let _this = this;
	this.board.events.onDragUpdate.add(function (e) {
		_this.board.position.y = _this.world.height - 40;
	});
};
MainState.prototype.update = function () {
	let i = 0;
	this.physics.arcade.collide(this.ball, this.wall, function (a, b) {
		b.kill();
	});
	this.physics.arcade.collide(this.ball, this.board, function (a, b) {
		a.body.velocity.x *= 1.01;
		i++;
		if(!(i % 2)){
			a.body.velocity.x *= 1.1;
			a.body.velocity.y *= 1.1;
		}
	});
	if(this.ball.position.y > this.world.height - 30){
		this.ball.kill();
	}
	this.ballbg.position.x = this.ball.position.x + 10;
	this.ballbg.position.y = this.ball.position.y + 10;
};

export default MainState;
