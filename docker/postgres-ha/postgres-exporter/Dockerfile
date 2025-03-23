FROM alpine:3.18

RUN apk add --no-cache \
  curl \
  tar \
  libc6-compat

# Baixe e instale o postgres_exporter
RUN curl -L -o /tmp/postgres_exporter.tar.gz https://github.com/prometheus-community/postgres_exporter/releases/download/v0.17.1/postgres_exporter-0.17.1.linux-amd64.tar.gz \
  && tar -xzf /tmp/postgres_exporter.tar.gz -C /tmp/ \
  && mv /tmp/postgres_exporter-0.17.1.linux-amd64/postgres_exporter /usr/local/bin/postgres_exporter \
  && chmod +x /usr/local/bin/postgres_exporter \
  && rm -rf /tmp/postgres_exporter.tar.gz /tmp/postgres_exporter-0.17.1.linux-amd64

# Crie um diretório para configurações
RUN mkdir -p /etc/postgres_exporter

# Copie o arquivo de configuração (opcional)
COPY postgres_exporter.yml /etc/postgres_exporter/config.yml

EXPOSE 9187

# Comando para iniciar o postgres_exporter com suporte a multi-target
CMD ["postgres_exporter", "--config.file=/etc/postgres_exporter/config.yml"]