# PRD-001: ZENT I.A. — Plataforma de Gestão para Escritórios de Advocacia

**Versão:** 1.0
**Data:** 2026-02-17
**Autor:** @pm (via AIOS)
**Status:** Draft
**Project Brief:** [project-brief.md](../project-brief.md)

---

## 1. Objetivos & Contexto

### 1.1 Objetivo do Produto
Oferecer uma plataforma all-in-one (white-label GoHighLevel) que centraliza CRM, marketing, automações e agentes de IA para escritórios de advocacia, eliminando a fragmentação de ferramentas e automatizando o fluxo comercial do lead ao fechamento.

### 1.2 Contexto de Negócio
O mercado jurídico brasileiro está em transformação digital. Escritórios de advocacia investem cada vez mais em marketing digital (tráfego pago), mas carecem de infraestrutura comercial para converter leads em clientes. A ZENT I.A. preenche esse gap com uma solução verticalizada.

### 1.3 Público-Alvo
- **Primário:** Advogados sócios de escritórios de direito bancário (3-50 advogados)
- **Secundário:** Gestores operacionais de escritórios jurídicos
- **Persona:** Dra. Camila Moretti, 37 anos, sócia, investe em tráfego pago sem time comercial

---

## 2. Requisitos Funcionais

### FR-001: Landing Page de Vendas
| Campo | Valor |
|-------|-------|
| Prioridade | P0 (MVP) |
| Épico | EPIC-1 |
| Descrição | Landing page responsiva que apresenta o produto, planos e captura leads |

**Sub-requisitos:**
- **FR-001.1:** Hero section com proposta de valor e CTA principal
- **FR-001.2:** Seção de features com navegação por tabs (Gestão, CRM, Marketing, IA)
- **FR-001.3:** Tabela comparativa (escritório comum vs. ZENT I.A.)
- **FR-001.4:** Seção de preços com 4 planos (Starter, Básico, Profissional, Premium)
- **FR-001.5:** Prova social com depoimentos
- **FR-001.6:** Formulários de captura de leads (nome, email, WhatsApp)
- **FR-001.7:** Integração com Google Analytics 4 e Meta Pixel
- **FR-001.8:** SEO on-page (meta tags, Open Graph, structured data)
- **FR-001.9:** Header com navegação e login redirect
- **FR-001.10:** Footer com links institucionais e redes sociais

### FR-002: Autenticação & Onboarding
| Campo | Valor |
|-------|-------|
| Prioridade | P1 |
| Épico | EPIC-2 |
| Descrição | Redirect de login para plataforma GHL + onboarding inicial |

**Sub-requisitos:**
- **FR-002.1:** Botão "Entrar" redireciona para subdomínio GHL
- **FR-002.2:** Página de onboarding com setup wizard (configuração inicial)
- **FR-002.3:** Integração com checkout (Stripe) para assinatura dos planos

### FR-003: CRM & Pipeline
| Campo | Valor |
|-------|-------|
| Prioridade | P1 |
| Épico | EPIC-3 |
| Descrição | CRM configurado no GHL com pipeline específico para advocacia |

**Sub-requisitos:**
- **FR-003.1:** Pipeline visual com estágios: Novo Lead → Follow-up → Call Agendada → Proposta → Fechamento
- **FR-003.2:** Campos customizados para dados jurídicos (área, tipo de caso, valor da causa)
- **FR-003.3:** Automação de movimentação entre estágios baseada em comportamento
- **FR-003.4:** Dashboard com KPIs (oportunidades, valor pipeline, taxa conversão)

### FR-004: Agentes de IA
| Campo | Valor |
|-------|-------|
| Prioridade | P2 |
| Épico | EPIC-4 |
| Descrição | Agentes de IA para SDR, atendimento e triagem via WhatsApp |

**Sub-requisitos:**
- **FR-004.1:** Agente SDR com técnica SPIN Selling para qualificação de leads
- **FR-004.2:** Agente de atendimento 24/7 com conhecimento em direito bancário
- **FR-004.3:** Agendamento automático via Google Calendar
- **FR-004.4:** Transcrição automática de áudios do WhatsApp
- **FR-004.5:** Follow-up automático por inatividade

### FR-005: Marketing & Funis
| Campo | Valor |
|-------|-------|
| Prioridade | P2 |
| Épico | EPIC-5 |
| Descrição | Ferramentas de marketing e construção de funis no GHL |

**Sub-requisitos:**
- **FR-005.1:** Planejador de redes sociais integrado
- **FR-005.2:** Templates de funis de alta conversão para nicho jurídico
- **FR-005.3:** Gestão de Google Meu Negócio
- **FR-005.4:** Automações de email marketing

