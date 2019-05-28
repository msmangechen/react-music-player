import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Header from './components/Header';
import Player from './containers/player';
import MusicList from './containers/musicList';
import Pubsub from 'pubsub-js';

// 音乐列表（需要添加大括号，default 导出则不需要）
import { MUSIC_LIST } from './config/musiclist';

class Root extends Component {
	constructor(props) {
		super(props)

		this.state = {
			musicList: MUSIC_LIST,
			cuerrentMusicItem: MUSIC_LIST[0],
			cycleModel: 'cycle'
		}
	}
}