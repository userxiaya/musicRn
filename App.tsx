import React, {ReactNode, useEffect, useRef} from 'react';
import {
  Alert,
  BackHandler,
  StatusBar,
  StyleSheet,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import MusicStore, {useMusic} from '@/store/music';
import Router from '@/routes';
import ThemeStore from '@/store/theme';
import {useMemoizedFn, useMount, useSafeState, useUnmount} from 'ahooks';
import musicTools from '@/utils/musicTools';
import {debounce} from 'lodash';

const styles = StyleSheet.create({
  app: {
    flex: 1,
    position: 'relative',
  },
});
interface MusicNotifyProps {
  children: ReactNode;
}
const MusicNotify = (props: MusicNotifyProps) => {
  const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
  const {playOrPause, nextSong, lastSong} = useMusic();
  const onNotifyCallback = useMemoizedFn(event => {
    switch (event.status) {
      case 'playOrPause':
        playOrPause();
        break;
      case 'nextSong':
        nextSong();
        break;
      case 'lastSong':
        lastSong();
        break;
      default:
        break;
    }
  });
  const notifyCallback = useRef(
    debounce(q => onNotifyCallback(q), 500),
  ).current;
  eventEmitter.addListener('notifyCallback', notifyCallback);
  return <>{props.children}</>;
};

export default function App() {
  const [isMounted, setMounted] = useSafeState<boolean>(false);
  useMount(() => {
    setTimeout(() => {
      setMounted(true);
    }, 50);
  });
  useEffect(() => {
    const backAction = () => {
      Alert.alert('提示', '是否退出app', [
        {
          text: '否',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: '是',
          onPress: () => {
            musicTools.closeNotify();
            BackHandler.exitApp();
          },
        },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  useUnmount(() => {
    setMounted(false);
  });
  return (
    <SafeAreaProvider style={styles.app}>
      {/* 沉浸式状态栏 */}
      <StatusBar
        translucent={isMounted}
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ThemeStore>
        <MusicStore>
          <MusicNotify>
            <Router />
          </MusicNotify>
        </MusicStore>
      </ThemeStore>
    </SafeAreaProvider>
  );
}
