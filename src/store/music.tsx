//当前播放的音乐
import React, {createContext, useReducer, ReactNode, useContext} from 'react';
import Video, {OnProgressData} from 'react-native-video';
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
const getSongUrl = (song: songItemState): Promise<string> => {
  const {channel: songChannel} = song;
  const urlService = apiMap[songChannel];
  return new Promise((resolve, reject) => {
    urlService(song.songId)
      .then(songUrl => {
        if (!songUrl) {
          showToast('获取播放路径失败！请切换渠道');
          reject('获取播放路径失败！请切换渠道');
          return;
        }
        resolve(songUrl);
      })
      .catch(() => {
        showToast('获取播放路径失败！请切换渠道');
        reject('获取播放路径失败！请切换渠道');
      });
  });
};

export interface MusicStoreState {
  songList: songItemState[]; //歌曲列表
  id?: string; //当前歌曲Id
  paused: boolean;
}
const styles = StyleSheet.create({
  backgroundVideo: {
    display: 'none',
  },
});
export type MusicAction = {
  type: 'ADD_MUSIC' | 'SET_PLAY_STATUS';
  payload?: songItemState;
};
function reducer(state: MusicStoreState, action?: MusicAction) {
  switch (action?.type) {
    case 'ADD_MUSIC':
      const {payload} = action;
      let songList = cloneDeep(state.songList);
      const hasSong = songList.find(e => e.id === payload?.id);
      //判断播放列表里是否有数据
      if (!hasSong && payload) {
        songList.push(payload);
      }
      return {
        id: payload?.id,
        songList: songList,
        paused: false,
      };
    case 'SET_PLAY_STATUS':
      musicTools.setNotifyPlayStatus(state.paused);
      return {
        ...state,
        paused: !state.paused,
      };
    default:
      return state;
  }
}
interface MusicStoreProps {
  children: ReactNode;
  onProgress?: (data: OnProgressData) => void;
  onEnd?: () => void;
}
const initState = {
  id: undefined,
  songList: [],
  paused: false,
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
          paused={state.paused}
          source={{
            uri: currentSong?.songUrl || '',
          }}
          onEnd={() => {
            props.onEnd && props.onEnd();
          }}
          onProgress={data => {
            props.onProgress && props.onProgress(data);
          }}
          style={styles.backgroundVideo}
        />
      )}
    </MusicContext.Provider>
  );
};
export default MusicStore;
export const useMusic = () => {
  const {dispatch, state} = useContext(MusicContext);
  const getSongDetail = useMemoizedFn((song: songItemState) => {
    if (state?.id === song.id) {
      return;
    }
    if (song && song.songId) {
      getSongUrl(song)
        .then(songUrl => {
          dispatch({
            type: 'ADD_MUSIC',
            payload: {
              ...song,
              songUrl,
            },
          });
          const singerName = song.singer.map(e => e.name).join('/');
          musicTools.notifyMusic(song.name, singerName, song.coverImage);
        })
        .catch(e => {
          console.log(e);
        });
    }
  });
  const songList = state?.songList || [];
  const id = state?.id;
  const nextSong = useMemoizedFn(() => {
    let songIndex = 0;
    if (id && songList.length > 0) {
      if (songList.length === 1) {
        showToast('当前播放列表只有一条数据');
        return;
      }
      for (let i = 0; i < songList.length; i++) {
        if (id === songList[i]?.id) {
          songIndex = i;
          break;
        }
      }
      songIndex = songIndex + 1 > songList.length - 1 ? 0 : songIndex + 1;
      const newSong = songList[songIndex];
      if (newSong) {
        getSongDetail(newSong);
      }
    }
  });
  const lastSong = useMemoizedFn(() => {
    let songIndex = 0;
    if (id && songList.length > 0) {
      if (songList.length === 1) {
        showToast('当前播放列表只有一条数据');
        return;
      }
      for (let i = 0; i < songList.length; i++) {
        if (id === songList[i]?.id) {
          songIndex = i;
          break;
        }
      }
      songIndex = songIndex - 1 < 0 ? 0 : songIndex - 1;
      const newSong = songList[songIndex];
      if (newSong) {
        getSongDetail(newSong);
      }
    }
  });
  return {
    state,
    add: getSongDetail,
    nextSong,
    lastSong,
    playOrPause: () => {
      dispatch({
        type: 'SET_PLAY_STATUS',
      });
    },
  };
};
