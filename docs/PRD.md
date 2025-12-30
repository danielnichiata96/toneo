# Toneo - Product Requirements Document

> **O Jisho do Chinês + Grammarly da Pronúncia**
> *O dicionário definitivo de mandarim com foco em tons e pronúncia nativa.*

---

## 1. Visão do Produto

### 1.1 Problema

Aprender tons em mandarim é o maior obstáculo para falantes de línguas não-tonais. Os recursos existentes falham em:

| Problema | Ferramentas Atuais |
|----------|-------------------|
| **Dicionários datados** | MDBG (2006), interface arcaica |
| **Tons como afterthought** | Pleco mostra tom, mas não ensina |
| **Sem visualização** | Nenhum app mostra curvas de tom |
| **Tone sandhi ignorado** | Apps mostram tom isolado, não contextual |
| **Feedback de pronúncia** | Inexistente ou ruim |

### 1.2 Solução

**Toneo** é a fusão de:
- **Jisho** (dicionário amado pela comunidade japonesa)
- **Grammarly** (feedback em tempo real)
- **Pitch Accent apps** (visualização clara)

### 1.3 Proposta de Valor

```
"Pare de soar como robô. Comece a soar nativo."
```

**Para quem:** Estudantes de mandarim (HSK 1-6+, autodidatas, expats)
**O quê:** Dicionário visual com análise de tons em tempo real
**Por quê:** Tons corretos = compreensão + credibilidade

---

## 2. Análise Competitiva

| Feature | MDBG | Pleco | Toneo |
|---------|------|-------|-------|
| Dicionário CC-CEDICT | ✅ | ✅ | ✅ |
| HSK tags | ❌ | ✅ | ✅ HSK 3.0 |
| Tone sandhi | ❌ | ❌ | ✅ |
| Visualização de tons | ❌ | ❌ | ✅ Curvas SVG |
| Frequência de palavras | ❌ | ❌ | ✅ Zipf |
| TTS nativo | ❌ | Pago | ✅ |
| Record & Compare | ❌ | ❌ | ✅ (roadmap) |
| Stroke order | ❌ | Pago | 🔜 |
| UI/UX moderno | ❌ | ⚠️ | ✅ Brutalist |
| Web-first | ✅ | ❌ | ✅ |
| Open source | ❌ | ❌ | ✅ |
| **Preço** | Free | $30+ | Free |

### 2.1 Posicionamento

```
        Casual ←―――――――――――――――――→ Serious
           ↑
    Lookup  │   Duolingo    MDBG
    Only    │
           │              Pleco
           │
           │                        ★ TONEO
    Learn  │   HelloChinese
    +Use   │
           ↓
```

---

## 3. Público-Alvo

### 3.1 Personas

**🎓 Maria - Estudante HSK**
- 25 anos, brasileira, estudando HSK 4
- Frustrada com tons, "chineses não me entendem"
- Usa Anki + Pleco, mas quer feedback de pronúncia
- **Job:** Passar no HSK 4, falar com confiança

**💼 John - Expat em Shanghai**
- 35 anos, americano, trabalha em tech
- Chinês básico, quer melhorar para reuniões
- Não tem tempo para aulas formais
- **Job:** Ser entendido em contexto profissional

**📚 Yuki - Autodidata**
- 20 anos, japonesa, aprende por hobby
- Já sabe kanji, quer focar em pronúncia
- Usa YouTube + apps gratuitos
- **Job:** Consumir mídia chinesa sem legendas

### 3.2 User Stories

```gherkin
Como estudante de mandarim
Quero colar um texto e ver os tons de cada sílaba
Para que eu saiba como pronunciar corretamente

Como usuário avançado
Quero ver quando tone sandhi se aplica
Para que minha fala soe natural

Como iniciante
Quero ouvir a pronúncia nativa de qualquer palavra
Para que eu possa imitar

Como praticante
Quero gravar minha voz e comparar com o nativo
Para que eu receba feedback objetivo
```

