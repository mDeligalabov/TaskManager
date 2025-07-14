# Build Image
FROM node:18 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# Build Application Image
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
