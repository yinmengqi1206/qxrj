const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 插入记录云函数入口函数
exports.main = async (event, context) => {
    try{
        const open_id = cloud.getWXContext().OPENID;
        let res = await db.collection('xxsc')
        .where({
            open_id: open_id
        })  
        .orderBy('create_time', 'desc')
        .get();
        return {
            success: true,
            data: res.data
        }
    }catch(e){
        return {
            success: false,
            errMsg: e
        }
    }
};