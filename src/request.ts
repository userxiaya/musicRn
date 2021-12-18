// import {Toast} from '@ant-design/react-native';
import axios, {AxiosRequestConfig} from 'axios';
const timeout = 12000;
const axiosRequest = axios.create({
  timeout,
});
axiosRequest.interceptors.response.use(
  (response: any) => {
    // 拦截响应，做统一处理
    if (response.status === 200) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response);
    }
  },
  // 接口错误状态处理，也就是说无响应时的处理
  error => {
    // Toast.fail('接口异常！');
    return Promise.reject(error); // 返回接口返回的错误信息
  },
);
export default (opt: AxiosRequestConfig): Promise<any> => {
  return axiosRequest(opt);
};
