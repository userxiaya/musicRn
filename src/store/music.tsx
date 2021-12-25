//当前播放的音乐
import React, {createContext, useReducer, ReactNode} from 'react';
import Video from 'react-native-video';
import {StyleSheet} from 'react-native';
import {SingerItem} from '@/types';
import musicTools from '@/utils/musicTools';

export interface MusicStoreState {
  id?: string;
  name?: string;
  url?: string;
  coverImage?: string;
  singer?: SingerItem[];
}
const styles = StyleSheet.create({
  backgroundVideo: {
    display: 'none',
  },
});
export type MusicAction = {type: 'SET_MUSIC'; payload: MusicStoreState | null};
function reducer(state: MusicStoreState | null, action?: MusicAction) {
  switch (action?.type) {
    case 'SET_MUSIC':
      const {payload = {}} = action;
      const singers = payload?.singer || [];
      console.log(payload?.coverImage || 'empty');
      musicTools.notifyMusic(
        payload?.name || '歌名',
        singers.map(e => e.name).join('/') || '歌手',
        payload?.coverImage || '',
      );
      return {...state, ...action.payload};
    default:
      return state;
  }
}
interface MusicStoreProps {
  children: ReactNode;
}

export const MusicContext = createContext<{
  state?: MusicStoreState | null;
  dispatch: React.Dispatch<MusicAction>;
}>({
  state: null,
  dispatch: () => null,
});
const MusicStore = (props: MusicStoreProps) => {
  const [state, dispatch] = useReducer(reducer, null);
  return (
    <MusicContext.Provider value={{state, dispatch}}>
      {props.children}
      {state && (
        <Video
          playInBackground={true}
          audioOnly={true}
          source={{
            uri: state?.url || '',
          }}
          style={styles.backgroundVideo}
        />
      )}
    </MusicContext.Provider>
  );
};
export default MusicStore;
