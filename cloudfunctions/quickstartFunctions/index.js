const getOpenId = require('./getOpenId/index');
const insertRecord = require('./insertRecord/index');
const videoList = require('./videoList/index');

// 云函数入口函数
exports.main = async (event, context) => {

    // 直接调用 insertRecord 模块
    return await insertRecord.main(event, context);
};


// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.type) {
        case 'getOpenId':
            return await getOpenId.main(event, context);
        case 'insertRecord':
            return await insertRecord.main(event, context);
        case 'videoList':
            return await videoList.main(event, context);
        default:
            return {
                code: -1,
                msg: 'Unimplemented method'
            };
    }
};

