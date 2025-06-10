<template>
    <view class="verify-container">
        <!-- 顶部导航栏 -->
        <!--<view class="nav-bar">
            <view class="back-icon" @click="goBack">
                <image src="/static/icon/back.png" mode="aspectFit"></image>
            </view>
            <text class="title">实名认证</text>
        </view>-->

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
                    <input type="text" placeholder="请输入姓名" v-model="formData.name" />
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
                    <input type="text" placeholder="请输入证件号" v-model="formData.idNumber" />
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
                    <image
                        v-if="formData.frontImage"
                        :src="formData.frontImage"
                        mode="aspectFit"
                        class="preview-image"
                    ></image>
                    <view v-else class="upload-placeholder">
                        <image src="/static/image/auth-idcard.png" mode="aspectFit" class="camera-icon"></image>
                    </view>
                    <text class="upload-text">点击上传身份证正件人像面</text>
                </view>
                <!-- 反面照片上传 -->
                <view class="upload-item" @click="uploadImage('back')">
                    <image
                        v-if="formData.backImage"
                        :src="formData.backImage"
                        mode="aspectFit"
                        class="preview-image"
                    ></image>
                    <view v-else class="upload-placeholder">
                        <image src="/static/image/auth-gh.png" mode="aspectFit" class="camera-icon"></image>
                    </view>
                    <text class="upload-text">点击上传身份证国徽面</text>
                </view>
            </view>
        </view>

        <!-- 提交按钮 -->
        <view class="submit-btn" @click="submitVerification">提交</view>
    </view>
</template>

<script>
    export default {
        name: 'Verify',
        data() {
            return {
                formData: {
                    name: '',
                    idNumber: '',
                    frontImage: '',
                    backImage: '',
                },
            };
        },
        methods: {
            goBack() {
                uni.navigateBack();
            },
            uploadImage(type) {
                uni.chooseImage({
                    count: 1,
                    success: res => {
                        if (type === 'front') {
                            this.formData.frontImage = res.tempFilePaths[0];
                        } else {
                            this.formData.backImage = res.tempFilePaths[0];
                        }
                    },
                });
            },
            submitVerification() {
                // 表单验证和提交逻辑
                if (
                    !this.formData.name ||
                    !this.formData.idNumber ||
                    !this.formData.frontImage ||
                    !this.formData.backImage
                ) {
                    uni.showToast({
                        title: '请填写完整信息',
                        icon: 'none',
                    });
                    return;
                }
                // TODO: 调用实名认证接口
            },
        },
    };
</script>

<style lang="scss" scoped>
    .verify-container {
        min-height: 100vh;
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
            margin-top: 20rpx;

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

        .submit-btn {
            position: fixed;
            bottom: 40rpx;
            left: 30rpx;
            right: 30rpx;
            height: 88rpx;
            line-height: 88rpx;
            text-align: center;
            background-color: #e6b088;
            color: #fff;
            font-size: 32rpx;
            border-radius: 44rpx;
        }
    }
</style>
