import InitState from '../init-state';
import LoadingState from './loading-state';
import MainState from './main-state';
import PassOneState from './passOne';
import PassTwoState from './passTwo';

const marbles = game => {
	game.state.add('InitState', new InitState());
	game.state.add('LoadingState', new LoadingState());
	game.state.add('MainState', new MainState());
	game.state.add('PassOneState', new PassOneState());
	game.state.add('PassTwoState', new PassTwoState());
	game.state.start('InitState');
};
export default marbles;
