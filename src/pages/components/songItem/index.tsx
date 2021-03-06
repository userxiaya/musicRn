import React from 'react';
import {Text, View, Image, TouchableHighlight} from 'react-native';
import {SingerItem, songItemState} from '@/types';
import styles from './style';
import {useMusic} from '@/store/music';

interface SongItemProps {
  item: songItemState;
  index?: number;
}
const getSingerName = (singer?: SingerItem[]) => {
  if (!singer) {
    return [];
  }
  const result = singer.map(e => e.name);
  return result.join('/');
};

const SongItem = ({item}: SongItemProps) => {
  const {add: addMisic} = useMusic();
  return (
    <TouchableHighlight
      underlayColor={''}
      onPress={() => {
        addMisic(item);
      }}>
      <View style={[styles.songItem]}>
        {/* <Text style={[styles.index]}>{index}</Text> */}
        <View style={[styles.message_container]}>
          <Text style={[styles.name]} numberOfLines={1}>
            {item?.name}
          </Text>
          <Text style={[styles.singer_name]} numberOfLines={1}>
            {getSingerName(item?.singer)}
          </Text>
        </View>
        <View style={[styles.more_container]}>
          <Image
            style={[styles.more]}
            source={require('@/assets/image/more_android_light.png')}
          />
        </View>
      </View>
    </TouchableHighlight>
  );
};
export default SongItem;