### FR-006: Omnichannel
| Campo | Valor |
|-------|-------|
| Prioridade | P1 |
| Épico | EPIC-3 |
| Descrição | Centralização de canais de comunicação |

**Sub-requisitos:**
- **FR-006.1:** Inbox unificada (WhatsApp, Instagram DM, Chat)
- **FR-006.2:** Histórico completo de conversas por lead
- **FR-006.3:** Templates de mensagens rápidas

---

## 3. Requisitos Não-Funcionais

### NFR-001: Performance
- Landing page: Lighthouse score >= 90 (Performance, SEO, Accessibility)
- Tempo de carregamento: < 3s (First Contentful Paint)
- Core Web Vitals dentro dos limites recomendados

### NFR-002: Responsividade
- Layout responsivo para Mobile (320px+), Tablet (768px+) e Desktop (1024px+)
- Mobile-first approach

### NFR-003: SEO
- Meta tags completas (title, description, Open Graph, Twitter Cards)
- Structured data (Schema.org — Organization, Product, FAQ)
- Sitemap XML e robots.txt

### NFR-004: Acessibilidade
- WCAG 2.1 Level AA
- Contraste adequado, navegação por teclado, alt texts

### NFR-005: Segurança
- HTTPS obrigatório
- CSP headers configurados
- Sanitização de inputs em formulários
- Compliance com LGPD (termos de uso, política de privacidade)

### NFR-006: Analytics
- Tracking de eventos (cliques em CTAs, scroll depth, formulários)
- UTM parameters tracking
- Conversion tracking (formulário enviado, plano selecionado)

---

## 4. UI/UX Design Goals

