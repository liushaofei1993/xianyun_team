import {
  Message
} from "element-ui";

// 设置全局拦截器拦截错误信息
export default function ({
  $axios,
  redirect
}) {
  $axios.onError(err => {
    const {
      statusCode,
      message
    } = err.response.data;
    if (statusCode === 403 || statusCode === 401) {
      Message.warning({
        message: '请先登录'
      })
      redirect("/user/login")
    }
    if (statusCode === 400) {
      Message.warning({
        message
      });
    }
  });
}
