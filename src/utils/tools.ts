import {songChannel} from '@/types';
import {ToastAndroid} from 'react-native';

//toast提示
export const showToast = (text: string) => {
  ToastAndroid.show(text, ToastAndroid.SHORT);
};
export const formatImageUrl = (url?: string) => {
  return (url || '').replace('http://', 'https://');
};
export const songChannelList: {channel: songChannel; label: string}[] = [
  {channel: 'QQ', label: 'QQ'},
  {channel: 'netEase', label: '网易云'},
  {channel: 'kugou', label: '酷狗'},
];
export function debounce(fn: any, t: number) {
  let timeId: NodeJS.Timeout | null = null;
  const delay = t || 1000;
  return function (this: any, ...args: any) {
    if (timeId) {
      clearTimeout(timeId);
    }
    timeId = setTimeout(() => {
      timeId = null;
      fn.apply(this, args);
    }, delay);
  };
}
