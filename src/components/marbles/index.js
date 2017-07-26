import InitState from '../init-state';
import LoadingState from './loading-state';
import PrestartState from './prestart-state';
import MainState from './main-state';

const marbles = game => {
	game.state.add('InitState', new InitState());
	game.state.add('LoadingState', new LoadingState());
	game.state.add('PrestartState', new PrestartState());
	game.state.add('MainState', new MainState());
	game.state.start('InitState');
};
export default marbles;
