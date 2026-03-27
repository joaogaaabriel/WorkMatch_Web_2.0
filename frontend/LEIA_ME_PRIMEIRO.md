# WorkMatch 2.0 — Instruções de instalação

## O que fazer com este zip

1. **Substitua** toda a pasta `frontend/src/` do seu projeto pelo conteúdo da pasta `src/` deste zip.

2. **Copie** os arquivos da raiz deste zip para a raiz do seu `frontend/`:
   - `.env`            → substitui o `.env` existente (dev local)
   - `.env.production` → substitui o `.env.production` existente
   - `vite.config.js`  → substitui o `vite.config.js` existente

3. **Mantenha** sem mexer:
   - `frontend/src/assets/`  (Logo.png, Ilustração.jpg, etc.)
   - `frontend/public/`
   - `frontend/index.html`
   - `frontend/package.json`
   - Todo o backend

4. **Delete** (opcional, não quebra se deixar):
   - `frontend/src/routes/index.jsx` (arquivo morto)
   - `frontend/src/App.css`
   - `frontend/src/index.css`

## Rodar em desenvolvimento

```bash
cd frontend
npm install   # só se nunca rodou antes
npm run dev
```

## Portas esperadas
- Frontend:   http://localhost:5173
- Backend:    http://localhost:8081
- Auth-serve: http://localhost:8082
- PostgreSQL:  localhost:5432

## Bugs corrigidos
Veja o arquivo BUGS_CORRIGIDOS.md para o detalhamento completo.
