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
	let _this = this;
	function timers() {
		setTimeout(() => {
			if(_this.startTextNum > 1){
				_this.startTextNum--;
				_this.startText.text = _this.startTextNum;
				return timers();
			}else {
				_this.startText.text = '开始!';
				setTimeout(function () {
					_this.startText.kill();
					_this._board();
					_this._ball();
					_this.buffGroup = _this.add.group();

					_this.buffGroup.enableBody = true;
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
			}else{
				this._generateBuff(b);
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

	//获取buff
	this.physics.arcade.overlap(this.board, this.buffGroup, (a, b) => {
		console.log(b.key, b.position.x, b.position.y);
		console.log(a.key, a.position.x, a.position.y);
		console.log('getBuff', b.key);
		b.kill();
	});
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
			let brick = this.wall.create(this.wall_screen_between + 20 + this.brick_between * i, 100 + 20 * j, 'brick1');
			brick.body.immovable = true;
			brick.scale.setTo(0.7);
			brick.anchor.setTo(0.5);
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

	// this.buff('fire');
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
	// if(rand / 10 >= 2 && rand / 10 < 4){//20%
	if(true){
		if(parseInt(rand) % 10 === 0){//10%  => 2%
			console.log('generateBuff', 'buff_fire');
			//fire
			this.buff_fire = this.buffGroup.create(brick.position.x, brick.position.y, 'buff_fire');
			this.buff_fire.body.gravity.y = 170;
			this.buff_fire.body.gravity.x = 0;
			this.buff_fire.scale.setTo(0.15);
			this.buff_fire.anchor.setTo(0.5);
		}else if(parseInt(rand) % 8 === 0){//12.5% => 2.5%
			console.log('generateBuff', 'buff_lang');
			//lang
			this.buff_lang = this.buffGroup.create(brick.position.x, brick.position.y, 'buff_lang');
			this.buff_lang.body.gravity.y = 170;
			this.buff_lang.body.gravity.x = 0;
			this.buff_lang.scale.setTo(0.13);
			this.buff_lang.anchor.setTo(0.5);
		}else if(parseInt(rand) % 8 === 1){
			console.log('generateBuff', 'buff_short');
			//short
			this.buff_short = this.buffGroup.create(brick.position.x, brick.position.y, 'buff_short');
			this.buff_short.body.gravity.y = 170;
			this.buff_short.body.gravity.x = 0;
			this.buff_short.scale.setTo(0.15);
			this.buff_short.anchor.setTo(0.5);
		}else if(parseInt(rand) % 8 === 2){
			//double

		}else if(parseInt(rand) % 8 === 3){
			console.log('generateBuff', 'buff_slow');
		// 	slow
			this.buff_slow = this.buffGroup.create(brick.position.x, brick.position.y, 'buff_slow');
			this.buff_slow.body.gravity.y = 170;
			this.buff_slow.body.gravity.x = 0;
			this.buff_slow.scale.setTo(0.3);
			this.buff_slow.anchor.setTo(0.5);
		}else if(parseInt(rand) % 8 === 4){
				// }else if(parseInt(rand) % 8){
			//fast
			console.log('generateBuff', 'buff_fast');
			this.buff_fast = this.buffGroup.create(brick.position.x, brick.position.y, 'buff_fast');
			this.buff_fast.body.gravity.y = 170;
			this.buff_fast.body.gravity.x = 0;
			this.buff_fast.scale.setTo(0.07);
			this.buff_fast.body.angularVelocity = 720;
			this.buff_fast.anchor.setTo(0.5);
		}
	}
};

export default PassOneState;
