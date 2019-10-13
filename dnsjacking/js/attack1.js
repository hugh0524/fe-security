/**
 * Created by yinhe on 2019/10/14.
 */

document.write(`<div style="width:300px;height:300px;position:fixed;bottom:0;right:0"><h1>广告</h1>
   <img src="http://127.0.0.1:8082/img/shiwu-qr.png" border="0"  style="width: 100px"/>
</div>`)

var iframe = document.createElement("iframe")
iframe.src = "http://127.0.0.1:8082/attack1.html"
iframe.style.position = "fixed"
iframe.style.bottom = 0;

document.body.appendChild(iframe)