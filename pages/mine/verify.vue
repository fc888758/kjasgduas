<template>
    <view class="verify-container">
        <!-- 认证表单 -->
        <view class="verify-form">
            <!-- 国籍选择 -->
            <view class="form-item">
                <text class="label">国籍</text>
                <view class="input-content">
                    <text>中国</text>
                </view>
            </view>

            <!-- 姓名输入 -->
            <view class="form-item">
                <text class="label">名字</text>
                <view class="input-content">
                    <input type="text" :disabled="auditType == 0 || auditType == 1 ? true : false" placeholder="请输入姓名"
                        v-model="formData.name" />
                </view>
            </view>

            <!-- 证件类型 -->
            <view class="form-item">
                <text class="label">证件类型</text>
                <view class="input-content">
                    <text>身份证</text>
                </view>
            </view>

            <!-- 证件号码 -->
            <view class="form-item">
                <text class="label">证件号</text>
                <view class="input-content">
                    <input type="text" :disabled="auditType == 0 || auditType == 1 ? true : false" placeholder="请输入证件号"
                        v-model="formData.number" />
                </view>
            </view>
        </view>

        <!-- 证件上传区域 -->
        <view class="upload-section">
            <view class="upload-title">请拍摄并上传您的身份证照片</view>
            <view class="upload-tip">请确认二代身份证有效，并且头像文字清晰，四角对齐，无反光，无遮挡</view>
            <view class="upload-area">
                <!-- 正面照片上传 -->
                <view class="upload-item" @click="uploadImage('front')">
                    <image v-if="front" :src="front" mode="aspectFit" class="preview-image">
                    </image>
                    <view v-else class="upload-placeholder">
                        <image src="/static/image/auth-idcard.png" mode="aspectFit" class="camera-icon"></image>
                    </view>
                    <text class="upload-text">点击上传身份证正件人像面</text>
                </view>
                <!-- 反面照片上传 -->
                <view class="upload-item" @click="uploadImage('back')">
                    <image v-if="back" :src="back" mode="aspectFit" class="preview-image">
                    </image>
                    <view v-else class="upload-placeholder">
                        <image src="/static/image/auth-gh.png" mode="aspectFit" class="camera-icon"></image>
                    </view>
                    <text class="upload-text">点击上传身份证国徽面</text>
                </view>
            </view>
        </view>
        <!-- 拒绝提示原因 -->
        <view class="remark" v-if="this.auditType == 2 && remark">
            失败原因<br>{{ remark }}
        </view>
        <!-- 提交按钮 -->
        <view class="submit-btn" @click="submitVerification">{{ submitText }}</view>
    </view>
</template>

<script>
import upload from '@/common/http/api.js'
export default {
    name: 'Verify',
    onShow() {
        this.getUserInfo()
    },
    data() {
        return {
            submitText: '提交',
            front: '',
            userInfo: null,
            back: '',
            remark: '',
            auditType: null,
            formData: {
                type: 0,
                name: '',
                number: '',
                front: '',
                back: '',
            },
        };
    },
    methods: {
        // 获取用户
        getUserInfo() {
            this.userInfo = uni.getStorageSync('userInfo');
            if (!this.userInfo) {
                this.$tab.redirectTo('/pages/home/index');
                return
            }
            this.$modal.loading('数据加载中...');
            this.getAuthentication();
            this.$modal.closeLoading();
        },
        getAuthentication() {
            this.$api.getAuthentication().then(res => {
                if (res) {
                    this.auditType = res.review;
                    this.remark = res.remark;
                    this.formData.name = res.name;
                    this.formData.number = res.number;
                    // this.formData.front = res.front_image;
                    // this.formData.back = res.back_image;
                    if (this.auditType == 0) {
                        this.front = res.front_image;
                        this.back = res.back_image;
                        this.submitText = '审核中';
                    } else if (this.auditType == 1) {
                        this.front = res.front_image;
                        this.back = res.back_image;
                        this.submitText = '认证成功';
                    } else if (this.auditType == 2) {
                        this.submitText = '重新提交';
                    }
                }

            });
        },
        uploadImage(type) {
            if (this.auditType == 0 || this.auditType == 1) {
                return false;
            }
            uni.chooseImage({
                count: 1,
                success: async res => {
                    // 显示加载提示
                    this.$modal.loading('上传中...');
                    const retData = await upload.uploadFile({ filePath: res.tempFilePaths[0] })
                    if (retData.url) {
                        if (type === 'front') {
                            this.front = res.tempFilePaths[0];
                            this.formData.front = retData.url;
                        } else {
                            this.back = res.tempFilePaths[0];
                            this.formData.back = retData.url;
                        }
                        this.$modal.msg('图片上传成功');
                    } else {
                        this.$modal.msg(retData);
                    }

                }
            });
        },
        submitVerification() {
            if (this.auditType == 0 || this.auditType == 1) {
                return false;
            }
            // 表单验证和提交逻辑
            if (
                !this.formData.name ||
                !this.formData.number ||
                !this.formData.front ||
                !this.formData.back
            ) {
                this.$modal.msgError('请填写完整信息');
                return;
            }
            this.$api.submitAuthentication(this.formData).then(res => {
                this.getAuthentication();
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.verify-container {
    background-color: #f5f5f5;

    .nav-bar {
        display: flex;
        align-items: center;
        padding: 60rpx 40rpx 20rpx;
        background-color: #fff;

        .back-icon {
            image {
                width: 40rpx;
                height: 40rpx;
            }
        }

        .title {
            flex: 1;
            text-align: center;
            font-size: 32rpx;
            font-weight: 500;
            margin-right: 40rpx;
        }
    }

    .verify-form {
        background-color: #fff;

        .form-item {
            display: flex;
            align-items: center;
            padding: 30rpx;
            border-bottom: 1rpx solid #f5f5f5;

            .label {
                width: 140rpx;
                font-size: 28rpx;
                color: #333;
            }

            .input-content {
                flex: 1;
                font-size: 28rpx;

                input {
                    width: 100%;
                }
            }
        }
    }

    .upload-section {
        margin-top: 20rpx;
        padding: 30rpx;

        .upload-title {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 20rpx;
        }

        .upload-tip {
            font-size: 24rpx;
            color: #999;
            margin-bottom: 30rpx;
        }

        .upload-area {
            display: flex;
            justify-content: space-between;

            .upload-item {
                width: 320rpx;

                .upload-placeholder {
                    width: 100%;
                    height: 200rpx;
                    background-color: #fff;
                    border: 2rpx dashed #ddd;
                    border-radius: 8rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .camera-icon {
                        width: 260rpx;
                        height: 200rpx;
                    }
                }

                .preview-image {
                    width: 100%;
                    height: 200rpx;
                    border-radius: 8rpx;
                }

                .upload-text {
                    font-size: 24rpx;
                    color: #666;
                    text-align: center;
                    margin-top: 20rpx;
                }
            }
        }
    }

    .remark {
        background-color: #fff;
        color: red;
        padding-top: 20rpx;
        padding-bottom: 20rpx;
        text-align: center;
        font-size: 48rpx;
    }

    .submit-btn {
        position: fixed;
        bottom: 40rpx;
        left: 30rpx;
        right: 30rpx;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        background-color: #f9ae3d;
        color: #fff;
        font-size: 32rpx;
        border-radius: 44rpx;
    }
}
</style>
