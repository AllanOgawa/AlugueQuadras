# Para sincronizar os dados com o banco de dados devemos gerar sempre uma nova migracao com a atualizacao do banco de dados

```
npm run typeorm -- migration:generate src/database/typeorm/migrations/SyncWithExistingSchema -d src/database/typeorm/sync.ts
```

# Depois aplicamos 

```
npm run typeorm -- migration:run -d src/database/typeorm/sync.ts
```