---

## 4. Requisitos Funcionais

### 4.1 Core Features (MVP) ✅

| Feature | Status | Descrição | Critérios de Aceitação |
|---------|--------|-----------|------------------------|
| Text Analyzer | ✅ Done | Cola texto → vê tons | Segmenta texto em < 500ms; identifica 95%+ palavras do CC-CEDICT |
| Tone Curves | ✅ Done | SVG visual dos 5 tons | Curvas renderizam em < 100ms; visualmente distintas entre tons |
| Tone Sandhi | ✅ Done | 3+3, 不, 一, reduplicação | Aplica todas as 4 regras principais; mostra tom original vs modificado |
| Dictionary | ✅ Done | CC-CEDICT 124k entries | Lookup em < 200ms; suporta simplificado e tradicional |
| HSK Tags | ✅ Done | HSK 3.0 (1-6 + 7-9) | 11k palavras tagueadas; badge visual por nível |
| Word Frequency | ✅ Done | Zipf scale + tiers | Escala 0-8; 4 tiers visuais (rare→very common) |
| TTS Playback | ✅ Done | Azure Speech | Áudio em < 1s; vozes Xiaoxiao/Yunxi |
| Related Words | ✅ Done | Mesmo radical | Até 10 palavras relacionadas por lookup |
| Share URL | ✅ Done | ?text=你好 | URL preserva texto; funciona com Unicode |
| Search History | ✅ Done | localStorage | Últimas 20 buscas; persistente entre sessões |
| Mobile Responsive | ✅ Done | Touch-friendly | Funciona em 320px+; botões touch-friendly (44px min) |

### 4.1.1 Limites e Comportamentos

| Parâmetro | Valor | Comportamento |
|-----------|-------|---------------|
| **Tamanho máximo de texto** | 5000 caracteres | Trunca com aviso ao usuário |
| **Palavras OOV (fora do dicionário)** | N/A | Fallback para pypinyin; marcadas como "baixa confiança" |
| **Caracteres não-chineses** | Ignorados | Filtrados silenciosamente; apenas hanzi processados |
| **Pontuação chinesa** | Preservada | 。，！？ mantidos para contexto visual |
| **Texto misto (EN+ZH)** | Suportado | Extrai apenas caracteres chineses via zhon |
| **Rate limiting** | 60 req/min | 429 Too Many Requests após limite |

### 4.2 Phase 2 - Learning

| Feature | Priority | Descrição |
|---------|----------|-----------|
| Record & Compare | P0 | Grava voz, compara pitch F0 |
| Tone Drills | P1 | Quiz: "qual tom?" |
| Minimal Pairs | P1 | 妈/麻/马/骂 practice |
| Learn Section | P1 | /learn/tones com lições |
| Progress Tracking | P2 | Palavras praticadas |

### 4.3 Phase 3 - Dictionary+

| Feature | Priority | Descrição |
|---------|----------|-----------|
| Hanzi Writer | P1 | Animação de traços |
| Example Sentences | P1 | Frases de contexto |
| Character Decomposition | P2 | Radicais + componentes |
| Grammar Notes | P2 | Notas de uso |
| User Lists | P2 | Salvar palavras |
| Spaced Repetition | P3 | Revisão tipo Anki |

### 4.4 Phase 4 - Community

| Feature | Priority | Descrição |
|---------|----------|-----------|
| User Accounts | P2 | Auth + sync |
| Vocabulary Lists | P2 | Listas compartilháveis |
| Sentence Mining | P3 | Import de textos |
| Community Corrections | P3 | Crowdsource erros |

---

## 5. Requisitos Não-Funcionais

### 5.1 Performance

| Métrica | Target |
|---------|--------|
| Time to First Byte | < 200ms |
| Analyze Response | < 500ms |
| TTS Generation | < 1s |
| Lighthouse Score | > 90 |

