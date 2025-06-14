import http from './index';

export default {
    // 上传接口
    uploadFile: filePath => http.upload(filePath),
};
