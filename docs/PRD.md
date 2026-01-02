# Toneo - Product Requirements Document

> **A Plataforma de Domínio Tonal do Mandarim**
> *O WaniKani dos Tons. Não apenas leia chinês — conquiste.*

---

## 1. Visão do Produto

### 1.1 Problema

Aprender tons em mandarim é o maior obstáculo para falantes de línguas não-tonais. Os recursos existentes falham em:

| Problema | Ferramentas Atuais |
|----------|-------------------|
| **Tons como afterthought** | Pleco mostra tom, mas não *ensina* |
| **Foco em caracteres, não em som** | WaniKani para Kanji, nada para tons |
| **Sem metodologia de treino** | Apps mostram tom isolado, sem progressão |
| **Tone sandhi ignorado** | Nenhum app ensina combinações reais |
| **Feedback de pronúncia** | Inexistente ou gamificado demais |
| **Dicionários datados** | MDBG (2006), interface arcaica |

### 1.2 Solução

**Toneo** é a fusão de:
- **WaniKani** (SRS + progressão clara + gamification que funciona)
- **Dicionário moderno** (lookup rápido com contexto)
- **Laboratório de pronúncia** (feedback visual de pitch)

### 1.3 Proposta de Valor

```
"Don't just read Chinese. Conquer it."
```

**A primeira plataforma SRS dedicada a dominar Tone Pairs e Prosódia do Mandarim.**

**Para quem:** Estudantes de mandarim (HSK 1-6+, autodidatas, expats)
**O quê:** Plataforma de domínio tonal com dicionário integrado
**Por quê:** Tons corretos = compreensão + credibilidade + confiança

### 1.4 O Insight Central

> **Tone Pairs, não tons isolados.**

O segredo do Toneo: enquanto outros apps ensinam os 5 tons separadamente, nós ensinamos as **20 combinações de tons** (1-1, 1-2, 1-3... 4-4). Isso reflete como o cérebro realmente processa a melodia do mandarim.

### 1.5 Documentos Relacionados

- Jornada do usuario, conversao e monetizacao: `docs/USER_JOURNEY.md`.

---

## 2. Análise Competitiva

### 2.1 Landscape: Dicionários vs Plataformas de Aprendizado

| Feature | MDBG | Pleco | WaniKani | Toneo |
|---------|------|-------|----------|-------|
| Dicionário CC-CEDICT | ✅ | ✅ | ❌ | ✅ |
| HSK tags | ❌ | ✅ | N/A | ✅ HSK 3.0 |
| Tone sandhi | ❌ | ❌ | N/A | ✅ |
| Visualização de tons | ❌ | ❌ | N/A | ✅ Curvas SVG |
| **SRS / Progressão** | ❌ | ⚠️ | ✅ | ✅ Tone Pairs |
| **Metodologia clara** | ❌ | ❌ | ✅ Levels | ✅ 20 Tone Pairs |
| **Gamification** | ❌ | ❌ | ✅ | ✅ Propaganda |
| Record & Compare | ❌ | ❌ | ❌ | ✅ |
| TTS nativo | ❌ | Pago | ❌ | ✅ |
| Stroke order | ❌ | Pago | ❌ | ✅ cnchar |
| UI/UX moderno | ❌ | ⚠️ | ✅ | ✅ Woodcut |
| Web-first | ✅ | ❌ | ✅ | ✅ |
| **Preço** | Free | $30+ | $9/mo | Freemium |

### 2.2 Posicionamento: Novo Eixo

O Toneo não compete diretamente com dicionários. Ele cria uma **nova categoria**:

```
                    VISUAL (Kanji/Hanzi)
                           ↑
                           │
                    WaniKani (JP)
                           │
                    Skritter (ZH)
                           │
    LOOKUP ←───────────────┼───────────────→ MASTERY
                           │
              Pleco        │
              MDBG         │        ★ TONEO
                           │     (Tone Pairs SRS)
                           │
                           ↓
                    AUDIO (Pronúncia/Tons)
```

**Insight**: WaniKani provou que "domínio visual de Kanji" é um produto. Toneo prova que "domínio auditivo de tons" também é.

### 2.3 Por que ninguém fez isso antes?

