import request from '@/request';
import queryString from 'query-string';
import {weapi} from '@/utils/cypto';
import moment from 'moment';
import {playDetail, songGroupData, songItem} from '@/types';
import {AxiosRequestConfig} from 'axios';

const requestNetEase = (option: AxiosRequestConfig<any>) => {
  return request({
    ...option,
    data: queryString.stringify(weapi(option.data)),
    headers: {
      referer: 'https://music.163.com/',
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent':
        'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BLA-AL00 Build/HUAWEIBLA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36',
    },
  });
};

const baseUrl1: string = 'https://music.163.com';

const querySongList = (trackIds: string[]): Promise<songItem[]> => {
  return new Promise((resolve, reject) => {
    const data = {
      c: '[' + trackIds.map(id => '{"id":' + id + '}').join(',') + ']',
      ids: '[' + trackIds.join(',') + ']',
    };
    requestNetEase({
      url: '/weapi/v3/song/detail',
      method: 'POST',
      baseURL: baseUrl1,
      data,
    })
      .then(res => {
        const list: any[] = res?.songs || [];
        const result: songItem[] = list.map(e => ({
          id: e.id,
          name: e.name,
          isVip: false,
          // eslint-disable-next-line no-shadow
          singer: e.ar.map((e: {id: number; name: string}) => ({
            id: e.id,
            name: e.name,
          })),
        }));
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};
/**
 *
 * @param current 当前页
 * @param pageSize 每页n条
 * @returns
 */
export const getSongGroupListApi = (params?: {
  current?: number;
  pageSize?: number;
}): Promise<songGroupData> => {
  const {current = 1, pageSize = 10} = params || {};
  const data = {
    cat: '全部',
    order: 'hot', // hot,new
    limit: pageSize,
    offset: (current - 1) * pageSize,
    total: true,
  };
  return new Promise((resolve, reject) => {
    requestNetEase({
      url: '/weapi/playlist/list',
      method: 'POST',
      baseURL: baseUrl1,
      data,
    })
      .then(res => {
        const result: songGroupData = {
          total: res.total,
          list: res.playlists.map((e: any) => ({
            updateTime: moment(e?.updateTime).format('YYYY-MM-dd'),
            createtime: moment(e?.createTime).format('YYYY-MM-dd'),
            creator: {
              avatarUrl: e?.creator?.avatarUrl,
              name: e?.creator?.name,
            },
            id: e?.id,
            name: e?.name,
            imageUrl: e?.coverImgUrl,
            listenCount: e?.playCount, // 播放数量
            songChannel: 'netEase',
          })),
        };
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getPlayDetailApi = (id: string): Promise<playDetail> => {
  return new Promise((resolve, reject) => {
    const data = {
      id: id,
      offset: 0,
      total: true,
      limit: 1000,
      n: 1000,
      csrf_token: '',
    };
    requestNetEase({
      url: '/weapi/v3/playlist/detail',
      method: 'POST',
      baseURL: baseUrl1,
      data,
    })
      .then(async res => {
        // eslint-disable-next-line no-shadow
        const data = res?.playlist || {};
        const list = data.trackIds.map((e: {id: number}) => e.id);
        const songList: songItem[] = await querySongList(list);
        const result: playDetail = {
          id: data.id,
          userName: data.creator.nickname,
          desc: data.description,
          userIcon: data.creator.avatarUrl,
          imageUrl: data.coverImgUrl,
          name: data.name,
          tagList: data.tags.map((name: any) => {
            return {
              name,
            };
          }),
          list: songList,
        };
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};
