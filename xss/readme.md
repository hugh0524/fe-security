
# XSS 范例

** 前置: 切换目录到xss **

## utils
- encodeUtils  提供了编码转换相关功能

- views 用于结合后端渲染的案例
    - domXss 基于dom解析发生的xss
    - queryXss
    - queryXssClient  基于query string 的反射型xss

- index.js  用于启动一个服务


## 执行步骤
- 启动服务
    node index.js

- 访问特定页面


## xss 案例访问
localhost:3000/domXss/1


## encodeTest
测试 html js 自解码