| Barreira | Por que Toneo resolve |
|----------|----------------------|
| Tons são "simples demais" | Tone Pairs são 20 combinações — complexidade suficiente para SRS |
| Áudio é caro | Fish Speech / CosyVoice mudaram o jogo (TTS natural barato) |
| Feedback de pronúncia é ruim | Web Audio API + pitch detection amadureceram |
| Não é "visual" como Kanji | Curvas de tom SVG + estética Woodcut = apelo visual |

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

Como aprendiz sério
Quero um sistema de progressão claro com níveis
Para que eu saiba que estou evoluindo
```

---

## 4. O Método Toneo (ToneKani)

### 4.1 Filosofia: Audio-First Learning

O Toneo inverte a abordagem tradicional:

```
TRADICIONAL:  Hanzi → Pinyin → Tom (afterthought)
TONEO:        Tom Pair → Melodia → Palavras → Hanzi
```

**Princípio**: Antes de saber o que a palavra significa, o aluno deve saber como ela *soa*.

### 4.2 Estrutura de Progressão

| Nível | Foco | Atividade | Tech Stack |
|-------|------|-----------|------------|
| **Lvl 1-3** | Single Tones | Ouvir e identificar tom (1, 2, 3, 4, 5) | Azure TTS + Quiz UI |
| **Lvl 4-20** | Tone Pairs | Treinar as 20 combinações (1-1, 1-2... 4-4) | Fish Speech + SRS |
| **Lvl 21-40** | Sandhi Patterns | 不/一 + terceiro tom consecutivo | Regras contextuais |
| **Lvl 41+** | Flow & Shadowing | Frases completas com overlay de pitch | Web Audio API + Canvas |

### 4.3 Os 20 Tone Pairs

O "currículo secreto" do Toneo:

```
      T1    T2    T3    T4    T5
