import store from '../../vuex/store';
// import router from '../../router';
import phaser from 'phaser/build/custom/phaser-split';
const PassOneState = function () {};

PassOneState.prototype.create = function () {
	//开启 ARCADE 物理场景
	this.physics.startSystem(Phaser.Physics.ARCADE);

	this._passInit();
	this._start();
};

//初始化
PassOneState.prototype._passInit = function () {
	this.buffList = {
		fire: false,
		lang: false,
	};
	this._drawWall();
	this._drawHeader();
	this._drawBoard();
	this._drawBall();
};

//开始
PassOneState.prototype._start = function () {
	this.startText = this.add.text(this.world.centerX, this.world.centerY, '3', {fill: '#ccc', fontSize: '32px'});
	this.startText.anchor = {x: 0.5, y: 0.5};
	this.startTextNum = 3;
	function timers() {
		setTimeout(() => {
			if(this.startTextNum > 1){
				this.startTextNum--;
				this.startText.text = this.startTextNum;
				return timers();
			}else {
				this.startText.text = '开始!';
				setTimeout(function () {
					this.startText.kill();
					this._board();
					this._ball();
					this._generateBuff();
				}, 500);
			}
		}, 700);
	}
	timers();
};

PassOneState.prototype.update = function () {
	//球打到砖
	if(this.buffList.fire){
		//火球不反弹
		this.physics.arcade.overlap(this.ball, this.wall, (a, b) => {
			//得分计算
			this.score++;
			this.scoreText.text = '得分：' + this.score;

			//碰撞结果， 砖消失
			b.kill();
			if (this.score === 49) {//判断是否过关
				this._pass();
			}
		});
	}else {
		this.physics.arcade.collide(this.ball, this.wall, (a, b) => {
			//球速度增加
			a.collideNum++;
			let power = Math.pow(1.1, 1 / (a.collideNum + 1));
			a.body.velocity.x *= power;
			a.body.velocity.y *= power;
			a.currentSpeed = Math.sqrt(Math.pow(a.body.velocity.x, 2) + Math.pow(a.body.velocity.y, 2));//重新计算速度

			//得分计算
			this.score++;
			this.scoreText.text = '得分：' + this.score;

			//碰撞结果， 砖消失
			b.kill();
			if (this.score === 49) {//判断是否过关
				this._pass();
			}
		});
	}


	//球碰到挡板
	this.physics.arcade.collide(this.ball, this.board, (a, b) => {
		let b_len = b.positions.length;
		let offset = b.positions[b_len - 1] - b.positions[b_len - 2];//碰撞前一次存放的位置的偏移量
		if(Math.abs(offset) > 5){//偏移量超过5 就判断为  '削'这个动作  然后更改x轴的速度
			a.body.velocity.x += offset * 5;
			if(Math.abs(a.body.velocity.x) >= a.currentSpeed * .9){//判断x轴速度不能太大
				a.body.velocity.x = a.body.velocity.x > 0 ? a.currentSpeed * .9 : -a.currentSpeed * .9;
			}
			a.body.velocity.y = -Math.sqrt(Math.pow(a.currentSpeed, 2) - Math.pow(a.body.velocity.x, 2));//重新计算y轴的速度
			// if(a.body.velocity.y > 0){
			// 	a.body.velocity.y = -a.body.velocity.y;
			// }
		}
	});

	//球碰到顶部信息部分检测
	this.physics.arcade.collide(this.ball, this.scoreBoard);

	//没接到球
	if(this.ball.position.y > this.world.height - 30){
		this.ball.kill();
		this.ball.position.y = this.world.height - 30;
		this.life--;
		this.lifeText.text = 'life: ' + this.life;
		if(this.life > 0){
			this._drawBall();
			this._ball();
		}else{
			this._defeated();
		}
	}

	//球背景图片跟随球移动
	this.ballbg.position.x = this.ball.position.x + 10;
	this.ballbg.position.y = this.ball.position.y + 10;

	if(this.buffList.fire){
		this.fireball.position.x = this.ball.position.x + 10;
		this.fireball.position.y = this.ball.position.y + 10;
	}
};

