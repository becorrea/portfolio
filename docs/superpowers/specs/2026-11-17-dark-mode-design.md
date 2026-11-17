# Modo escuro automático — design

**Data:** 2026-11-17 · **Base:** Manual de Marca Stelqo v1.0 (pp. 18, 23, 24, 26)

## Intenção
O site segue o modo escuro do aparelho do visitante, com cores tiradas só do manual da marca. Claro continua sendo o padrão (manual p. 26: Papel 60% · Grafite 25%).

## Objetivos
- `@media (prefers-color-scheme: dark)` liga o modo escuro; nenhum botão, nenhum JS.
- Todas as cores do modo escuro vêm da paleta e das escalas do manual.
- Contraste de texto ≥ 4,5:1 (WCAG 2.1, como o manual exige).

## Fora do escopo / proibido
- Botão sol/lua ou escolha salva (pode vir depois, por cima disto).
- Mudar o modo claro: ele deve ficar pixel-idêntico ao de hoje.
- Mudar os mocks: conteúdo do Laboratório (`.pv`, `#lab-tpl`; a moldura `#laboratorio` segue as seções `.dark`) e o trabalho da clínica (`.cs-hero`, `.gal`, `.phones`, telas/paleta da clínica, `.pillar .n`) ficam iguais nos dois modos.
- `filter: invert` ou qualquer inversão automática.

## Abordagens
- **A. Cores por função (escolhida).** Variáveis de papel (`--bg`, `--fg`, `--fg-2`, `--surface`, `--surface-2`, `--accent`, `--line`…) em `stelqo.css`; as regras de superfície clara passam a usá-las; um bloco `@media (prefers-color-scheme: dark)` troca os valores. Uma regra por elemento, cor nova já nasce nos dois modos. Custo: muitas regras tocadas, verificação nos dois modos.
- B. Bloco de sobrescritas por seletor. Não toca o claro, mas duplica tudo e envelhece. Recusada.
- Inversão por filtro. Quebra cores da marca, fotos e mocks. Recusada.

## Mapa de cores (modo escuro)
| Papel | Claro (hoje) | Escuro | Fonte |
|---|---|---|---|
| Fundo da página `--bg` | Papel #F8F5F2 | Grafite Noite #0B0E14 | p. 23 |
| Superfície / cartão `--surface` (hoje `#fff`) | Branco | Neutro 800 #1C2029 | p. 24 |
| Fundo alternativo `--surface-2` (hoje `--paper-2`/`--paper-3`) | #ECEAE6 / #E4E2DE | Neutro 800 #1C2029 (com borda `--line`) ou 700 #3C4150 para pequenos detalhes | p. 24 |
| Texto `--fg` | Grafite #0B0E14 | Papel #F8F5F2 (19,3:1) | p. 26 |
| Texto secundário `--fg-2` | #5E6372 / #3C4150 | Neutro 400 #A6A9B3 | p. 24/26 |
| Linhas `--line`, `--line-2` | rgba(11,14,20,.12/.2) | rgba(248,245,242,.14/.24) | — |
| Destaque, link, `em` de título, linha do eyebrow, foco | Azul Stelqo #0A33FF | Azul Claro #8EA6FF (8,3:1) | p. 24/26 |
| Botão principal `.btn-blue` | Azul + branco | igual (7,2:1) | p. 26 |
| `.btn-ink` (escuro sobre claro) | Grafite + papel | vira papel + grafite (mesma regra de `.dark .btn-*` de hoje) | — |
| Seções `.dark` (rodapé, CTA band, etc.) | Grafite #0B0E14 | Neutro 800 #1C2029, para se separar do fundo | p. 24 |
| Cabeçalho fixo e menu móvel | papel translúcido | grafite translúcido rgba(11,14,20,.86–.92) | — |
| Logo do topo | positiva | negativa via `<picture><source media="(prefers-color-scheme: dark)">` | p. 18 |
| Onda de Luz | igual | igual (gradiente vale sobre escuro neutro) | p. 18 |

`<meta name="color-scheme" content="light dark">` em todas as páginas, para barra de rolagem e campos do formulário nativos acompanharem.

## Decidido pelo construtor (chamadas minhas)
- Variáveis de cor fixa (`--ink`, `--paper`, `--blue`, `--lav`…) continuam com o nome e valor de hoje; quem tem significado de cor fixa (seções `.dark`, botões) segue usando elas.
- Sombras escuras sobre fundo escuro: reduzir/neutralizar onde virarem mancha.
- Cartão de serviço escuro dentro de lista (`.svc-3.dark`) ganha borda `--line` para não sumir entre cartões `--surface`.
- Formulário do contato: campos com fundo `--surface`, texto `--fg`, placeholder `--fg-2`.

## Verificação
- `bash scripts/check-brand.sh` continua OK; ganha checagem: cada página tem `color-scheme` e o `<picture>` do logo.
- Modo claro: captura antes/depois das 6 páginas em 1440 e 390 — idênticas.
- Modo escuro (Chrome headless com `--force-dark-mode`/emulação `prefers-color-scheme: dark`): 6 páginas em 1440 e 390, sem texto ilegível, sem seção sumindo, mocks iguais ao claro, overflow horizontal 0.
- Formulário nunca enviado em teste (CRM real): `fetch`/`sendBeacon` bloqueados nas cópias.
