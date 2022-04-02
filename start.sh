WEB_PATH=$PWD

# 启动买家端PC端
cd $WEB_PATH/pc
pm2 delete buyer-pc
pm2 start npm --name "buyer-pc" -- run start

# 启动nginx
/usr/local/nginx/sbin/nginx -s reload
