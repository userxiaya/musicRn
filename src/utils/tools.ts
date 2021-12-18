import {ToastAndroid} from 'react-native';

//toast提示
export const showToast = (text: string) => {
  ToastAndroid.show(text, ToastAndroid.SHORT);
};