# Toneo - Deploy & Production Checklist

> Documento para não esquecer o que falta antes/depois do deploy.

---

## 1. Arquitetura Alvo (Prod)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Vercel    │────▶│   FastAPI   │────▶│  Azure TTS  │
│  (Next.js)  │     │  (Railway)  │     │             │
│             │     │             │     └─────────────┘
│ toneo.app   │     │             │
└─────────────┘     └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌───▼───┐ ┌──────▼──────┐
       │  Supabase   │ │  R2   │ │   SQLite    │
       │  Auth + DB  │ │ Cache │ │  (CC-CEDICT)│
       └─────────────┘ └───────┘ └─────────────┘
```

---

## 2. Status Atual

### ✅ Feito
- [x] Frontend no Vercel (toneo.vercel.app)
- [x] SEO pages `/dict/[word]` com metadata + JSON-LD
- [x] Sitemap com 1249 palavras HSK 1-2
- [x] Rate limiting com proxy headers (X-Forwarded-For)
- [x] TTS com limite de 200 chars/request
- [x] Error handling genérico (não vaza internals)
- [x] CORS configurado para prod
- [x] DEBUG=false por padrão

### ❌ Falta para MVP
- [ ] Deploy backend no Railway
- [ ] Configurar env vars no Railway (AZURE_SPEECH_KEY, etc)
- [ ] Configurar BACKEND_URL no Vercel
- [ ] Testar fluxo completo em prod

### ❌ Falta para V1 (pós-MVP)
- [ ] Supabase Auth (login Google/Magic Link)
- [ ] TTS cache no Cloudflare R2
- [ ] Per-user quotas para TTS
- [ ] Métricas (PostHog ou similar)
- [ ] Sentry para error tracking

---

## 3. Env Vars Necessárias

### Backend (Railway)
```env
# Required
AZURE_SPEECH_KEY=xxx
AZURE_SPEECH_REGION=eastus

# Optional (defaults work)
DEBUG=false
CORS_ORIGINS=https://toneo.vercel.app
API_PREFIX=/api
```

### Frontend (Vercel)
```env
BACKEND_URL=https://toneo-api.railway.app
```

---

## 4. Deploy Steps

### 4.1 Backend (Railway)
```bash
# 1. Criar projeto no Railway
railway login
railway init

# 2. Linkar ao repo
railway link

# 3. Configurar env vars
railway variables set AZURE_SPEECH_KEY=xxx
railway variables set AZURE_SPEECH_REGION=eastus
railway variables set CORS_ORIGINS=https://toneo.vercel.app

# 4. Deploy
railway up
```

### 4.2 Frontend (Vercel)
```bash
# 1. Adicionar env var
vercel env add BACKEND_URL production
# Valor: URL do Railway

# 2. Redeploy
cd frontend && vercel --prod
```

---

## 5. Segurança

### ✅ Implementado
| Item | Onde |
|------|------|
| Rate limiting TTS (30/min) | `backend/app/routers/tts.py` |
| Rate limiting Analyze (60/min) | `backend/app/routers/analyze.py` |
| Proxy IP validation | `backend/app/core/rate_limit.py` |
| JSON-LD XSS escape | `frontend/src/app/dict/[word]/page.tsx` |
| Log truncation (20 chars max) | Routers |
| Text length limit (200 chars TTS) | `backend/app/routers/tts.py` |
| Generic error messages | All routers |
| CORS prod config | `backend/app/core/config.py` |

### ❌ TODO (antes de escalar)
| Item | Status | Onde |
|------|--------|------|
| TTS auth por usuário | ❌ TODO | `backend/app/routers/tts.py` |
| Per-user quotas | ❌ TODO | Supabase + middleware |
| TTS cache em R2 | ❌ TODO | `backend/app/services/tts.py` |

### ❌ TODO (pode esperar)
| Item | Status | Onde |
|------|--------|------|
| Signed TTS URLs | ❌ TODO | R2 presigned URLs |
| Request signing | ❌ TODO | HMAC ou JWT |
| Abuse detection | ❌ TODO | Logging + alertas |

---

## 6. Custos Estimados

### Azure TTS (Free Tier)
- 500k chars/mês grátis
- ~100k palavras chinesas
- Suficiente para MVP

### Railway
- $5/mês (hobby plan)
- Inclui 512MB RAM, 1GB disk

### Cloudflare R2
- 10GB grátis
- Suficiente para cache TTS

### Supabase
- Free tier: 500MB DB, 50k MAU
- Suficiente para MVP

**Total MVP: ~$5/mês**

---

## 7. Pós-Deploy Checklist

- [ ] Verificar https://toneo.vercel.app carrega
- [ ] Testar analyzer com texto chinês
- [ ] Testar TTS (áudio toca)
- [ ] Verificar `/dict/你好` renderiza
- [ ] Submeter sitemap no Google Search Console
- [ ] Submeter sitemap no Bing Webmaster
- [ ] Testar rate limit (30 req/min)
- [ ] Verificar logs no Railway

---

## 8. Rollback Plan

### Frontend
```bash
# Listar deploys anteriores
vercel ls

# Reverter para deploy específico
vercel rollback [deployment-url]
```

### Backend
```bash
# Railway mantém histórico
railway logs  # verificar erros
railway rollback  # volta para deploy anterior
```

---

## 9. Monitoramento (Futuro)

### Métricas Chave
| Métrica | Target | Tool |
|---------|--------|------|
| Uptime | 99.9% | Railway/Vercel |
| TTS latency | < 1s | PostHog |
| Error rate | < 1% | Sentry |
| Cache hit rate | > 80% | R2 metrics |

### Alertas Recomendados
- TTS quota > 80%
- Error rate > 5%
- Response time > 3s
- Deploy failed

---

*Última atualização: 2026-01-02*
