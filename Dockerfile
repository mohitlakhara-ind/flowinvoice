FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY . .
RUN npx prisma generate --schema=./prisma/schema.prisma || echo "No prisma schema"
RUN npm run build --if-present

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]
