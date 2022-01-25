import React, {
  Ref,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {ThemeContext} from '@/store/theme';
import {MusicStoreState, useMusic} from '@/store/music';
import Icon from '@/components/icon';
import {useCreation, useMemoizedFn} from 'ahooks';
import {OnProgressData} from 'react-native-video';

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 10,
    position: 'absolute',
    bottom: 5,
    left: '5%',
    borderRadius: 40,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  relative: {
    position: 'relative',
    flex: 1,
  },
  progress: {
    position: 'absolute',
    top: 5,
    right: 55,
  },
  message: {
    position: 'absolute',
    top: 2,
    right: 12,
    height: 36,
    width: 30,
    tintColor: '#fff',
  },
});
export interface BarRef {
  setProgress?: (data: OnProgressData) => void;
}
const Progress = ({
  music,
  onPress,
  cRef,
}: {
  music?: MusicStoreState;
  onPress?: (event?: GestureResponderEvent) => void;
  cRef: Ref<BarRef>;
}) => {
  const {state: theme} = useContext(ThemeContext);
  const [progress, setProgress] = useState<OnProgressData>();
  const precent = useCreation(() => {
    if (progress) {
      const result = progress.currentTime / progress.playableDuration;
      if (
        typeof result === 'number' &&
        !isNaN(result) &&
        progress.playableDuration > 0
      ) {
        return result * 100;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }, [progress]);
  const progressContent = useMemo(() => {
    return (
      <>
        {music?.id && precent > 0 && (
          <AnimatedCircularProgress
            size={30}
            width={2}
            fill={precent}
            rotation={0}
            tintColor={theme?.text_color}
            backgroundColor="#767676">
            {() => (
              <Icon
                name={music?.paused === true ? 'icon-play' : 'icon-pause'}
                size={20}
                color={theme?.text_color}
              />
            )}
          </AnimatedCircularProgress>
        )}
      </>
    );
  }, [music?.id, music?.paused, precent, theme?.text_color]);
  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    setProgress: setProgress,
  }));
  return (
    <TouchableOpacity
      style={styles.progress}
      activeOpacity={1}
      onPress={(event: GestureResponderEvent) => {
        onPress && onPress(event);
      }}>
      {progressContent}
    </TouchableOpacity>
  );
};

const Bar = ({cRef}: {cRef: Ref<BarRef>}) => {
  const progressRef = useRef<BarRef>(null);
  const setProgress = useMemoizedFn((data: OnProgressData) => {
    progressRef.current && progressRef.current.setProgress?.(data);
  });
  useImperativeHandle(cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    setProgress: setProgress,
  }));
  const {state: music, playOrPause} = useMusic();
  const currentMusic = useCreation(() => {
    if (music && music.songList && music.songList.length > 0) {
      const current = music.songList.find(e => {
        return e.id === music.id;
      });
      return current;
    } else {
      return null;
    }
  }, [music?.id]);
  return (
    <View style={styles.container}>
      <View style={styles.relative}>
        <Image
          style={styles.image}
          //android debug环境不生效
          defaultSource={require('@/assets/image/default.png')}
          source={{
            uri: currentMusic?.coverImage,
          }}
        />
        <Progress
          cRef={progressRef}
          music={music}
          onPress={() => {
            playOrPause && playOrPause();
          }}
        />
        <Image
          style={styles.message}
          source={require('@/assets/image/musiclist.png')}
        />
      </View>
    </View>
  );
};
export default Bar;
