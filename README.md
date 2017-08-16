# bugReport
内部bug 上报

## 安装
> npm install bugreport

## 使用
* 配置
``` 
var report=require('bugreport')
report.config({
    reportUrl: '' //上报的URL,
    port:500 // 在服务使用,需要配置服务端的端口号
})

```
* 上报
```
暂时去除手动上报
report.report(msg)
```