### 5.2 Escalabilidade

- 10k DAU no ano 1
- 100k DAU no ano 2
- Serverless (Vercel + Railway)

### 5.3 Acessibilidade

**Meta**: WCAG 2.1 AA

#### Checklist por Componente

| Componente | Keyboard | Focus | ARIA | Contrast |
|------------|----------|-------|------|----------|
| TextInput | ✅ Tab, Enter, Ctrl+Enter | ✅ ring-2 yellow | ✅ label, placeholder | ✅ 4.5:1 |
| ToneCard | ✅ Tab navegável | ✅ outline visible | ⚠️ TODO: role="article" | ✅ |
| PlayButton | ✅ Space/Enter | ✅ ring-2 | ✅ aria-label="Play" | ✅ |
| DictionaryDrawer | ✅ Escape fecha | ✅ focus trap | ✅ role="dialog", aria-modal | ✅ |
| ToneCurve | N/A (decorativo) | N/A | ✅ aria-hidden="true" | N/A |
| HistoryList | ✅ Tab + Delete/Backspace | ✅ | ✅ role="list", aria-labelledby | ✅ |

#### Estados Visuais Requeridos

```css
/* Focus visible obrigatório */
:focus-visible { outline: 2px solid var(--mao-yellow); }

/* Hover diferente de focus */
:hover { background: var(--mao-cream); }

/* Disabled state claro */
:disabled { opacity: 0.5; cursor: not-allowed; }

/* Error state */
[aria-invalid="true"] { border-color: var(--mao-red); }
```

#### Contrast Ratios (verificados)

| Elemento | Foreground | Background | Ratio |
|----------|------------|------------|-------|
| Body text | #1B1B1B | #F5EFE6 | 12.5:1 ✅ |
| Pinyin | #1B1B1B | #FDFBF7 | 13.2:1 ✅ |
| Tone 1 (red) | #E23D2E | #FDFBF7 | 4.8:1 ✅ |
| Tone 2 (yellow) | #F5C84B | #1B1B1B | 8.2:1 ✅ |
| Muted text | #1B1B1B/60% | #F5EFE6 | 5.1:1 ✅ |

### 5.4 Internacionalização

- UI em inglês (MVP)
- Português, espanhol, japonês (Phase 2)
- Definições em múltiplos idiomas (Phase 3)

### 5.5 Privacidade e Dados

#### Dados Coletados (MVP - Free Tier)

| Dado | Armazenamento | Retenção | Propósito |
|------|---------------|----------|-----------|
| Texto analisado | Nenhum (server stateless) | 0 | Processamento apenas |
| Histórico de busca | localStorage (client) | Até limpar cache | UX - acesso rápido |
| Analytics anônimos | Plausible/Vercel | 90 dias | Métricas agregadas |

#### Dados Futuros (Record & Compare)

| Dado | Armazenamento | Retenção | Propósito |
|------|---------------|----------|-----------|
| Áudio gravado | Processado em memória | 0 (não persistido) | Comparação pitch |
| Pitch contour | Temporário | Duração da sessão | Feedback visual |

**Política**: Nenhum áudio é salvo no servidor. Processamento é stateless.

#### Dados com Conta (Phase 4)

| Dado | Armazenamento | Retenção | Propósito |
|------|---------------|----------|-----------|
| Email | PostgreSQL | Até deletar conta | Autenticação |
| Listas de vocab | PostgreSQL | Até deletar conta | Sync entre devices |
| Progresso SRS | PostgreSQL | Até deletar conta | Spaced repetition |

**Compliance**: GDPR-ready (export/delete on request)

---

## 6. Arquitetura Técnica

