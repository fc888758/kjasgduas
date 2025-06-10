<template>
	<view class="financial-records-container">
		<!-- 顶部标签页 -->
		<view class="tabs-container">
			<view class="tabs">
				<view class="tabs-item" :class="{ 'tabs-item-active': activeIndex === index }" @click="changeTab(index)"
					v-for="(item, index) in tabs" :key="index">
					{{ item.name }}
				</view>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-container">
			<!-- 无数据提示 -->
			<view class="no-data">
				<text>暂无数据</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'FinancialRecords',
	data() {
		return {
			tabs: [
				{
					id: 0,
					name: '资金明细'
				},
				{
					id: 1,
					name: '转入记录'
				},
				{
					id: 2,
					name: '转出记录'
				},
			],
			activeIndex: 0
		};
	},
	methods: {
		// 切换标签
		changeTab(index) {
			this.activeIndex = index;
		},
		// 返回上一页
		goBack() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
.financial-records-container {
	background-color: #f5f5f5;
	height: 100vh;
	display: flex;
	flex-direction: column;
}

.tabs-container {
	background: linear-gradient(180deg, #ffe2a8, #dfb87e);
	padding: 18rpx 25rpx 25rpx;
}

.tabs {
	display: flex;
	justify-content: space-between;

	.tabs-item {
		width: 30%;
		text-align: center;
		color: #666;
		font-size: 30rpx;
		padding: 8px 0;
		position: relative;
		cursor: pointer;
	}

	.tabs-item-active {
		color: #a86400;
		font-weight: 400;
		background-color: #fff;
		border-radius: 40rpx;
		border: 1px solid #a86400;
	}
}

.content-container {
	flex: 1;
	overflow-y: auto;
	background-color: #fff;
}

.no-data {
	text-align: center;
	padding: 30rpx 0;
	color: #999;
}

.list-box {
	background-color: #fff;
}

.list-item {
	padding: 15rpx 5%;
	border-bottom: 1px solid #f3f3f3;

	.space-between {
		.t1 {
			font-weight: 700;
		}
	}

	.time {
		margin: 12rpx 0;
		color: #666;
		font-size: 13px;
	}
}

.record-item {
	.flex-vcenter {
		display: flex;
		align-items: center;
		margin-bottom: 8px;

		.label {
			width: 120rpx;
			color: #666;
		}
	}

	.red {
		color: #fb4e50;
	}

	.green {
		color: #4cd964;
	}

	.blue {
		color: #007aff;
	}
}
</style>