T1  │ 1-1 │ 1-2 │ 1-3 │ 1-4 │ 1-5 │  ← "mā + X"
T2  │ 2-1 │ 2-2 │ 2-3 │ 2-4 │ 2-5 │  ← "má + X"
T3  │ 3-1 │ 3-2 │ 3-3*│ 3-4 │ 3-5 │  ← "mǎ + X" (*sandhi)
T4  │ 4-1 │ 4-2 │ 4-3 │ 4-4 │ 4-5 │  ← "mà + X"
```

Cada par é ensinado com 10-20 palavras de exemplo, ordenadas por frequência (HSK 1 primeiro).

### 4.4 Mecânicas de Gamification

| Mecânica | Implementação | Propósito |
|----------|---------------|-----------|
| **Daily Drill** | 5 min/dia obrigatório | Habit loop |
| **Streak Counter** | Dias consecutivos + "Ranking do Partido" | Retenção |
| **Carimbo de Aprovação** | Feedback visual estilo propaganda | Dopamine hit |
| **Níveis Militares** | 新兵 → 战士 → 指挥官 → 将军 | Progressão clara |
| **Review Queue** | SRS (SM-2) para itens errados | Memorização |

### 4.5 Feedback Visual: Estética Propaganda

**Acerto:**
```
┌─────────────────────────────────┐
│  ★ 革命成功 ★                  │
│  REVOLUTIONARY SUCCESS          │
│  [Carimbo vermelho: 批准]       │
└─────────────────────────────────┘
```

**Erro:**
```
┌─────────────────────────────────┐
│  需要纪律                       │
│  DISCIPLINE REQUIRED            │
│  [Risco preto grosso]           │
└─────────────────────────────────┘
```

### 4.6 Audio Sources

| Uso | Provider | Justificativa |
|-----|----------|---------------|
| **Tone Drills (SRS)** | Fish Speech / CosyVoice | Natural, cacheable, barato |
| **Dicionário (lookup)** | Azure TTS | Rápido, confiável, já integrado |
| **Shadowing avançado** | Gravações humanas (futuro) | Máxima naturalidade |

### 4.7 Modo "Tone Inspector" (Inspirado em Papers, Please)

> *"Glory to Arstotzka"* → *"为人民服务"* (Serve the People)

O jogo **Papers, Please** (2013) é uma referência de design para a experiência de drill do Toneo. A estética burocrática soviética combina perfeitamente com a propaganda chinesa.

#### 4.7.1 Elementos Adaptados

| Papers, Please | Toneo Adaptation |
|----------------|------------------|
| Mesa de inspeção com documentos | Interface de "Inspection Booth" para drills |
| Carimbo APPROVED/DENIED | 批准/拒绝 com som satisfatório de *THUNK* |
| Citations (penalidades) | Sistema de advertências antes de perder streak |
| Jornal "The Truth of Arstotzka" | "人民日报" (People's Daily) com progresso |
| Rulebook crescente | Cada nível desbloqueia nova regra de sandhi |
| Pressão de tempo | Timer opcional para modo hardcore |
| Múltiplos endings | Títulos baseados em performance |

#### 4.7.2 Interface: Inspection Booth

```
┌─────────────────────────────────────────────────────────────┐
│  声调检查站 TONE INSPECTION BOOTH        Day 7 | 14:32     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────┐    ┌─────────────────┐               │
│   │  AUDIO SAMPLE   │    │   YOUR ANSWER   │               │
│   │                 │    │                 │               │
│   │   [▶ PLAY]      │    │   Tone: [ ? ]   │               │
│   │                 │    │                 │               │
│   │   ██████████    │    │   ┌───┐ ┌───┐   │               │
│   │   (waveform)    │    │   │批准│ │拒绝│   │               │
│   └─────────────────┘    │   └───┘ └───┘   │               │
│                          └─────────────────┘               │
│   RULEBOOK:              ┌─────────────────┐               │
│   ☑ Tone 1 = High flat   │ CITATIONS: 1/3  │               │
│   ☑ Tone 2 = Rising      │ ██░░░░░░░░░░░░  │               │
│   ☑ 3+3 → 2+3 sandhi     └─────────────────┘               │
│   ☐ 不 sandhi (locked)                                     │
│   ☐ 一 sandhi (locked)   PROCESSED: 12/20                  │
└─────────────────────────────────────────────────────────────┘
```

#### 4.7.3 Sistema de Citations

3 strikes e a sessão termina (mas sem perder progresso permanente):

```
┌──────────────────────────────────────┐
│  ⚠️ 警告 CITATION RECEIVED           │
│  ══════════════════════════════════  │
│                                      │
│  Infraction: Incorrect tone pair     │
│  Expected: 2-3 (máma)                │
│  Received: 1-3                       │
│                                      │
│  Citations today: 2/3                │
│  Next citation ends session.         │
│                                      │
│  "Carelessness is counter-           │
│   revolutionary. Be vigilant."       │
│                                      │
│  [确认 ACKNOWLEDGE]                  │
└──────────────────────────────────────┘
```

#### 4.7.4 Rulebook Progressivo

Como Papers, Please adiciona regras a cada dia, Toneo adiciona regras de tom:

| Day | New Rule Unlocked | Complexity |
|-----|-------------------|------------|
| 1-3 | Single tones (1, 2, 3, 4, 5) | ★☆☆☆☆ |
| 4-7 | Tone pairs (1-1, 1-2, etc.) | ★★☆☆☆ |
| 8-14 | Third tone sandhi (3+3→2+3) | ★★★☆☆ |
| 15-21 | 不 sandhi (bù→bú before T4) | ★★★★☆ |
| 22-28 | 一 sandhi (yī→yí/yì) | ★★★★☆ |
| 29+ | Mixed drills + speed mode | ★★★★★ |

O Rulebook fica visível durante o drill para consulta (como no jogo original).

#### 4.7.5 Jornal Diário: 人民日报

Ao final de cada sessão:

```
┌──────────────────────────────────────┐
│  人 民 日 报                         │
│  PEOPLE'S DAILY TONE REPORT          │
│  ════════════════════════════════    │
│  Day 7 | 2025-01-15                  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ DAILY STATISTICS              │  │
│  │ Words inspected: 47           │  │
│  │ Accuracy: 89%                 │  │
│  │ Citations: 2                  │  │
│  │ Time: 4:32                    │  │
│  └────────────────────────────────┘  │
│                                      │
│  ★ NEW RULE UNLOCKED:                │
│    不 sandhi now in effect           │
│                                      │
│  "The Party commends your progress.  │
│   Continue serving the people."      │
│                                      │
│  ┌────────┐ ┌────────────────────┐   │
│  │ QUIT   │ │ CONTINUE TO DAY 8  │   │
│  └────────┘ └────────────────────┘   │
└──────────────────────────────────────┘
```

#### 4.7.6 Endings / Títulos

Múltiplos "endings" baseados em performance total:

| Título | Condição | Recompensa Visual |
|--------|----------|-------------------|
| 革命英雄 Revolutionary Hero | 100% accuracy por 7 dias consecutivos | Badge dourado + animação especial |
| 人民公仆 Servant of the People | Completou todos os 40 níveis | Badge vermelho + certificado |
| 模范工人 Model Worker | 30-day streak | Badge com estrela |
| 同志 Comrade | Completou nível 10 | Badge básico |
| 需要再教育 Re-education Required | Falhou 3 sessões seguidas | (Mensagem cômica, sem punição real) |

#### 4.7.7 Som e Feedback

| Ação | Som | Inspiração |
|------|-----|------------|
| Acerto | *THUNK* de carimbo + "ding" | Papers, Please stamp |
| Erro | Buzzer grave + papel amassando | Papers, Please denial |
| Nova regra | Sino de máquina de escrever | Typewriter bell |
| Fim do dia | Música de encerramento soviética | End of day theme |
| Citation | Alarme breve + papel deslizando | Citation sound |

---

## 5. Requisitos Funcionais

### 5.1 Core Features (MVP) ✅

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

### 5.1.1 Limites e Comportamentos

| Parâmetro | Valor | Comportamento |
|-----------|-------|---------------|
| **Tamanho máximo de texto** | 5000 caracteres | Trunca com aviso ao usuário |
| **Palavras OOV (fora do dicionário)** | N/A | Fallback para pypinyin; marcadas como "baixa confiança" |
| **Caracteres não-chineses** | Ignorados | Filtrados silenciosamente; apenas hanzi processados |
| **Pontuação chinesa** | Preservada | 。，！？ mantidos para contexto visual |
| **Texto misto (EN+ZH)** | Suportado | Extrai apenas caracteres chineses via zhon |
| **Rate limiting** | 60 req/min | 429 Too Many Requests após limite |

### 5.2 Phase 2 - Learning (ToneKani Core)

| Feature | Priority | Descrição | Tech / Detalhe |
|---------|----------|-----------|----------------|
| **Tone Pair SRS** | P0 | Sistema de repetição espaçada focado em 20 combinações | Algoritmo SM-2 |
| **Single Tone Quiz** | P0 | Lvl 1-3: Identificar tons isolados | Azure TTS + Quiz UI |
| **Propaganda Feedback** | P1 | Feedback visual exagerado estilo poster | "革命成功!" vs "需要纪律!" |
| **Audio Match UI** | P1 | Visualização da onda sonora sobreposta à do nativo | Web Audio API + Canvas |
| **Hanzi Ink Reveal** | P2 | Hanzi se "desenha" sincronizado com áudio | HanziWriter + TTS timestamp |
| Record & Compare | P1 | Grava voz, compara pitch F0 | Web Audio API |
| Progress/Levels | P1 | 新兵 → 战士 → 指挥官 → 将军 | localStorage → PostgreSQL |
| Daily Drill | P1 | 5 min/dia, streak counter | Notification API |

### 5.3 Phase 3 - Dictionary+

| Feature | Priority | Descrição |
|---------|----------|-----------|
| Hanzi Writer | P1 | Animação de traços |
| Example Sentences | P1 | Frases de contexto |
| Character Decomposition | P2 | Radicais + componentes |
| Grammar Notes | P2 | Notas de uso |
| User Lists | P2 | Salvar palavras |
| Spaced Repetition | P3 | Revisão tipo Anki |

### 5.4 Phase 4 - Community

| Feature | Priority | Descrição |
|---------|----------|-----------|
| User Accounts | P2 | Auth + sync |
| Vocabulary Lists | P2 | Listas compartilháveis |
| Sentence Mining | P3 | Import de textos |
| Community Corrections | P3 | Crowdsource erros |

---

## 6. Requisitos Não-Funcionais

### 6.1 Performance

| Métrica | Target |
|---------|--------|
| Time to First Byte | < 200ms |
| Analyze Response | < 500ms |
| TTS Generation | < 1s |
| Lighthouse Score | > 90 |

### 6.2 Escalabilidade

- 10k DAU no ano 1
- 100k DAU no ano 2
- Serverless (Vercel + Railway)

### 6.3 Acessibilidade

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

### 6.4 Internacionalização

- UI em inglês (MVP)
- Português, espanhol, japonês (Phase 2)
- Definições em múltiplos idiomas (Phase 3)

### 6.5 Privacidade e Dados

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

## 7. Arquitetura Técnica

### 7.1 Stack

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
│  Railway / Render                               │
└─────────────────────────────────────────────────┘
      │             │             │          │
      ▼             ▼             ▼          ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Supabase │  │    R2    │  │  Azure   │  │ CC-CEDICT│
│ Auth+DB  │  │TTS Cache │  │  Speech  │  │ SQLite   │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

### 7.2 NLP Pipeline

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

### 7.3 Data Sources

| Source | License | Usage |
|--------|---------|-------|
| CC-CEDICT | CC BY-SA 4.0 | Dictionary entries |
| HSK 3.0 (ivankra) | MIT | Vocabulary levels |
| wordfreq | MIT | Word frequency |
| pypinyin | MIT | Pinyin conversion |
| jieba | MIT | Segmentation |

#### 7.3.1 Atribuição de Licenças (CC BY-SA 4.0)

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

### 7.4 Infra MVP (Decisões)

| Componente | Decisão | Motivo |
|------------|---------|--------|
| Frontend | Vercel | Já em prod, TTFB baixo |
| Backend | Railway ou Render | Deploy simples, baixo ops |
| Auth + DB | Supabase (Postgres) | Auth pronta + sync fácil |
| TTS Cache | Cloudflare R2 + CDN | Baixo custo e latência |
| TTS Provider | Azure Speech | Já integrado |
| Dictionary | SQLite local | Read-only, rápido no backend |

### 7.5 Fluxos Críticos (MVP)

**Login e Sync**
- Frontend usa Supabase Auth e envia JWT ao backend.
- Backend valida JWT via JWKS do Supabase.
- Progresso/SRS/compras gravados no Postgres.

**TTS Cache**
- Frontend chama `POST /api/tts` com texto e voz.
- Backend calcula hash e busca no R2.
- Cache hit: retorna signed URL + `Cache-Control`.
- Cache miss: gera na Azure, salva no R2, retorna URL.

### 7.6 Próximo Passo (Checklist de Implementação)

- Definir schema Postgres para `progress`, `purchases`, `difficult_words`.
- Criar bucket R2 e política de acesso + CDN.
- Implementar endpoints `POST /api/tts`, `POST /api/progress`, `GET /api/me`.
- Configurar env vars no Vercel/Railway (Supabase, R2, Azure).
- Ajustar frontend para Supabase Auth + chamadas com token.

### 7.7 Schema Postgres (MVP)

**Notas gerais**
- Todas as tabelas usam `user_id UUID` referenciando `auth.users(id)` com `ON DELETE CASCADE`.
- RLS ativo no Supabase; policy: `user_id = auth.uid()`.
- Campos de datas em `timestamptz`.

#### 7.7.1 `user_progress`

Armazena progresso agregado por deck/nível (ex: HSK 1, Tone Pair 1-1).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| deck_id | text | Ex: `hsk1`, `tonepair-1-1` |
| progress_percent | numeric(5,2) | 0.00–100.00 |
| level_reached | int | Nível mais alto concluído |
| streak_count | int | Dias seguidos (opcional) |
| last_seen_at | timestamptz | Última interação |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Default now() |

**Índices**
- `user_progress_user_id_idx` em `user_id`
- Único: `(user_id, deck_id)`

#### 7.7.2 `user_purchases`

Status de compra e entitlement do usuário (Free vs Pro/Lifetime).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| product_id | text | Ex: `pro_lifetime`, `pro_monthly` |
| status | text | `active`, `trialing`, `canceled`, `refunded` |
| provider | text | Ex: `stripe`, `lemon` |
| provider_ref | text | ID do provedor (opcional) |
| purchased_at | timestamptz | Data da compra |
| expires_at | timestamptz | Nulo para lifetime |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Default now() |

**Índices**
- `user_purchases_user_id_idx` em `user_id`
- `user_purchases_status_idx` em `status`

#### 7.7.3 `user_difficult_words`

Lista de palavras marcadas como difíceis para revisão futura.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| word | text | Hanzi |
| pinyin | text | Opcional |
| tone_pair | text | Ex: `2-3` (opcional) |
| source | text | Ex: `deck`, `lookup` |
| difficulty_score | int | 1–5 (opcional) |
| last_seen_at | timestamptz | Última revisão |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Default now() |

**Índices**
- `user_difficult_words_user_id_idx` em `user_id`
- Único: `(user_id, word)`

#### 7.7.4 Tabela futura (SRS detalhado)

Para SM-2 real, adicionar `user_srs_items`:
- `item_id` (palavra ou tone pair), `due_at`, `interval`, `ease_factor`, `repetitions`.

---

## 8. Design System: Woodcut Propaganda

### 8.1 Identidade Visual

**Nome:** Toneo (Tone + Neo)
**Estilo:** Xilogravura Revolucionária (Woodcut Propaganda)

> Inspirado em cartazes de propaganda chinesa dos anos 60-70, com elementos de xilogravura (木刻).
> A estética transmite: **seriedade, disciplina, progresso, coletividade**.

### 8.2 Referências Visuais

```
┌─────────────────────────────────────────────────────────┐
│  PROPAGANDA CHINESA (1960-1976)                         │
│  • Cores sólidas (vermelho, preto, amarelo)             │
│  • Figuras heróicas com rostos determinados             │
│  • Radiação solar / raios de luz                        │
│  • Tipografia bold, serifada, impactante                │
│  • Texturas de impressão (imperfeições de tinta)        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  XILOGRAVURA (木刻 mùkè)                                │
│  • Traços angulares, não-orgânicos                      │
│  • Hachuras para sombra (linhas paralelas)              │
│  • Alto contraste preto/branco                          │
│  • Bordas irregulares (como se cortadas em madeira)     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  PAPERS, PLEASE (2013) - Lucas Pope                     │
│  • Interface de "mesa de trabalho" com documentos       │
│  • Estética low-fi, pixelada, deliberadamente "feia"    │
│  • Cores opacas: marrom, verde militar, cinza           │
│  • Carimbos físicos com feedback sonoro satisfatório    │
│  • Burocracia como mecânica de jogo                     │
│  • Tensão entre eficiência e humanidade                 │
└─────────────────────────────────────────────────────────┘
```

**Síntese Toneo**: Propaganda chinesa (cores, tipografia) + Xilogravura (texturas) + Papers, Please (UX de inspeção, gamification burocrática).

### 8.3 Paleta de Cores

```css
/* Core */
--mao-red: #E23D2E;    /* Ação, tons fortes, revolução */
--mao-yellow: #F5C84B; /* Destaque, sucesso, ouro */
--mao-black: #1B1B1B;  /* Texto, bordas, autoridade */
--mao-white: #FDFBF7;  /* Fundo cards, papel envelhecido */
--mao-cream: #F5EFE6;  /* Fundo página, papel antigo */

