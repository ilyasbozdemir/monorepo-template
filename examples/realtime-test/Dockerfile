# ---- Base image ----
FROM elixir:1.16-alpine AS build

# Hex + Rebar yükle
RUN mix do local.hex --force, local.rebar --force

# NodeJS (Tailwind için) ekle
RUN apk add --no-cache nodejs npm git build-base

WORKDIR /app

# mix.exs ve mix.lock dosyalarını kopyala
COPY mix.exs mix.lock ./
COPY config config

# Bağımlılıkları indir
RUN mix deps.get --only prod
RUN MIX_ENV=prod mix deps.compile

# Assets kopyala ve derle
COPY assets assets
RUN cd assets && npm install && npm run build

# Kaynak kodları kopyala
COPY lib lib
COPY priv priv

# Prod sürümünü derle
RUN MIX_ENV=prod mix compile

# ---- Release image ----
FROM elixir:1.16-alpine AS release

WORKDIR /app

# Build aşamasından release al
COPY --from=build /app/_build/prod/rel/realtime_server ./

# Port
EXPOSE 4000

# Çalıştır
ENTRYPOINT ["bin/realtime_server"]
CMD ["start"]