//初始 绘制砖块
PassOneState.prototype._drawWall = function () {
	this.wall = this.add.group();
	this.wall.enableBody = true;
	this.brick_between = 40;
	this.brick_col_num = 7;
	this.brick_row_num = 7;
	this.wall_screen_between = (document.body.offsetWidth - this.brick_between * this.brick_col_num) / 2;
	for(let i = 0; i < this.brick_col_num; i++){
		for(let j = 0; j < this.brick_row_num; j++){
			let brick = this.wall.create(this.wall_screen_between + this.brick_between * i, 100 + 20 * j, 'brick1');
			brick.body.immovable = true;
			brick.scale.setTo(0.7);
		}
	}
};

//初始 绘制球
PassOneState.prototype._drawBall = function () {
	this.ball = this.add.graphics(this.board.position.x - 10, this.board.position.y - 30);
	this.ball.beginFill(0xFFFFFF, 0);
	this.ball.drawCircle(10, 10, 20);
	this.ball.endFill();

	this.ballbg = this.add.sprite(this.ball.position.x, this.ball.position.y, 'ball');
	this.ballbg.anchor.setTo(0.5);
	this.ballbg.scale.setTo(0.25);

	this.physics.enable(this.ball, Phaser.Physics.ARCADE);

	this.ball.body.collideWorldBounds = true;

	this.buff('fire');
};

//球的物理属性  运动的设置
PassOneState.prototype._ball = function () {
	this.ball.body.bounce.set(1);//设置反弹
	this.ball.currentSpeed = 200;//设置速度
	this.ball.collideNum = 0;//碰撞 计数器

	let speed_y = Math.random() * 50 + 150,//随机y轴速度
	    speed_x = Math.sqrt(Math.pow(this.ball.currentSpeed, 2) - Math.pow(speed_y, 2));//根据速度计算x轴速度
	if(speed_y % 2 >= 1){
		speed_x = - speed_x;
	}
	this.ball.body.velocity.y = -speed_y;
	this.ball.body.velocity.x = speed_x;
};

//初始 绘制挡板
PassOneState.prototype._drawBoard = function () {
	this.board = this.add.sprite(this.world.centerX, this.world.height - 120, 'board');
	this.board.anchor = {x: 0.5, y: 0.5};
	this.board.scale.setTo(1, 0.8);

	this.physics.enable(this.board, Phaser.Physics.ARCADE);
	this.board.body.collideWorldBounds = true;
	this.board.body.immovable = true;

	this.finger = this.add.sprite(this.world.centerX, this.world.height - 70, 'finger');
	this.finger.anchor.setTo(0.5);
	this.finger.scale.setTo(1.2);
};

//挡板的设置  可拖拽 等
PassOneState.prototype._board = function () {
	this.finger.inputEnabled = true;
	this.finger.input.enableDrag();
	this.board.positions = [];//存放10个拖拽位置
	this.finger.events.onDragUpdate.add(e => {
		this.board.position.x = this.finger.position.x;
		if(this.board.position.x <= this.board.width / 2){
			this.board.position.x = this.board.width / 2;
		}
		if(this.board.position.x + this.board.width / 2 >= this.world.width){
			this.board.position.x = this.world.width - this.board.width / 2;
		}
		this.board.positions.push(this.board.position.x);
		if(this.board.positions.length > 10){
			this.board.positions.shift();
		}
	});
	this.finger.events.onDragStop.add(e => {
		this.finger.position.y = this.world.height - 70;
	})
};