/* Tons */
--tone-1: #E23D2E;     /* Vermelho - Alto, plano */
--tone-2: #F5C84B;     /* Amarelo - Ascendente */
--tone-3: #1B1B1B;     /* Preto - Dipping */
--tone-4: #9E2B25;     /* Vermelho escuro - Descendente */
--tone-5: #8C5A3C;     /* Marrom - Neutro */

/* Feedback */
--success: #2E7D32;    /* Verde escuro - aprovação */
--error: #1B1B1B;      /* Preto - reprovação (risco) */
```

### 8.4 Tipografia

| Uso | Fonte | Fallback | Peso |
|-----|-------|----------|------|
| **Display (EN)** | Syne | Impact, sans-serif | 700-800 |
| **Display (ZH)** | ZCOOL XiaoWei | Noto Serif SC | 700 |
| **Body** | Lexend | system-ui | 400-500 |
| **Mono/Pinyin** | IBM Plex Mono | monospace | 400 |
| **Hanzi (body)** | Noto Sans SC | sans-serif | 400-500 |

**ZCOOL XiaoWei** (站酷小薇体) evoca tipografia de poster antigo. Usar para:
- Títulos de seção
- Feedback de acerto/erro ("革命成功!")
- Níveis/ranks do usuário

### 8.5 Texturas e Efeitos

#### SVG Noise Filter (Imperfeição de Tinta)

```html
<svg>
  <filter id="paper-texture">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5"/>
    <feColorMatrix type="saturate" values="0"/>
    <feBlend mode="multiply" in="SourceGraphic"/>
  </filter>
