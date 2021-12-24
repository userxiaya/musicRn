import React, {useContext} from 'react';
import {Text, View, Image, TouchableHighlight} from 'react-native';
import {SingerItem, songItemState} from '@/types';
import styles from './style';
import {getMusicUrlApi as qqMusicUrlApi} from '@/apis/qq';
import {getMusicUrlApi as netEaseMusicUrlApi} from '@/apis/netEase';
import {getMusicUrlApi as kugouMusicUrlApi} from '@/apis/kugou';
import {showToast} from '@/utils/tools';
import {MusicAction, MusicContext} from '@/store/music';
interface SongItemProps {
  item: songItemState;
  index?: number;
}
const apiMap2: {
  [name: string]: (id: string) => Promise<string>;
} = {
  QQ: qqMusicUrlApi,
  netEase: netEaseMusicUrlApi,
  kugou: kugouMusicUrlApi,
};
const getSingerName = (singer?: SingerItem[]) => {
  if (!singer) {
    return [];
  }
  const result = singer.map(e => e.name);
  return result.join('/');
};
//方法写在外部 优化不用每个list item都加载一个这个方法
const onSelectSong = (
  song: songItemState,
  dispatch: React.Dispatch<MusicAction>,
) => {
  const {channel: songChannel} = song;
  if (song && song.songId) {
    const urlService = apiMap2[songChannel];
    urlService(song.songId)
      .then(url => {
        if (!url) {
          showToast('获取播放路径失败！请切换渠道');
          return;
        }
        //提交到musicStore处理播放音频
        dispatch({
          type: 'SET_MUSIC',
          payload: {
            ...song,
            url,
          },
        });
      })
      .catch(() => {
        showToast('获取播放路径失败！请切换渠道');
      });
  }
};
const SongItem = ({item}: SongItemProps) => {
  const {dispatch} = useContext(MusicContext);
  return (
    <TouchableHighlight
      underlayColor={''}
      onPress={() => {
        onSelectSong?.(item, dispatch);
      }}>
      <View style={[styles.songItem]}>
        {/* <Text style={[styles.index]}>{index}</Text> */}
        <View style={[styles.message_container]}>
          <Text style={[styles.name]} numberOfLines={1}>
            {item?.name}
          </Text>
          <Text style={[styles.singer_name]} numberOfLines={1}>
            {getSingerName(item?.singer)}
          </Text>
        </View>
        <View style={[styles.more_container]}>
          <Image
            style={[styles.more]}
            source={require('@/assets/image/more_android_light.png')}
          />
        </View>
      </View>
    </TouchableHighlight>
  );
};
export default SongItem;
