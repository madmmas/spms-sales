FROM node:lts AS frontend
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=frontend /build /etc/nginx/html