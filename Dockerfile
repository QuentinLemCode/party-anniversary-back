ARG ARCH=arm32v6
FROM ${ARCH}/alpine as builder

RUN apk add --update nodejs npm
RUN addgroup -S node && adduser -S node -G node
USER node
RUN mkdir -p /home/node

ENV NODE_ENV build

WORKDIR /home/node
COPY package*.json ./
RUN npm i
COPY . /home/node
RUN npm run build \
    && npm prune --production
# ---

FROM ${ARCH}/alpine

RUN apk add --update nodejs npm
RUN addgroup -S node && adduser -S node -G node

ENV NODE_ENV production

USER node
RUN mkdir -p /home/node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/

CMD ["node", "dist/main.js"]
EXPOSE 80
