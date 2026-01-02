# Toneo - User Journey + Monetizacao

> Documento focado em jornada do usuario, conversao e monetizacao.

---

## 1. Objetivo

Definir como o usuario entra pelo dicionario (SEO), migra para a jornada
de estudo e vira receita via pagamento unico (lifetime).

---

## 2. Pilares do Produto

**Pilar 1: Tool (Dictionary + Analyzer)**
- Publico, indexavel, rapido.
- Serve como gancho de SEO e prova de valor.
- Sempre acessivel sem login.

**Pilar 2: Journey (Decks + Progresso)**
- Conteudo estruturado, com progresso e streak.
- Exige login para salvar dados.
- Principal fonte de retencao e monetizacao.

---

## 3. Jornada do Usuario (Mapa)

```
SEO -> Dictionary -> Valor rapido -> CTA Jornada -> Login -> Primeiro deck
-> Retencao diaria -> Dashboard -> Compra lifetime -> Recomendacao
```

### 3.1 Aquisicao (SEO)
- Paginas indexaveis: /dict/[hanzi] e /analyze?text=
- Conteudo util: pinyin, tons, sandhi, audio, exemplos
- CTA discreto: "Quer dominar isso? Inicie a Jornada"

### 3.2 Ativacao
- Primeira sessao sem friccao:
  - 1 clique para iniciar Lvl 1
  - 5 minutos de drill
- Ao terminar: feedback visual + streak + "Volte amanha"

### 3.3 Retencao
- Streak diario e estatisticas simples.
- Recomendacao de proximo deck automatico.
- Notificacao leve (email) em D1/D3/D7.

### 3.4 Monetizacao
- Paywall leve apos o usuario terminar Lvl 1-3.
- Oferta principal: Pro Lifetime (pagamento unico).
- Mensagem: "Voce ja domina tons isolados. Libere Tone Pairs."

---

## 4. Fluxos Principais

### 4.1 Fluxo: Dictionary Hook
1) Usuario encontra pagina via SEO.
2) Usa TTS e visualiza tom.
3) CTA para Jornada aparece apos 1-2 interacoes.

### 4.2 Fluxo: Jornada (Decks)
1) Login rapido (Magic Link / Google).
2) Lvl 1-3: tons isolados.
3) Deck piloto de tone pairs (ex: 1-1, 1-2, 2-1, 2-2).
4) Progress salvo no Postgres.

### 4.3 Fluxo: Dashboard
**Objetivo**: tornar o progresso visivel e vender a proxima etapa.

Componentes:
- Progresso geral (percentual + nivel atual)
- Streak e estatisticas (dias, acuracia, tempo)
- Deck atual + proximo deck recomendado
- "Palavras Dificeis" (lista curta)
- CTA de upgrade (se free)

### 4.4 Fluxo: Pagamento Unico (Lifetime)
1) Usuario conclui Lvl 1-3.
2) Paywall mostra beneficios de Tone Pairs + features futuras.
3) Checkout com pagamento unico.
4) Entitlement gravado em `user_purchases`.
5) Dashboard mostra status "Pro Lifetime".

---

## 5. Monetizacao

### 5.1 Plano Principal

**Free (Comrade)**
- Dictionary e Analyzer completos
- Lvl 1-3 (tons isolados)
- Progresso basico

**Pro Lifetime (One-time)**
- Todos os Tone Pairs
- Sandhi avancado e drills diarios ilimitados
- Futuras features (SRS completo, shadowing, etc.)

**Preco (placeholder)**
- Early adopter: US$ 29-49
- Depois: US$ 59-79

### 5.2 Regras de Entitlement
- Se `user_purchases.status = active` e `product_id = pro_lifetime`,
  liberar todos os decks e remover limites.
- Se nao, manter gating apos Lvl 1-3.

---

## 6. Mensagens e Gatilhos

**CTA no dicionario**
- "Domine esta palavra em 5 minutos por dia."

**Paywall**
- "Voce desbloqueou a base. Agora vem o que realmente importa: Tone Pairs."

**Dashboard**
- "Progresso visivel = motivacao. Mostre a proxima missao."

---

## 7. Metricas (MVP)

| Etapa | Meta | Evento |
|-------|------|--------|
| Visit -> Analyze | > 60% | `analyze_used` |
| Analyze -> Start Journey | > 8% | `journey_started` |
| Journey Started -> Completed Lvl 1-3 | > 30% | `level_3_completed` |
| Completed Lvl 1-3 -> Paid | > 3-5% | `purchase_completed` |
| D7 Retention | > 30% | `session_started` |

---

## 8. MVP Scope (Jornada + Monetizacao)

**Inclui**
- Dictionary/analyzer publico com SEO
- Login + progresso basico
- Lvl 1-3 e 1 deck piloto de tone pairs
- Dashboard basico com CTA
- Paywall + pagamento unico

**Fora**
- SRS completo SM-2
- Comunidade e listas publicas
- Audio humano
- Shadowing avancado

---

## 9. Feature Futura Critica: Analise de Voz do Usuario

**Por que importa**
- Diferencial real frente a dicionarios: feedback objetivo de pronuncia.
- Aumenta retencao e justifica o upgrade.

**Como deve funcionar (visao)**
- Usuario grava audio curto por palavra/frase.
- Sistema extrai curva de pitch (F0) e compara com o nativo.
- Mostra score simples + sugestoes ("suba mais no tom 2").
- Resultado nao precisa salvar audio bruto; guardar apenas metricas.

---

## 10. Proximos Passos (Operacional)

1) Definir copy do CTA e paywall.
2) Implementar dashboard minimalista.
3) Integrar pagamento unico (Stripe ou Lemon).
4) Instrumentar eventos de funil.
5) Preparar paginas indexaveis do dicionario.