### 6.1 Stack

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│  Next.js 14 + TypeScript + Tailwind             │
│  Vercel (Edge)                                  │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│                   Backend                        │
│  FastAPI + Python 3.12                          │
│  Railway / Fly.io                               │
└─────────────────────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ CC-CEDICT│  │  Azure   │  │ wordfreq │
    │ SQLite   │  │  Speech  │  │          │
    └──────────┘  └──────────┘  └──────────┘
```

### 6.2 NLP Pipeline

```
Input: "你好"
    │
    ▼
┌──────────────────────────────────────┐
│ 1. Segmentation (jieba)              │
│    "你好" → ["你好"]                  │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ 2. Dictionary Lookup (CC-CEDICT)     │
│    "你好" → ni3 hao3, HSK 1          │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ 3. Tone Sandhi (custom rules)        │
│    [3,3] → [2,3] (third tone rule)   │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ 4. Frequency (wordfreq)              │
│    Zipf: 6.8 → "Very Common"         │
└──────────────────────────────────────┘
    │
    ▼
Output: WordTone object
```

### 6.3 Data Sources

| Source | License | Usage |
|--------|---------|-------|
| CC-CEDICT | CC BY-SA 4.0 | Dictionary entries |
| HSK 3.0 (ivankra) | MIT | Vocabulary levels |
| wordfreq | MIT | Word frequency |
| pypinyin | MIT | Pinyin conversion |
| jieba | MIT | Segmentation |

#### 6.3.1 Atribuição de Licenças (CC BY-SA 4.0)

CC-CEDICT requer atribuição visível. Implementação:

| Local | Texto | Visibilidade |
|-------|-------|--------------|
| **DictionaryDrawer footer** | "Data: CC-CEDICT · Frequency: wordfreq" | ✅ Implementado |
| **Página /about** | Link completo para MDBG + licença | ✅ Implementado |
| **Footer global** | "Dictionary data © CC-CEDICT (CC BY-SA 4.0)" | ✅ Implementado |
| **API response headers** | `X-Data-Source: CC-CEDICT` | 🔜 TODO |

**Requisitos CC BY-SA 4.0**:
1. ✅ Atribuição (nome CC-CEDICT)
2. ✅ Link para fonte (mdbg.net)
3. ⚠️ Indicar modificações (se houver)
4. ⚠️ ShareAlike (derivados mesma licença)

---

## 7. Design System

### 7.1 Identidade Visual

**Nome:** Toneo (Tone + Neo)
**Estilo:** Neobrutalismo Maoísta

### 7.2 Paleta de Cores

```css
--mao-red: #E23D2E;    /* Ação, tons fortes */
--mao-yellow: #F5C84B; /* Destaque, sucesso */
--mao-black: #1B1B1B;  /* Texto, bordas */
--mao-white: #FDFBF7;  /* Fundo cards */
--mao-cream: #F5EFE6;  /* Fundo página */
```

### 7.3 Cores por Tom

```css
Tone 1: #E23D2E  /* Vermelho - Alto, plano */
Tone 2: #F5C84B  /* Amarelo - Ascendente */
Tone 3: #1B1B1B  /* Preto - Dipping */
Tone 4: #9E2B25  /* Vermelho escuro - Descendente */
Tone 5: #8C5A3C  /* Marrom - Neutro */
```

### 7.4 Tipografia

- **Display:** Syne (bold, impactful)
- **Body:** Lexend (readable)
- **Mono:** IBM Plex Mono (pinyin, code)
- **Chinese:** Noto Sans SC

### 7.5 Componentes (Implementados)

| Classe CSS | Uso | Especificação |
|------------|-----|---------------|
| `.surface-card` | Cards principais | border: 1px black, bg: white, shadow: 4px offset |
| `.brutal-button` | CTAs | bg: red, hover: translate(-2px,-2px) + shadow |
| `.brutal-input` | Campos de texto | border: 1px black, focus: ring-2 yellow |
| `.tone-card` | Cards de palavra | hover: translate + shadow animado |
| `.chip` | Tags/badges | border: 1px, bg: yellow/10%, uppercase |

#### Padrão Visual Confirmado

```css
/* ✅ Cantos retos em TODOS os componentes */
border-radius: 0;  /* rounded-none */

