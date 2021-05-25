
FROM node:12.18.1
ENV NODE_ENV=production

# RUN npm install --production

# RUN npm run build

RUN mkdir -p /root/nodeapps/config-manage

COPY ["package.json", "package-lock.json*", "ecosystem.config.js", "./dist", "/root/nodeapps/config-manage/"]

WORKDIR /root/nodeapps/config-manage

RUN npm install

RUN npm install -g pm2

CMD [ "pm2-runtime", "start", "./ecosystem.config.js" ]