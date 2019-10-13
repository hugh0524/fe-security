
## clickjacking

### iframe
x-frame-option


### usage
node index.js

### test
分别测试同域加载和不同于加载


### 测试dropjacking, 需要在ie9以下或ff低版本下
http-server ./ -p 8081
http-server ./ -p 8082
启动两个地址以测试不同源

