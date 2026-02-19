# Project Brief — ZENT I.A.

**Data:** 2026-02-17
**Versão:** 1.0
**Status:** Aprovado

---

## 1. Resumo Executivo

ZENT I.A. é uma plataforma SaaS white-label sobre GoHighLevel (GHL) voltada para **escritórios de advocacia**, com foco inicial em **direito bancário**. O produto centraliza CRM, marketing, automações e agentes de IA em uma interface unificada, permitindo que advogados organizem seu fluxo comercial — do lead ao fechamento — sem depender de ferramentas fragmentadas.

O MVP consiste na **landing page de vendas** que apresenta a proposta de valor, planos e funcionalidades da plataforma.

---

## 2. Problema

### Problema Central
Escritórios de advocacia perdem leads qualificados e receita por falta de organização comercial. Ferramentas desconectadas (WhatsApp pessoal, planilhas, CRMs genéricos) geram:

- **Leads perdidos** por demora no atendimento (40-60% de follow-ups esquecidos)
- **Falta de previsibilidade** financeira (sem pipeline estruturado)
- **Tempo gasto em operacional** que deveria ser dedicado à advocacia
- **Ausência de dados** para tomada de decisão

### Dor Emocional
- Frustração com dinheiro investido em tráfego pago sem retorno
- Ansiedade com demanda reprimida que não converte
- Cansaço de gerenciar operacional manualmente

---

## 3. Solução Proposta

Plataforma all-in-one white-label (GoHighLevel) que oferece:

| Módulo | Descrição |
|--------|-----------|
| **Meu Painel** | Dashboard em tempo real com KPIs, pipeline e funil de vendas |
| **CRM Inteligente** | Gestão de leads com automação comportamental |
| **Agenda** | Integrada ao Google Calendar com confirmação automática |
| **Omnichannel** | WhatsApp, Instagram e Chat em uma tela |
| **Marketing** | Planejador de redes sociais |
| **Funis & Sites** | Construtor de landing pages de alta conversão |
| **Agentes de IA** | SDR, atendimento e triagem 24/7 com SPIN Selling |
| **Automações** | Fluxos de trabalho inteligentes |
| **Área de Membros** | Para infoprodutos jurídicos |

---

## 4. Usuários-Alvo

### Primário: Advogado(a) Empreendedor(a)
- **Perfil:** Sócio(a) de escritório de direito bancário, 30-45 anos
- **Contexto:** Investe em tráfego pago, mas não tem time comercial estruturado
- **Necessidade:** Automatizar captação e qualificação de leads
- **Persona:** Dra. Camila Moretti, 37 anos, sócia de escritório

### Secundário: Gestor de Escritório
- **Perfil:** Responsável pelo operacional e financeiro
- **Necessidade:** Visão consolidada de métricas e performance

---

## 5. Metas & Métricas de Sucesso

### Objetivos de Negócio
| Meta | Métrica | Target |
|------|---------|--------|
| Aquisição | Leads via landing page | 100 leads/mês |
| Conversão | Taxa de trial/assinatura | 10-15% |
| Receita | MRR | R$ 10K em 6 meses |
| Retenção | Churn mensal | < 5% |

### Métricas de Usuário
| Métrica | Target |
|---------|--------|
| Aumento na conversão de leads | 40-50% |
| Redução de leads perdidos | 60% |
| Aumento em agendamentos | 3-5x |
| ROI do cliente | 400-800% |

---

## 6. Escopo do MVP

### Must-Have (Fase 1 — Landing Page)
- [x] Landing page responsiva com proposta de valor
- [x] Seção Hero com CTA principal
- [x] Seções de features com tabs interativas
- [x] Tabela comparativa (caos vs. organização)
- [x] Seção de preços com 4 planos
- [x] Prova social / depoimentos
- [x] CTA final
- [ ] Otimização SEO e meta tags
- [ ] Integração com analytics (GA4, Meta Pixel)
- [ ] Formulários de captura de leads
- [ ] Página de login/redirect para GHL

### Out-of-scope (MVP)
- Desenvolvimento de backend próprio
- App mobile nativo
- Integrações customizadas além do GHL
- Área administrativa personalizada

### Critérios de Sucesso do MVP
- Landing page no ar com domínio próprio
- Formulários de captura funcionando
- Analytics configurado
- Redirecionamento para plataforma GHL funcional

---

## 7. Visão Pós-MVP

### Fase 2 — Configuração GHL
- Configuração completa do CRM no GoHighLevel
- Setup de automações (follow-up, confirmação, lembretes)
- Configuração de agentes de IA (SDR, atendimento)
- Templates de funis de vendas

### Fase 3 — Expansão
- Customização avançada do dashboard
- Templates específicos para outros nichos jurídicos
- Área de membros com conteúdo educacional
- Programa de afiliados

### Visão de Longo Prazo
- Verticalização por nicho jurídico (trabalhista, tributário, etc.)
- Marketplace de templates e automações
- IA avançada com análise preditiva de leads

---

## 8. Considerações Técnicas

### Stack Atual
| Camada | Tecnologia |
|--------|-----------|
| Landing Page | HTML5 + CSS3 + JavaScript vanilla |
| Build Tool | Vite 6 |
| Plataforma SaaS | GoHighLevel (white-label) |
| Hospedagem | A definir (Vercel/Netlify para landing) |

### Integrações Planejadas
- GoHighLevel API (CRM, automações, funis)
- WhatsApp Business API (via GHL)
- Google Calendar API (via GHL)
- Stripe / Gateway de pagamento
- Google Analytics 4
- Meta Pixel

---

## 9. Restrições & Premissas

### Restrições
- Funcionalidades core limitadas ao que o GoHighLevel oferece
- Branding e customização visual limitados ao white-label do GHL
- Dependência da estabilidade e APIs do GoHighLevel

### Premissas
- GoHighLevel suporta todas as funcionalidades listadas nos planos
- O público-alvo (advogados) está disposto a pagar entre R$ 97-997/mês
- A IA treinada em SPIN Selling + direito bancário é viável no GHL

---

## 10. Riscos & Questões Abertas

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| GHL limitar funcionalidades | Média | Alto | Ter plano B de migração |
| Baixa conversão da landing page | Média | Alto | A/B testing + analytics |
| Concorrência no nicho jurídico | Alta | Médio | Diferencial em IA e automação |
| Churn por curva de aprendizado | Média | Médio | Onboarding assistido |

### Questões Abertas
- [ ] Definir domínio e hospedagem da landing page
- [ ] Confirmar planos e preços finais
- [ ] Validar viabilidade dos agentes de IA no GHL
- [ ] Definir estratégia de onboarding

---

## 11. Próximos Passos

1. **Finalizar Landing Page** → Otimizar SEO, analytics e formulários
2. **Criar PRD detalhado** → Requisitos funcionais e não-funcionais
3. **Configurar GoHighLevel** → Setup inicial da plataforma
4. **Validar com early adopters** → 5-10 escritórios beta

---

*Documento gerado pelo Synkra AIOS — @pm handoff para PRD*