### 4.1 Design System
- **Tema:** Dark mode com acentos em azul (#0066FF)
- **Estilo:** Glassmorphism com design minimalista e zen
- **Tipografia:** Sans-serif moderna, hierarquia clara
- **Espaçamento:** Generoso (sensação de "paz" e organização)

### 4.2 Princípios de UX
- **Clareza:** Textos curtos, one-liners, benefícios óbvios
- **Confiança:** Prova social, números reais, garantias visíveis
- **Urgência sutil:** CTAs claros sem pressão excessiva
- **Fluidez:** Scroll suave, transições elegantes, tabs interativas

---

## 5. Premissas Técnicas

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Plataforma SaaS | GoHighLevel (White-label) | Funcionalidades prontas, custo-benefício |
| Landing Page | HTML5 + CSS3 + JS vanilla | Simplicidade, performance, SEO |
| Build Tool | Vite 6 | Hot reload, build rápido |
| Hospedagem LP | Vercel ou Netlify | Deploy automático, CDN global |
| Pagamento | Stripe via GHL | Integração nativa |
| Analytics | GA4 + Meta Pixel | Padrão de mercado |

---

## 6. Lista de Épicos

| ID | Épico | Prioridade | Status |
|----|-------|-----------|--------|
| EPIC-1 | Landing Page & Marketing Site | P0 | InProgress |
| EPIC-2 | Checkout & Onboarding | P1 | Draft |
| EPIC-3 | CRM, Pipeline & Omnichannel (GHL Config) | P1 | Draft |
| EPIC-4 | Agentes de IA & Automações (GHL Config) | P2 | Draft |
| EPIC-5 | Marketing, Funis & Sites (GHL Config) | P2 | Draft |
| EPIC-6 | Analytics, SEO & Growth | P1 | Draft |

---

## 7. Detalhamento dos Épicos

### EPIC-1: Landing Page & Marketing Site
**Objetivo:** Landing page de alta conversão que apresenta a ZENT I.A. e captura leads.
**Requisitos:** FR-001
**Stories estimadas:** 5-8

| Story | Descrição | Pontos |
|-------|-----------|--------|
| 1.1 | Otimização SEO (meta tags, Open Graph, structured data) | 3 |
| 1.2 | Integração Analytics (GA4, Meta Pixel, event tracking) | 3 |
| 1.3 | Formulários de captura de leads | 5 |
| 1.4 | Página de login/redirect para GHL | 2 |
| 1.5 | Otimização de performance (Lighthouse 90+) | 3 |
| 1.6 | Responsividade mobile completa (audit e fixes) | 3 |
| 1.7 | Página de Termos de Uso e Política de Privacidade (LGPD) | 2 |

### EPIC-2: Checkout & Onboarding
**Objetivo:** Fluxo de assinatura e primeiro acesso configurado.
**Requisitos:** FR-002
**Stories estimadas:** 3-5

| Story | Descrição | Pontos |
|-------|-----------|--------|
| 2.1 | Integração Stripe checkout com planos | 5 |
| 2.2 | Redirect de login para subdomínio GHL | 2 |
| 2.3 | Setup wizard de onboarding no GHL | 5 |
| 2.4 | Emails transacionais (boas-vindas, confirmação) | 3 |

### EPIC-3: CRM, Pipeline & Omnichannel (GHL Config)
**Objetivo:** Configurar CRM completo no GoHighLevel para escritórios de advocacia.
**Requisitos:** FR-003, FR-006
**Stories estimadas:** 5-7

| Story | Descrição | Pontos |
|-------|-----------|--------|
| 3.1 | Configurar pipeline de vendas (estágios jurídicos) | 3 |
| 3.2 | Campos customizados para dados jurídicos | 2 |
| 3.3 | Automações de movimentação de pipeline | 5 |
| 3.4 | Dashboard de KPIs no GHL | 5 |
| 3.5 | Configurar inbox omnichannel (WhatsApp + Instagram) | 3 |
| 3.6 | Templates de mensagens rápidas | 2 |

### EPIC-4: Agentes de IA & Automações (GHL Config)
**Objetivo:** Configurar agentes de IA e automações no GoHighLevel.
**Requisitos:** FR-004
**Stories estimadas:** 4-6

| Story | Descrição | Pontos |
|-------|-----------|--------|
| 4.1 | Configurar agente SDR (SPIN Selling) | 8 |
| 4.2 | Configurar agente de atendimento 24/7 | 5 |
| 4.3 | Setup de agendamento automático (Google Calendar) | 3 |
| 4.4 | Automações de follow-up por inatividade | 3 |
| 4.5 | Transcrição automática de áudios | 3 |

### EPIC-5: Marketing, Funis & Sites (GHL Config)
**Objetivo:** Configurar ferramentas de marketing no GoHighLevel.
**Requisitos:** FR-005
**Stories estimadas:** 3-5

| Story | Descrição | Pontos |
|-------|-----------|--------|
| 5.1 | Templates de funis de conversão (jurídico) | 5 |
| 5.2 | Configurar planejador de redes sociais | 3 |
| 5.3 | Configurar email marketing (templates + automações) | 3 |
| 5.4 | Integração Google Meu Negócio | 2 |

### EPIC-6: Analytics, SEO & Growth
**Objetivo:** Infraestrutura de dados e otimização contínua.
**Requisitos:** NFR-001, NFR-003, NFR-006
**Stories estimadas:** 3-4

| Story | Descrição | Pontos |
|-------|-----------|--------|
| 6.1 | Setup GA4 com eventos customizados | 3 |
| 6.2 | Setup Meta Pixel com conversões | 3 |
| 6.3 | UTM tracking e atribuição de leads | 2 |
| 6.4 | Dashboard de growth metrics | 3 |

---

## 8. Roadmap

```
Fase 1 (MVP) ─── EPIC-1: Landing Page ──────────── [AGORA]
                  EPIC-6: Analytics & SEO

Fase 2 ───────── EPIC-2: Checkout & Onboarding ─── [+2 semanas]
                  EPIC-3: CRM & Omnichannel

Fase 3 ───────── EPIC-4: IA & Automações ────────── [+4 semanas]
                  EPIC-5: Marketing & Funis
```

---

## 9. Planos & Preços

| Plano | Preço | Leads | Usuários | Módulos-Chave |
|-------|-------|-------|----------|---------------|
| **Starter** | R$ 97/mês | 500 | 1 | Painel, CRM, Agenda, Leads |
| **Básico** | R$ 397/mês | 1.000 | 3 | + Omnichannel, Marketing, Relatórios |
| **Profissional** | R$ 697/mês | 5.000 | 5 | + IA (SDR), Automações, Funis & Sites |
| **Premium** | R$ 997/mês | Ilimitados | 10 | + Área de Membros, Drive, GMB, Suporte VIP |

---

## 10. Checklist de Validação

- [x] Problema claramente definido
- [x] Público-alvo identificado e persona criada
- [x] Requisitos funcionais documentados (FR-001 a FR-006)
- [x] Requisitos não-funcionais documentados (NFR-001 a NFR-006)
- [x] Épicos definidos com stories estimadas
- [x] Roadmap com fases claras
- [x] Stack técnica definida
- [x] Riscos identificados (ver Project Brief)
- [ ] Validação com stakeholders
- [ ] Review de @architect

---

## 11. Próximos Passos

1. **@po** → Validar PRD e priorizar backlog
2. **@architect** → Review técnico e architecture doc
3. **@sm** → Criar stories detalhadas do EPIC-1
4. **@dev** → Iniciar implementação do EPIC-1
5. **@qa** → Definir critérios de qualidade

---

*PRD gerado pelo Synkra AIOS — v1.0*
