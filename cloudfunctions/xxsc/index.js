const getOpenId = require('./getOpenId/index');
const callSiliconflow = require('./callSiliconflow/index');

// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.type) {
        case 'getOpenId':
            return await getOpenId.main(event, context);
        case 'callSiliconflow':
            return await callSiliconflow.main(event, context);
        default:
            return {
                code: -1,
                msg: '无效云函数'
            };
    }
};

