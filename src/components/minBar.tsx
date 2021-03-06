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
  Text,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {ThemeContext} from '@/store/theme';
import {MusicStoreState, useMusic} from '@/store/music';
import Icon from '@/components/icon';
import {useCreation, useMemoizedFn} from 'ahooks';
import {OnProgressData} from 'react-native-video';
import {SingerItem} from '@/types';

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
  barText: {
    position: 'absolute',
    left: 50,
    height: '100%',
    width: '55%',
    color: '#fff',
    textAlignVertical: 'center',
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
    );
  }, [music?.paused, precent, theme?.text_color]);
  // ????????????useImperativeHandle?????????????????????????????????????????????ref??????
  useImperativeHandle(cRef, () => ({
    // changeVal ?????????????????????????????????
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
    // changeVal ?????????????????????????????????
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
    <>
      {!!currentMusic && (
        <View style={styles.container}>
          <View style={styles.relative}>
            <Image
              style={styles.image}
              //android debug???????????????
              defaultSource={require('@/assets/image/default.png')}
              source={{
                uri: currentMusic?.coverImage,
              }}
            />
            <Text numberOfLines={1} style={styles.barText}>
              {currentMusic?.name}-
              {(currentMusic?.singer || ([] as SingerItem[]))
                .map(e => {
                  return e.name;
                })
                .join('/')}
            </Text>
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
      )}
    </>
  );
};
export default Bar;
