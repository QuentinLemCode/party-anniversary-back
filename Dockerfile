FROM node:16-alpine3.14 as builder

ENV NODE_ENV build

WORKDIR /home/node

COPY package*.json ./
RUN npm i
COPY . /home/node
RUN npm run build \
    && npm prune --production

# ---

FROM arm32v6/node:16-alpine3.14

ENV NODE_ENV production
ENV TZ=Europe/Paris

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/

CMD ["node", "dist/main.js"]
EXPOSE 80