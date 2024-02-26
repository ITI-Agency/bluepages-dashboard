import axios from "axios";

const HTTP = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  // baseURL: "https://bluepages.com.sa/api/",
  headers: {
    common: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});

const onDownloadProgress = (progressEvent) => {
  // let percentCompleted = Math.floor(progressEvent.loaded / progressEvent.total);
  // console.log("handling download progress event here:>", progressEvent);
  // console.log(progressEvent.currentTarget);
  // const total = parseFloat(
  //   progressEvent.currentTarget.getResponseHeader("Content-Length")
  // );
  // console.log(progressEvent.srcElement.getAllResponseHeaders());
  // const current = progressEvent.currentTarget.response.length;
  // let percentCompleted = Math.floor((current / total) * 100);
  // console.log("completed: ", percentCompleted);
};
const onUploadProgress = (progressEvent) => {
  // console.log("handling uplaod progress event here:>", progressEvent);
};

HTTP.interceptors.request.use(
  (config) => {
    const AUTH_JWT = localStorage.getItem("AUTH_JWT");
    config.headers["Authorization"] = `Bearer ${AUTH_JWT}`;
    return {
      ...config,
      // onUploadProgress: config.onUploadProgress || onUploadProgress,
      // onDownloadProgress: config.onDownloadProgress || onDownloadProgress,
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);

HTTP.interceptors.response.use(null, async (err) => {
  const error = JSON.parse(JSON.stringify(err));
  console.log("this is errors:>", error);
  //handling error => log it or what ever
  if (error && error.status >= 400 && error.status <= 500) {
    console.log("this is errors:>", error.message);
    // Api().error(error.message);
    if (error.status == 401) {
      console.log("from unauthed");
    }
    return Promise.reject(error);
  } else {
    console.log("Loggin the error", error);
    // alert("An unexpected error occurred");
  }
});

export default {
  get: HTTP.get,
  post: HTTP.post,
  put: HTTP.put,
  patch: HTTP.patch,
  delete: HTTP.delete,
  HTTP,
};
