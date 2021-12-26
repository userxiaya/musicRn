//当前播放的音乐
import React, {createContext, useReducer, ReactNode, useContext} from 'react';
import Video from 'react-native-video';
import {StyleSheet} from 'react-native';
import {songItemState} from '@/types';
import {getMusicUrlApi as qqMusicUrlApi} from '@/apis/qq';
import {getMusicUrlApi as netEaseMusicUrlApi} from '@/apis/netEase';
import {getMusicUrlApi as kugouMusicUrlApi} from '@/apis/kugou';
import {showToast} from '@/utils/tools';
import {useCreation, useMemoizedFn} from 'ahooks';
import {cloneDeep} from 'lodash';
import musicTools from '@/utils/musicTools';

const apiMap: {
  [name: string]: (id: string) => Promise<string>;
} = {
  QQ: qqMusicUrlApi,
  netEase: netEaseMusicUrlApi,
  kugou: kugouMusicUrlApi,
};

export interface MusicStoreState {
  songList: songItemState[]; //歌曲列表
  id?: string; //当前歌曲Id
}
const styles = StyleSheet.create({
  backgroundVideo: {
    display: 'none',
  },
});
export type MusicAction = {type: 'ADD_MUSIC'; payload: songItemState};
function reducer(state: MusicStoreState, action?: MusicAction) {
  switch (action?.type) {
    case 'ADD_MUSIC':
      const {payload} = action;
      let songList = cloneDeep(state.songList);
      const hasSong = songList.find(e => e.id === payload.id);
      //判断播放列表里是否有数据
      if (!hasSong) {
        songList.push(payload);
      }
      return {
        id: payload.id,
        songList: songList,
      };
    default:
      return state;
  }
}
interface MusicStoreProps {
  children: ReactNode;
}
const initState = {
  id: undefined,
  songList: [],
};
export const MusicContext = createContext<{
  state?: MusicStoreState;
  dispatch: React.Dispatch<MusicAction>;
}>({
  state: initState,
  dispatch: () => null,
});
const MusicStore = (props: MusicStoreProps) => {
  const [state, dispatch] = useReducer(reducer, initState);
  //当前歌曲
  const currentSong = useCreation(() => {
    if (!state.id || state.songList.length === 0) {
      return null;
    }
    return state.songList.find(e => {
      return e.id === state.id;
    });
  }, [state]);
  return (
    <MusicContext.Provider value={{state, dispatch}}>
      {props.children}
      {currentSong && (
        <Video
          playInBackground={true}
          audioOnly={true}
          source={{
            uri: currentSong?.songUrl || '',
          }}
          style={styles.backgroundVideo}
        />
      )}
    </MusicContext.Provider>
  );
};
export default MusicStore;
export const useMisic = () => {
  const {dispatch, state} = useContext(MusicContext);
  const add = useMemoizedFn((song: songItemState) => {
    const {channel: songChannel} = song;
    if (state?.id === song.id) {
      return;
    }
    if (song && song.songId) {
      const urlService = apiMap[songChannel];
      urlService(song.songId)
        .then(songUrl => {
          if (!songUrl) {
            showToast('获取播放路径失败！请切换渠道');
            return;
          }
          const singerName = song.singer.map(e => e.name).join('/');
          musicTools.notifyMusic(song.name, singerName, song.coverImage);
          dispatch({
            type: 'ADD_MUSIC',
            payload: {
              ...song,
              songUrl,
            },
          });
        })
        .catch(() => {
          showToast('获取播放路径失败！请切换渠道');
        });
    }
  });
  return {
    state,
    add,
  };
};