</svg>
```

Aplicar em:
- Background de cards de feedback
- Carimbos de aprovação
- Headers de seção

#### Bordas Irregulares (Woodcut Edge)

```css
/* Simula corte em madeira */
.woodcut-edge {
  clip-path: polygon(
    0% 2%, 3% 0%, 97% 1%, 100% 3%,
    98% 97%, 100% 100%, 2% 98%, 0% 96%
  );
}
```

### 8.6 Iconografia

**Estilo**: Traços angulares, hachuras de sombra, sem curvas suaves.

| Ícone | Uso | Estilo |
|-------|-----|--------|
| ⭐ Estrela | Sucesso, rank | 5 pontas, preenchimento sólido |
| ✊ Punho | Força, progresso | Silhueta blocada |
| 📢 Megafone | Anúncios | Linhas retas, sem gradiente |
| 🎖️ Medalha | Conquistas | Forma geométrica simples |

**Não usar**: Ícones outline finos, gradientes, sombras suaves.

### 8.7 Feedback Visual (Gamification)

#### Acerto (批准 - Aprovado)

```
┌─────────────────────────────────────┐
│ ╔═══════════════════════════════╗   │
│ ║  ★ 革命成功 ★                ║   │
│ ║  REVOLUTIONARY SUCCESS        ║   │
│ ╚═══════════════════════════════╝   │
│                                     │
│   ┌───────────────┐                 │
│   │   批  准      │ ← Carimbo       │
│   │   APPROVED    │   vermelho      │
│   │   ~~~~~~~~~~~~│   c/ textura    │
│   └───────────────┘                 │
└─────────────────────────────────────┘
```

- Carimbo vermelho com borda irregular
- Noise filter para simular tinta falhada
- Som: "ding" satisfatório
- Animação: stamp down + shake leve

#### Erro (需要纪律 - Disciplina Necessária)

```
┌─────────────────────────────────────┐
│                                     │
│   需要纪律                          │
│   DISCIPLINE REQUIRED               │
│                                     │
│   ████████████████████████          │
│   ↑ Risco preto grosso diagonal     │
│                                     │
└─────────────────────────────────────┘
```

- Risco preto diagonal (como "X" ou "—")
- Sem vermelho (vermelho = positivo)
- Som: "thud" grave
- Animação: shake horizontal

### 8.8 Componentes Atualizados

| Classe CSS | Uso | Especificação |
|------------|-----|---------------|
| `.surface-card` | Cards principais | border: 2px black, bg: white, shadow: 4px offset |
| `.brutal-button` | CTAs | bg: red, hover: translate(-2px,-2px) + shadow |
| `.propaganda-stamp` | Feedback sucesso | Carimbo vermelho + noise filter |
| `.discipline-strike` | Feedback erro | Risco preto diagonal |
| `.woodcut-title` | Títulos ZH | ZCOOL XiaoWei, tracking wide |
| `.paper-texture` | Backgrounds | SVG noise filter overlay |

#### Padrão Visual Confirmado

```css
/* ✅ Cantos retos em TODOS os componentes */
border-radius: 0;

