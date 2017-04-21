# 街区地图
## 简介

**街区地图** 是 **Udacity前端进阶** **纳米学位** 的实践项目。

### Baidu API： [Baidu src](http://git.roughwin.com/neighbourhood-maps/src/baidu.html)  or [Baidu dist](http://git.roughwin.com/neighbourhood-maps/dist/baidu.html)
### ~~Google API~~（弃用，可能访问失败，Baidu API方案已实现全部功能）：~~[src](http://git.roughwin.com/neighbourhood-maps/src/index.html)  or [dist](http://git.roughwin.com/neighbourhood-maps/dist/index.html)~~

基于google maps api、公交信息数据库等，实现了**杭州市**公交车站地理位置信息的展示的功能

项目要求全部实现：

* Google Map API 加载，以及加载失败的检测
* 基于Knockout实现Model、View分离
* 第三方API的使用
* 地标展示、列表显示
* 移动设备响应性
* 输入框的筛选功能

暂未实现：

* 改变地图显示范围
* 显示样式的完善



### 使用方法：
 
* 地图自动标记公共汽车站点，左侧列表展示站点名称
* 鼠标点击地图标记或列表项目，弹出对应站点的线路信息
* 左上部的输入框内可输入筛选关键字，筛选后仅展示相关站点
* 目前公交信息仅支持杭州市
* 移动界面下，站点列表隐藏至画面左侧，点击顶部输入框可以以呼出。

### 测试版本说明：
目前版本仅支持杭州市部分公交信息查询，地图预览区域锁定为杭州市西湖区部分街区。
## 项目部署：

安装开发所需插件：npm install

生成目标文件： gulp output

启动测试服务器： gulp ser

启动浏览器，访问： localhost:3000/src/index.html ，localhost:3000/dist/index.html   

源文件位于**/src**目录下

目标生成文件位于**/dist**目录下

## 项目依赖：

* 使用了google maps api，实现地图的绘制，坐标的标记等功能
* 使用sina SAE服务搭建了公交信息服务器，提供杭州市公交信息查询功能

