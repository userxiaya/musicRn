import React, {useEffect} from 'react';
import {
  FlatList,
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useCreation, useMemoizedFn, useRequest, useSafeState} from 'ahooks';
import {
  playDetail,
  ReactNavicationRouteProps,
  songGroupItem,
  songItemState,
} from '@/types';
import musicTools from '@/utils/musicTools';
import LinearGradient from 'react-native-linear-gradient';
import {getPlayDetailApi as qqDetail} from '@/apis/qq';
import {getPlayDetailApi as netEaseDetail} from '@/apis/netEase';
import {getPlayDetailApi as kugouDetail} from '@/apis/kugou';
import Header from '@/components/header';
import styles from './style';
import SongItem from '../components/songItem';
import HTMLView from 'react-native-htmlview';

const apiMap: {
  [name: string]: (id: string) => Promise<playDetail>;
} = {
  QQ: qqDetail,
  netEase: netEaseDetail,
  kugou: kugouDetail,
};

interface DetailHeaderProps {
  playInfo?: playDetail;
  headerHeight?: number;
  LinearColors?: string[];
}

function renderNode(
  node: {name: string; attribs: {style: any}; children: any},
  index: React.Key | null | undefined,
  siblings: any,
  parent: any,
  defaultRenderer: (
    arg0: any,
    arg1: any,
  ) =>
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined,
) {
  if (node.name === 'html-text') {
    const specialSyle = node.attribs.style;
    return (
      <Text key={index} style={JSON.parse(specialSyle)} numberOfLines={1}>
        {defaultRenderer(node.children, parent)}
      </Text>
    );
  }
}

function DetailHeader({
  playInfo,
  headerHeight = 0,
  LinearColors = [],
}: DetailHeaderProps) {
  const headerHeightStyle = useCreation(() => {
    return StyleSheet.create({
      style: {
        paddingTop: headerHeight + 5,
      },
    });
  }, [headerHeight]);
  const Desc = useCreation(() => {
    const str = (playInfo?.desc || '').replace(/<br\/>|<br>/g, '');
    return (
      playInfo?.desc && (
        <HTMLView
          renderNode={renderNode}
          value={`<html-text style=${JSON.stringify(
            styles.desc_text,
          )}>简介：${str}</html-text>`}
        />
      )
    );
  }, [playInfo]);
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={LinearColors}
      style={[styles.top_container, headerHeightStyle.style]}>
      <View style={[styles.top_container_content]}>
        <Image
          style={styles.image}
          source={{uri: playInfo?.imageUrl}}
          resizeMode="cover"
        />
        <View style={[styles.mess_content]}>
          <Text style={[styles.play_name]} numberOfLines={2}>
            {playInfo?.name}
          </Text>
          <View style={[styles.userName]}>
            <Image style={styles.userIcon} source={{uri: playInfo?.userIcon}} />
            <Text style={[styles.userName_text]}>{playInfo?.userName}</Text>
          </View>
          <View style={[styles.desc]}>
            {Desc}
            <View style={[styles.desc_icon_content]}>
              <Image
                style={[styles.desc_icon]}
                source={require('@/assets/image/next.png')}
              />
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
const SongGroupDetail = ({route}: ReactNavicationRouteProps) => {
  const [imageBackground, setBackground] = useSafeState<{
    startColor: string;
    endColor: string;
  } | null>(null);
  const [scrollY, setscrollY] = useSafeState<number>(0);
  const [headerHeight, setHeaderHeight] = useSafeState<number>(60);
  const params = useCreation(() => {
    const result = route.params as songGroupItem;
    return result;
  }, [route.params]);
  const {songChannel} = params;
  const service = apiMap[songChannel];

  //渐变色
  const LinearColors = useCreation(() => {
    const defaultColor = [
      'rgb(255,255,255)',
      'rgb(255,255,255)',
      'rgb(255,255,255)',
    ];
    const result = imageBackground
      ? [
          `rgba(${imageBackground.startColor},1)`,
          `rgba(${imageBackground.startColor},0.8)`,
          `rgba(${imageBackground.startColor},0.6)`,
        ]
      : defaultColor;
    return result;
  }, [imageBackground]);
  //渐变色
  const LinearColors1 = useCreation(() => {
    const defaultColor = [
      'rgb(255,255,255)',
      'rgb(255,255,255)',
      'rgb(255,255,255)',
    ];
    const result = imageBackground
      ? [
          `rgba(${imageBackground.startColor},1)`,
          `rgba(${imageBackground.startColor},1)`,
          `rgba(${imageBackground.startColor},1)`,
        ]
      : defaultColor;
    return result;
  }, [imageBackground, scrollY]);

  const {data: playInfo, loading} = useRequest(
    () => service?.(params.id) as Promise<playDetail>,
  );
  useEffect(() => {
    if (playInfo) {
      const {imageUrl} = playInfo;
      musicTools.getBackGroundByImage(
        imageUrl,
        (result: any) => {
          setBackground(result);
        },
        () => {},
      );
    }
  }, [playInfo, setBackground]);
  const onHeadLayout = useMemoizedFn(({nativeEvent}: LayoutChangeEvent) => {
    setHeaderHeight(nativeEvent.layout.height);
  });
  const headContainer = useCreation(() => {
    const opacity = scrollY / 190; //列表头部元素高度
    return (
      <Header
        color={'#fff'}
        onLayout={onHeadLayout}
        title={opacity > 0.7 ? playInfo?.name : '歌单'}
        style={[styles.header]}
        opacity={opacity > 1 ? 1 : opacity}
        LinearColors={LinearColors1}
      />
    );
  }, [LinearColors1, scrollY]);
  const listHeader = useCreation(() => {
    return (
      <DetailHeader
        headerHeight={headerHeight}
        playInfo={playInfo}
        LinearColors={LinearColors}
      />
    );
  }, [playInfo, LinearColors]);
  const footer = useCreation(() => {
    const text = loading === false ? '无更多数据' : '加载中...';
    return <Text style={[styles.footer]}>{text}</Text>;
  }, [loading]);
  const renderItem = useMemoizedFn(
    ({item, index}: {item: songItemState; index: number}) => {
      return <SongItem item={item} index={index + 1} />;
    },
  );
  const onScroll = useMemoizedFn(
    ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {y} = nativeEvent.contentOffset;
      setscrollY(y);
    },
  );
  const listContainer = useCreation(() => {
    return (
      <FlatList
        ListHeaderComponent={listHeader}
        ListFooterComponent={footer}
        data={playInfo?.list}
        horizontal={false}
        renderItem={renderItem}
        onScroll={onScroll}
        keyExtractor={item => item.id}
      />
    );
  }, [playInfo, LinearColors]);

  return (
    <SafeAreaView style={[styles.container]}>
      {headContainer}
      {listContainer}
    </SafeAreaView>
  );
};
export default SongGroupDetail;
