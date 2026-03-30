FROM node:16-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY dist ./dist

ENV NODE_ENV=production
ENV TANKHUNT_PORT=8080

EXPOSE 8080

CMD ["node", "dist/server/app.js"]
