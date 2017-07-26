import pixi from 'phaser/build/custom/pixi';
import p2 from 'phaser/build/custom/p2';
import phaser from 'phaser/build/custom/phaser-split';

const game = () => {
	return new Phaser.Game(document.body.offsetWidth, document.body.offsetHeight, Phaser.AUTO, 'game');
};

export default game;
