# bugReport
内部bug 上报

## 安装
> npm install bugreport

## 配置
> var report=require('bugreport');
> report.config({
    reportUrl: '' //上报的URL
})

### 手动上报
> report.report(msg)