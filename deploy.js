require('dotenv').config()
const deploy = require('ali-oss-deploy')

deploy({
  path: '../dist', // 静态资源目录
  ossConfig: {
    // oss配置参数
    region: process.env.OSS_REGION, //地区
    accessKeyId: process.env.OSS_KEY,
    accessKeySecret: process.env.OSS_SECRET
  },
  bucket: {
    pro: {
      name: process.env.OSS_BUCKET, // bucket name
      refreshPath: '', //可选，deploy后刷新缓存，必需保证url正确
      projectPath: process.env.OSS_PROJECT_PRO
    },
    test: {
      name: process.env.OSS_BUCKET,
      projectPath: process.env.OSS_PROJECT_TEST //可选，添加项目文件夹(需修改webpack的baseUrl,以保证资源文件路径正确)，不填默认为空
    }
  }
})