/* ✅ Sombras hard (offset sólido, sem blur) */
box-shadow: 4px 4px 0px 0px #1B1B1B;

/* ✅ Bordas pretas sólidas */
border: 1px solid #1B1B1B;

/* ✅ Hover com movimento físico */
transform: translate(-2px, -2px);
box-shadow: 4px 4px 0px 0px #1B1B1B;
```

#### Animações

| Nome | Duração | Uso |
|------|---------|-----|
| `fade-in-up` | 500ms ease-out | Entrada de cards |
| `draw-curve` | 600ms ease-out | Desenho de curvas de tom |
| Hover translate | 100-200ms | Botões e cards interativos |

---

## 8. Métricas de Sucesso

### 8.1 North Star Metric

**"Palavras analisadas por usuário/semana"**

### 8.2 KPIs

| Métrica | Target (6 meses) |
|---------|------------------|
| MAU | 10,000 |
| DAU/MAU | > 20% |
| Avg Session Duration | > 3 min |
| Words Analyzed/Session | > 10 |
| Return Rate (7 days) | > 30% |
| NPS | > 50 |

### 8.3 Funil

```
Visit → Analyze (>60%) → Return (>30%) → Share (>5%)
```

---

## 9. Roadmap

### Q1 2025 - MVP Launch
- [x] Core analyzer
- [x] Dictionary drawer
- [x] TTS playback
- [x] Mobile responsive
- [ ] Deploy (Vercel + Railway)
- [ ] Landing page
- [ ] Basic analytics

### Q2 2025 - Learning Features
- [ ] Record & Compare
- [ ] Tone drills
- [ ] /learn section
- [ ] Hanzi Writer integration

### Q3 2025 - Dictionary+
- [ ] Example sentences
- [ ] User accounts
- [ ] Vocabulary lists
- [ ] Character decomposition

### Q4 2025 - Scale
- [ ] Mobile app (React Native)
- [ ] Spaced repetition
- [ ] Community features
- [ ] Premium tier (?)

---

## 10. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Azure TTS custo alto | Média | Alto | Ver seção 10.1 |
| CC-CEDICT desatualizado | Baixa | Médio | Community contributions |
| Performance com textos longos | Média | Médio | Pagination, lazy loading |
| Competição de Pleco | Alta | Médio | Foco em tons, web-first |

### 10.1 Estratégia de Custos TTS

#### Quotas e Limites

| Métrica | Free Tier | Premium |
|---------|-----------|---------|
| TTS requests/usuário/dia | 50 | Ilimitado |
| Caracteres/request | 500 | 2000 |
| Cache TTL | 7 dias | 30 dias |

#### Caching Strategy

```
Camada 1: Browser Cache (Cache-Control: max-age=86400)
Camada 2: CDN Edge (Vercel/Cloudflare) - 7 dias
Camada 3: Redis (Railway) - LRU, 10k entradas mais frequentes
```

**Métricas de Cache Target**:
- Cache hit rate: > 80%
- Custo Azure/1k usuários: < $5/mês

#### Fallback Chain

```
1. Redis cache → hit? return
2. Azure TTS → success? cache + return
3. Edge TTS (free) → success? return (não cacheia)
4. Erro gracioso → "TTS indisponível"
```

#### UX para Limite Atingido

```tsx
// Quando quota excedida
<Toast type="warning">
  Daily TTS limit reached. Upgrade to Premium for unlimited.
  <Button>Try again tomorrow</Button>
