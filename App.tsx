import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import MusicStore from '@/store/music';
import Router from '@/routes';
import ThemeStore from '@/store/theme';
import {useMount, useSafeState, useUnmount} from 'ahooks';

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
  useUnmount(() => {
    setMounted(false);
  });
  return (
    <SafeAreaProvider style={styles.app}>
      {/* 沉浸式状态栏 */}
      <StatusBar
        translucent={true}
        hidden={isMounted}
        backgroundColor="transparent"
      />
      <ThemeStore>
        <MusicStore>
          <Router />
        </MusicStore>
      </ThemeStore>
    </SafeAreaProvider>
  );
}
