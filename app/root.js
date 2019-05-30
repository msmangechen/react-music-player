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
			currentMusicItem: MUSIC_LIST[0],
			cycleModel: 'cycle'
		}
	}

	playMusic() {
		$('#player').jPlayer('setMedia', {
			mp3: this.state.currentMusicItem.file
		}).jPlayer('play');
	}

	playNext(type = 'next') {
		let index = this.findMusicIndex(this.state.currentMusicItem);
		let newIndex = null;
		let musicListLength = this.state.musicList.length;

		switch(type) {
			case 'cycle':
				newIndex = (index + 1) % musicListLength;
				break;
			case 'once':
				newIndex = index;
				break;
			case 'random':
				newIndex = Math.round(Math.random() * musicListLength);
				break;
			case 'prev':
				newIndex = (index - 1 + musicListLength) % musicListLength;
				break;
			default:
				// 小技巧：播放到最后一首后，取模后会自动跳转到第一首（上面的 prev 类似）
				newIndex = (index + 1) % musicListLength;
		}

		// 根据 newIndex 来设置当前的播放
		this.setState({
			currentMusicItem: this.state.musicList[newIndex]
		});

		this.playMusic();
	}

	findMusicIndex(musicItem) {
		return this.state.musicList.indexOf(musicItem);
	}

	componentDidMount() {
		// initialization
		$('#player').jPlayer({
			supplied: 'mp3',
			wmode: 'window'
		});

		this.playMusic(this.state.currentMusicItem);

		// 当前音乐播放完毕事件，调用 playNext() 播放下一首
		// 再根据 cycleModel 来判断是单曲循环还是下一首还是随机播放
		$('#player').bind($.jPlayer.event.ended, (e) => {
			switch(this.state.cycleModel) {
				case 'cycle':
					this.playNext('cycle');
					break;
				case 'once':
					this.playNext('once');
					break;
				case 'random':
					this.playNext('random');
					break;
			}
		});

		// 设置订阅器，监听来自 MusicList 和 Player 组件发送过来的事件再进行处理（歌曲切换操作）
		Pubsub.subscribe('CHOOSE_MUSIC', (msg, musicItem) => {
			// 设定为当前选中的
			this.setState({
				currentMusicItem: musicItem
			});

			this.playMusic();
		});

		Pubsub.subscribe('DELETE_MUSIC', (msg, musicItem) => {
			this.setState({
				musicList: this.state.musicList.filter(item => musicItem !== item)
			});
		});

		Pubsub.subscribe('PREV_MUSIC', (msg) => {
			this.playNext('prev');
		});

		Pubsub.subscribe('NEXT_MUSIC', (msg) => {
			this.playNext('next');
		});

		Pubsub.subscribe('CHANGE_CYCLE_MODEL', (msg) => {
			const MODEL = ['cycle', 'once', 'random'];
			let currentModel = MODEL.indexOf(this.state.cycleModel);
			let newModel = (currentModel + 1) % 3;
			this.setState({
				cycleModel: MODEL[newModel]
			});
		});
	}

// 生命周期函数钩子（组件移除的时候解除绑定的事件）
	componentWillUnMount() {
		Pubsub.unSubscribe('CHOOSE_MUSIC');
		Pubsub.unSubscribe('DELETE_MUSIC');
		$('#player').unbind($.jPlayer.event.ended);
		Pubsub.unSubscribe('PREV_MUSIC');
		Pubsub.unSubscribe('NEXT_MUSIC');
		Pubsub.unSubscribe('CHANGE_CYCLE_MODEL');
	}

	render() {
		// 传递对应的参数
		// 播放器页面（主页）
		const Home = () => (
			<Player cycleModel={this.state.cycleModel} currentMusicItem={this.state.currentMusicItem} />
		);

		// 歌单页面（列表页）
		const List = () => (
			<MusicList currentMusicItem={this.state.currentMusicItem} musicList={this.state.musicList} />
		);

		return (
			<Router>
				<div>
					<Header />
					<Route exact path="/" component={Home} />
					<Route path="/list" component={List} />
				</div>
			</Router>
		);
	}
}

export default Root;