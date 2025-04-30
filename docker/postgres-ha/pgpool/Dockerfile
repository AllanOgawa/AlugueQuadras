FROM golang:1.22-bullseye

# Definir o ambiente para evitar prompts interativos
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
  wget \
  gnupg \
  lsb-release \
  ca-certificates \
  curl \
  vim \
  netcat \
  && rm -rf /var/lib/apt/lists/*

# Adicionar repositório do PostgreSQL
RUN sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

# Instalar o Pgpool-II e cliente PostgreSQL
RUN apt-get update && apt-get install -y --no-install-recommends \
  pgpool2 \
  libpgpool2 \
  postgresql-client-17 \
  postgresql-17-pgpool2 \
  && rm -rf /var/lib/apt/lists/*

# Instalar dependências do pgpool-exporter
RUN apt-get update && apt-get install -y --no-install-recommends \
  make \
  gcc \
  git \
  && rm -rf /var/lib/apt/lists/*

# Baixar e compilar o pgpool-exporter corretamente
RUN git clone https://github.com/pgpool/pgpool2_exporter.git /go/src/github.com/pgpool/pgpool2_exporter && \
  cd /go/src/github.com/pgpool/pgpool2_exporter && \
  make build && \
  mv pgpool2_exporter /usr/local/bin/

# Criar usuário e grupo pgpool
RUN groupadd -r pgpool && useradd -r -g pgpool pgpool && \
  usermod -aG postgres pgpool

# Criar diretórios e definir permissões
RUN mkdir -p /etc/pgpool2 /etc/pgpool2/tmp /etc/pgpool2/logs /var/log/postgresql /var/run/pgpool2/unix /var/run/pgpool2/pcp && \
  chown -R pgpool:pgpool /etc/pgpool2 /var/log/postgresql /var/run/pgpool2 && \
  chmod -R 750 /etc/pgpool2 /var/run/pgpool2

# Criar diretório para sockets do PostgreSQL
RUN mkdir -p /var/run/postgresql && chown postgres:postgres /var/run/postgresql && chmod 775 /var/run/postgresql

# Copiar arquivos de configuração
COPY ./config/ /etc/pgpool2/

RUN chown -R pgpool:pgpool /etc/pgpool2 && chmod -R 640 /etc/pgpool2/*.conf

# Definir usuário padrão
USER pgpool

EXPOSE 5432 9719

# Iniciar o pgpool-exporter e o Pgpool-II
CMD ["sh", "-c", "pgpool2_exporter -pgpool.addr=localhost:9898 -web.listen-address=:9719 & pgpool -n -f /etc/pgpool2/pgpool.conf"]

