# TODO: Multistage build
FROM node

WORKDIR /app
RUN npm install --global serve

COPY . .

RUN npm install
ARG VITE_APP_BACKEND
RUN npm run build-only

CMD ["serve", "dist/"]

