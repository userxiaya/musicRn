import request from '@/request';
import {playDetail, songGroupData} from '@/types';
import {AxiosRequestConfig} from 'axios';
import moment from 'moment';

const requestKugou = (option: AxiosRequestConfig<any>) => {
  return request({
    ...option,
    headers: {
      referer: 'https://music.163.com/',
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent':
        'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BLA-AL00 Build/HUAWEIBLA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36',
    },
  });
};
const getPlayListItem = (item: {hash: string; album_id: string}) => {
  const url = `/app/i/getSongInfo.php?cmd=playInfo&hash=${item.hash}`;
  return new Promise((resolve, reject) => {
    requestKugou({
      method: 'GET',
      url,
      baseURL: baseUrl1,
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const baseUrl1 = 'https://m.kugou.com';

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
  const {current = 1} = params || {};
  return new Promise((resolve, reject) => {
    requestKugou({
      url: '/plist/index',
      method: 'GET',
      baseURL: baseUrl1,
      params: {
        json: true,
        // pageSize: 30, //
        page: current,
      },
    })
      .then(res => {
        const data = res?.plist?.list || {};
        const list = data?.info || [];
        const result: songGroupData = {
          total: data.total,
          list: list.map((e: any) => ({
            updateTime: moment(e?.publishtime).format('YYYY-MM-dd'),
            createtime: moment(e?.publishtime).format('YYYY-MM-dd'),
            creator: {
              avatarUrl: e?.user_avatar,
              name: e?.username,
            },
            id: e?.specialid,
            name: e?.specialname,
            imageUrl: (e?.imgurl || '').replace('{size}', '400'),
            listenCount: e?.playcount, // 播放数量
            songChannel: 'kugou',
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
    requestKugou({
      method: 'GET',
      url: `/plist/list/${id}?json=true`,
      baseURL: baseUrl1,
    })
      .then(async res => {
        const info = res?.info?.list || {};
        const list = res?.list?.list?.info || [];
        const tracks = await Promise.all(
          list.map(async (item: any) => await getPlayListItem(item)),
        );
        const result: playDetail = {
          id: info.specialid,
          name: info.specialname,
          userName: info.nickname,
          desc: info.intro,
          userIcon: info.user_avatar,
          imageUrl: info.imgurl.replace('{size}', 400),
          tagList: info.tags.map((t: {tagname: string}) => {
            return {
              name: t.tagname,
            };
          }),
          list: tracks.map((t: any) => {
            const singer = Array.isArray(t.authors) ? t.authors : [];
            return {
              id: t.audio_id,
              name: t.songName,
              isVip: false,
              singer: singer.map((s: {author_id: number; author_name: any}) => {
                return {
                  id: s.author_id,
                  name: s.author_name,
                };
              }),
            };
          }),
        };
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};