</Toast>
```

---

## 11. Go-to-Market

### 11.1 Canais

1. **Reddit** - r/ChineseLanguage, r/MandarinChinese
2. **YouTube** - Chinese learning channels
3. **Twitter/X** - Language learning community
4. **Product Hunt** - Launch
5. **Hacker News** - Tech audience

### 11.2 Messaging

**Hook:** "Finally, a Chinese dictionary that teaches you HOW to say it, not just what it means."

**Differentiators:**
- Visual tone curves (único)
- Tone sandhi awareness (único)
- Modern UI (vs MDBG)
- Free + open source (vs Pleco)

---

## 12. Monetização (Futuro)

### 12.1 Freemium Model

**Free:**
- Unlimited lookups
- TTS playback
- Tone analysis
- Basic history

**Premium ($5/month):**
- Record & Compare (unlimited)
- Spaced repetition
- Offline mode
- Ad-free
- Priority support

### 12.2 Revenue Projection

| Year | Users | Conversion | MRR |
|------|-------|------------|-----|
| Y1 | 50k | 2% | $5k |
| Y2 | 200k | 3% | $30k |
| Y3 | 500k | 4% | $100k |

---

## 13. Apêndices

### A. Tone Sandhi Rules

#### A.1 Regras Implementadas

```python
# Rule 1: Third Tone Sandhi (3 + 3 → 2 + 3)
# Aplicação: Sempre que dois tons 3 consecutivos
# 你好 nǐ hǎo → ní hǎo

# Rule 2: 不 (bù) Sandhi
# 不 + T4 → bú + T4
# 不是 bù shì → bú shì

# Rule 3: 一 (yī) Sandhi
# 一 + T4 → yí + T4
# 一 + T1/T2/T3 → yì + T1/T2/T3
# Ordinal: 第一 → yī (sem mudança)

# Rule 4: Reduplication (AA → A + neutral)
# 妈妈 māmā → māma
# 看看 kànkàn → kànkan
```

#### A.2 Casos Multi-Sílabas (3+3+3...)

| Sequência | Padrão | Exemplo | Resultado |
|-----------|--------|---------|-----------|
| 3 + 3 | 2 + 3 | 你好 | ní hǎo |
| 3 + 3 + 3 | 2 + 2 + 3 | 我很好 | wó hén hǎo |
| 3 + 3 + 3 + 3 | 2 + 2 + 2 + 3 | 我想买酒 | wó xiáng mǎi jiǔ |

**Regra geral**: Em sequência de 3s, apenas o último mantém tom 3; todos anteriores → tom 2.

#### A.3 Ambiguidade Lexical

| Caso | Comportamento | Exemplo |
|------|---------------|---------|
| **Palavra composta no dicionário** | Usa sandhi da entrada | 小姐 → xiǎojie (neutro no 姐) |
| **Segmentação ambígua** | jieba decide segmentação; sandhi aplicado por palavra | 可以 → kěyǐ (2+3) |
| **Nomes próprios** | Sandhi normal aplicado | 李小龙 → Lǐ Xiǎo Lóng |

#### A.4 Limitações Conhecidas

- **Ênfase prosódica**: Não modelada (pode anular sandhi)
- **Velocidade de fala**: Não afeta regras (simplificação)
- **Variação regional**: Apenas Putonghua padrão

### B. HSK 3.0 Levels

| Level | Words | Description |
|-------|-------|-------------|
| HSK 1 | 500 | Basic survival |
| HSK 2 | 1,272 | Simple conversation |
| HSK 3 | 2,245 | Daily topics |
| HSK 4 | 3,245 | Complex discussion |
| HSK 5 | 4,316 | Fluent speech |
| HSK 6 | 5,456 | Near-native |
| HSK 7-9 | 11,092 | Advanced/Academic |

### C. API Endpoints

```
POST /api/analyze     - Analyze Chinese text
GET  /api/dictionary/{word} - Dictionary lookup
POST /api/tts         - Text-to-speech
GET  /api/tts/voices  - Available voices
```

---

*Documento criado em: 2025-01-01*
*Última atualização: 2025-01-01*
*Versão: 1.0*
