import 'react-hot-loader/patch';
import React from 'react';
import ReactDOM from 'react-dom';

// implement hot-loader for browser
import { AppController } from 'react-hot-loader';

// use <AppContainer> as package for <Root>, so hot-loader will includes <Root>
import Root from './root';

const render = Component => {
	ReactDOM.render(
		<AppContainer>
			<Component />
		</AppContainer>,
		document.querySelector('#root')
	);
}

render(Root);

if (module.hot) {
	module.hot.accept('./root', () => {
		render(Root)
	});
}