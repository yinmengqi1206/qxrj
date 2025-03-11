const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 插入记录云函数入口函数
exports.main = async (event, context) => {
    const { payload } = event;

    // 验证 payload 是否包含必要字段
    if (!payload || !payload.text || !payload.ratio) {
        throw new Error('Invalid payload: Missing required fields');
    }

    try {
        // 插入记录到数据库
        const result = await db.collection('xxsc').add({
            data: {
                open_id: cloud.getWXContext().OPENID, // 新增：用户唯一标识符
                text: payload.text,
                ratio: payload.ratio,
                status: 0, // 新增：初始状态为生成中
                url: '', // 新增：视频链接，默认为空
                fail_reason: '', // 新增：失败原因，默认为空
                create_time: new Date().toISOString(), // 新增：创建时间
                update_time: new Date().toISOString() // 新增：更新时间
            }
        });

        return {
            success: true,
            recordId: result._id
        };
    } catch (error) {
        console.error('插入记录失败:', error);
        throw new Error('Failed to insert record');
    }
};