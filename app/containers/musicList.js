import React, { Component } from 'react';
import MusicListItem from '../component/musicListItem';
import './musicListItem.scss'

// 整合 MusicListItem 后形成的 列表页组件（类似于 ul）
class MusicList extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		// 循环渲染（需要加上 key 属性）
		let listElements = this.props.musicList.map((item) => {
			// focus 属性用于标注当前播放的是哪一首歌曲（return boolean）
			return (
				<MusicListItem focus={item === this.props.currentMusicItem} key={item.id} musicItem={item} />

			);
		});

		return (
			<div className='listBox'>
				<ul>
					{listElements}
				</ul>
			</div>
		)
	}
}

export default MusicList;