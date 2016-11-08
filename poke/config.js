var Config = {
    site:{
        title:'前端社区',
        description:'用Coding创造财富',
        version:'1.0',
    },
    db:{
        cookieSecret:'frontendblog',
        name:'wechat',
        host:'localhost',
        url:'mongodb://127.0.0.1:27017/blog'
    },
    site: {
        path:'',
        pagesize: 8
    }
};
module.exports = Config;