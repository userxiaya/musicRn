/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  ReactNode,
  Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  BackHandler,
  StatusBar,
  StyleSheet,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import MinBar, {BarRef} from '@/components/minBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MusicStore, {useMusic} from '@/store/music';
import Router from '@/routes';
import ThemeStore from '@/store/theme';
import {
  useCreation,
  useMemoizedFn,
  useMount,
  useSafeState,
  useUnmount,
} from 'ahooks';
import musicTools from '@/utils/musicTools';
import {debounce} from 'lodash';
import {OnProgressData} from 'react-native-video';

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
  const {nextSong} = useMusic();
  const [isMounted, setMounted] = useSafeState<boolean>(false);
  const barRef = useRef<BarRef>(null);
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
        <MusicStore
          onEnd={() => {
            nextSong();
          }}
          onProgress={data => {
            barRef.current && barRef.current.setProgress?.(data);
          }}>
          <MusicNotify>
            <Router />
            <MinBar cRef={barRef} />
          </MusicNotify>
        </MusicStore>
      </ThemeStore>
    </SafeAreaProvider>
  );
}
