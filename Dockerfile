FROM node:22-alpine3.19 as build-deps
WORKDIR /app
COPY ./ ./
RUN npm install
RUN npm run build

# Nginx
FROM nginx:stable-alpine3.17
COPY --from=build-deps /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]