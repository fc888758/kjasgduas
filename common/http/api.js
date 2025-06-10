import http from './index';
import { getBaseURL } from './config';

// 构建完整的API URL
const buildUrl = path => `${getBaseURL()}${path}`;

export default {
    // 上传接口
    uploadFile: filePath => http.upload(buildUrl('/upload'), filePath),
};
