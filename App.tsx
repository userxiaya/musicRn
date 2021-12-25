import React, {useEffect} from 'react';
import {Alert, BackHandler, StatusBar, StyleSheet} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import MusicStore from '@/store/music';
import Router from '@/routes';
import ThemeStore from '@/store/theme';
import {useMount, useSafeState, useUnmount} from 'ahooks';
import musicTools from '@/utils/musicTools';

const styles = StyleSheet.create({
  app: {
    flex: 1,
    position: 'relative',
  },
});
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
          <Router />
        </MusicStore>
      </ThemeStore>
    </SafeAreaProvider>
  );
}