/* ✅ Sombras hard (offset sólido, sem blur) */
box-shadow: 4px 4px 0px 0px #1B1B1B;

/* ✅ Bordas pretas sólidas (2px para ênfase) */
border: 2px solid #1B1B1B;

/* ✅ Hover com movimento físico */
transform: translate(-2px, -2px);

/* ✅ Texturas de papel/tinta onde apropriado */
filter: url(#paper-texture);
```

### 8.9 Animações

| Nome | Duração | Uso | Easing |
|------|---------|-----|--------|
| `fade-in-up` | 500ms | Entrada de cards | ease-out |
| `draw-curve` | 600ms | Curvas de tom | ease-out |
| `stamp-down` | 200ms | Carimbo de aprovação | cubic-bezier(.17,.67,.83,.67) |
| `shake-error` | 300ms | Feedback de erro | ease-in-out |
| `ink-spread` | 400ms | Reveal de hanzi | ease-out |
| Hover translate | 100-200ms | Botões/cards | ease |

---

## 9. Métricas de Sucesso

### 9.1 North Star Metric

**"Palavras analisadas por usuário/semana"**

### 9.2 KPIs

| Métrica | Target (6 meses) |
|---------|------------------|
| MAU | 10,000 |
| DAU/MAU | > 20% |
| Avg Session Duration | > 3 min |
| Words Analyzed/Session | > 10 |
| Return Rate (7 days) | > 30% |
| NPS | > 50 |

### 9.3 Funil

```
Visit → Analyze (>60%) → Return (>30%) → Share (>5%)
```

---

## 10. Roadmap

### Q1 2025 - MVP Launch
- [x] Core analyzer
- [x] Dictionary drawer
- [x] TTS playback
- [x] Mobile responsive
- [ ] Deploy (Vercel + Railway)
- [ ] Landing page
- [ ] Basic analytics

### Q2 2025 - ToneKani Alpha
- [ ] Single Tone Quiz (Lvl 1-3)
- [ ] Tone Pair SRS engine (SM-2)
- [ ] Propaganda feedback UI
- [ ] Daily Drill + Streak
- [x] Hanzi Writer + cnchar integration

### Q3 2025 - ToneKani Beta
- [ ] Full 20 Tone Pairs curriculum
- [ ] Record & Compare (pitch overlay)
- [ ] User accounts + progress sync
- [ ] Fish Speech integration
- [x] Character decomposition

### Q4 2025 - Launch & Monetize
- [ ] Premium tier ("Party Member")
- [ ] Voice cloning feature
- [ ] Mobile PWA optimization
- [ ] Community features

---

## 11. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Fadiga do Usuário** | Alta | Alto | Gamification agressiva (streaks, badges militares). Sessões curtas ("Daily Drill" de 5 min). |
| **Custo de Audio AI** | Média | Médio | Cache agressivo dos Tone Pairs (são finitos ~400 palavras). Gerar áudio estático para SRS, Azure só para input livre. |
| Azure TTS custo alto | Média | Alto | Ver seção 11.1 |
| CC-CEDICT desatualizado | Baixa | Médio | Community contributions |
| Performance com textos longos | Média | Médio | Pagination, lazy loading |
| Competição de Pleco | Alta | Baixo | Eixo diferente (Audio-First vs Lookup) |

### 11.1 Estratégia de Custos TTS

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

## 12. Go-to-Market

### 12.1 Canais

1. **Reddit** - r/ChineseLanguage, r/MandarinChinese
2. **YouTube** - Chinese learning channels
3. **Twitter/X** - Language learning community
4. **Product Hunt** - Launch
5. **Hacker News** - Tech audience

### 12.2 Messaging

**Hook:** "Finally, a Chinese dictionary that teaches you HOW to say it, not just what it means."

**Differentiators:**
- Visual tone curves (único)
- Tone sandhi awareness (único)
- Modern UI (vs MDBG)
- Free + open source (vs Pleco)

---

## 13. Monetização

### 13.1 Modelo Freemium

#### 同志 Comrade (Free)

- ✅ Unlimited dictionary lookups
- ✅ Tone analysis + sandhi
- ✅ TTS playback (50/dia)
- ✅ Single Tone Quiz (Lvl 1-3)
- ✅ Basic history
- ⏳ Daily Drill limitado (3 sessões/dia)

#### 党员 Party Member ($5/month)

O "hook" premium:

| Feature | Descrição |
|---------|-----------|
| **Custom AI Tutor** | Clone a voz do seu ator/cantor chinês favorito (Fish Speech/CosyVoice) |
| **Unlimited Shadowing** | Gravação e comparação de áudio ilimitada |
| **Hardcore Mode** | Apenas áudio (sem Hanzi/Pinyin) nos drills |
| **Full Tone Pairs** | Acesso a todos os 20 pares + Sandhi levels |
| **Unlimited Daily Drill** | Sem limite de sessões |
| **Priority TTS** | Sem fila, sem cache miss |
| **Badges Exclusivos** | Ranks militares especiais |

### 13.2 Estratégia de Conversão

```
Free (Lvl 1-3) → Paywall (Lvl 4+) → Premium
                      ↓
              "You've mastered single tones!
               Unlock Tone Pairs to sound native."
```

O paywall aparece quando o usuário demonstra engajamento (completou níveis 1-3), não logo no início.

### 13.3 Revenue Projection

| Year | Users | Conversion | MRR | ARR |
|------|-------|------------|-----|-----|
| Y1 | 50k | 3% | $7.5k | $90k |
| Y2 | 200k | 4% | $40k | $480k |
| Y3 | 500k | 5% | $125k | $1.5M |

**Nota**: Conversão maior que apps típicos (2%) devido ao paywall estratégico após engajamento.

---

## 14. Apêndices

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
*Última atualização: 2025-12-31*
*Versão: 2.0 - Pivot ToneKani*