//头部 关卡信息 得分，生命 暂停 开始 退出 等
PassOneState.prototype._drawHeader = function () {
	this.header = this.add.group();

	this.scoreBoard = this.add.graphics(0, 0, this.header);
	this.scoreBoard.beginFill(0xFFFFFF, 0.2);
	this.scoreBoard.drawRect(0, 0, this.world.width, 60);
	this.scoreBoard.endFill();
	this.physics.enable(this.scoreBoard, Phaser.Physics.ARCADE);
	this.scoreBoard.body.immovable = true;

	//得分信息
	this.score = 0;
	this.scoreText = this.add.text(this.world.width - 10, 50, '得分：'+this.score, {fill: '#fff', fontSize: '14px'});
	this.scoreText.anchor = {x: 1, y: 0.5};

	//关卡信息
	this.passText = this.add.text(this.world.centerX, 50, 'pass one', {fill: '#fff', fontSize: '14px'});
	this.passText.anchor = {x: 0.5, y: 0.5};

	//生命信息
	this.life = 3;//设置有3条命
	this.lifeText = this.add.text(20, 50, 'life: ' + this.life, {fill: '#fff', fontSize: '14px'});
	this.lifeText.anchor = {x: 0, y: 0.5};

	//暂停
	this.pausebtn = this.add.image(0, 0, 'pausebtn');
	this.pausebtn.anchor = {x: 0, y: 0};
	this.pausebtn.scale.setTo(0.25);
	this.pausebtn.inputEnabled = true;
	this.pausebtn.events.onInputDown.add(() => {
		store.dispatch('paused');
		this.game.paused = true;
	});

	//停止 退出
	this.backbtn = this.add.image(60, 0, 'backbtn');
	this.backbtn.anchor = {x: 0, y: 0};
	this.backbtn.scale.setTo(0.25);
	this.backbtn.inputEnabled = true;
	this.backbtn.events.onInputDown.add(() => {
		this.state.start('MainState');
	});
};

//失败， gameover
PassOneState.prototype._defeated = function () {
	store.dispatch('defeated', 'PassOneState');
	this.game.paused = true;
};

//过关 pass
PassOneState.prototype._pass = function () {
	store.dispatch('pass', 'PassTwoState');
	this.state.start('PassTwoState');
};

//buff
PassOneState.prototype.buff = function (buff) {
	if(buff === 'fire'){//火球
		this.fireball = this.add.sprite(this.ball.position.x, this.ball.position.y, 'fireball');
		this.fireball.scale.setTo(0.15);
		this.fireball.anchor.setTo(0.5);
		this.buffList.fire = true;
	}else if(buff === 'lang'){//挡板加长buff
		this.board.scale.x = 1.5;
		setTimeout(() => {
			this.board.scale.x = 1;
		}, 10000);
	}else if(buff === 'short'){
		this.board.scale.x = 0.8;
		setTimeout(() => {
			this.board.scale.x = 1;
		}, 10000)
	}else if(buff === 'double'){//多一个弹球
		this._drawBall();
		this._ball();
	}else if(buff === 'thunder'){

	}else if(buff === 'lifetime'){

	}else if(buff === 'slow'){//减速

	}else if(buff === 'fast'){//加速

	}
};

//开启 获得 buff
PassOneState.prototype._getBuff = function () {
	//碰撞检测
};

//刷出buff掉落物
PassOneState.prototype._generateBuff = function (brick) {
	//打碎砖块后，有一定比例 随机出现
	let rand = Math.random() * 100;
	if(rand / 10 >= 2 && rand / 10 < 4){//20%
		if(parseInt(rand) % 10 === 0){//10%  => 2%
			//fire

		}else if(parseInt(rand) % 8 === 0){//12.5% => 2.5%
			//lang

		}else if(parseInt(rand) % 8 === 0){
			//short

		}else if(parseInt(rand) % 8 === 0){
			//double

		}else if(parseInt(rand) % 8 === 0){
			//slow

		}else if(parseInt(rand) % 8 === 0){
			//fast

		}
	}
};

export default PassOneState;
