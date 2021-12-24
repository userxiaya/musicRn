import {ParamListBase, RouteProp} from '@react-navigation/native';

export type Navigation = any;
export interface ReactNavicationRouteProps {
  route: RouteProp<ParamListBase>;
  navigation: Navigation;
}
export interface SingerItem {
  name: string;
  id: string;
}
// 歌单标签
export type tagItem = {
  name: string;
};
//渠道来源
export type songChannel = 'QQ' | 'netEase' | 'kugou' | 'kuwo';
//歌单
export type songGroupItem = {
  updateTime: string;
  createtime: string;
  creator: {
    avatarUrl: string;
    name: string;
  };
  id: string;
  name: string;
  imageUrl: string;
  listenCount: number; // 播放数量
  songChannel: songChannel;
};
export type songGroupData = {
  list: songGroupItem[];
  total: number;
};
export type searchSongData = {total: number; list: songItemState[]};
// 歌曲列表-item
export type songItemState = {
  id: string;
  songId: string;
  songmid?: string;
  albumImg?: string;
  name: string;
  isVip: boolean;
  singer: SingerItem[];
  channel: songChannel;
};
// 歌单详情
export type playDetail = {
  id: string;
  name: string;
  userIcon: string;
  userName: string;
  desc: string;
  tagList: tagItem[];
  imageUrl: string;
  list: songItemState[];
};
