# BUILDER

FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

COPY frontend/ ./frontend/

RUN npm install

RUN npm run build

# RUNNER

FROM node:22-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --only=production

COPY backend/ ./backend/

COPY --from=builder /usr/src/app/frontend/dist ./frontend/dist

EXPOSE 5100

CMD ["npm", "start"]