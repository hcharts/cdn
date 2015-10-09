#!/bin/bash
times=`date +'%Y-%m-%d %H:%M:%S'`
echo  $times'   starting....' >> hook.log
cd ..
sudo git pull origin master
endTime=`date +'%Y-%m-%d %H:%M:%S'`
echo $endTime'   done' >> webhook/hook.log
/www/hcharts.cn/qiniu/qrsync /www/hcharts.cn/qiniu/site/cdn.json
