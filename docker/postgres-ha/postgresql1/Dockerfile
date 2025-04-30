FROM postgres:17

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    libpq-dev \
    git \
    build-essential \
    curl \
    unzip \
    kmod \
    watchdog \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --root-user-action=ignore --break-system-packages --verbose \
    patroni[etcd] \
    psycopg[binary] \
    psycopg2 \
    psycopg2-binary

RUN mkdir -p /etc/patroni /etc/patroni/logs /scripts 

COPY patroni.yml /etc/patroni/patroni.yml
COPY scripts/ /scripts/

RUN chmod +x /scripts/init.sh
RUN chown postgres:postgres /scripts/init.sh

RUN chown -R postgres:postgres /etc/patroni/logs && chmod -R 755 /etc/patroni/logs

USER postgres

EXPOSE 5433 8008

CMD ["sh", "-c", "patroni /etc/patroni/patroni.yml"]

