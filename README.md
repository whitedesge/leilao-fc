# Leilão FC

Site de **Leilão de Jogadores de Futebol** (2000–2027) no estilo EA FC Ultimate Team.

## Modos

| Modo | Descrição |
|------|-----------|
| **Contra a Máquina** | IA estratégica, levemente favorável ao humano |
| **Local 2 Jogadores** | Mesmo dispositivo – passe o celular/controle |
| **Online 1v1** | PeerJS (WebRTC) – sem backend Node.js |

## Formatos

- **Futsal**: R$ 50 · 5 jogadores (GK, Fixo, PE, PD, MC)
- **Campo**: R$ 150 · 11 jogadores · formações 4-3-3, 4-4-2 ou 3-5-2

No modo campo, cada formação define quantas vagas existem na defesa, no meio-campo e no ataque. O goleiro tem uma vaga exclusiva; jogadores só podem ocupar vagas da sua divisão.

Na preparação, também é possível filtrar os atletas por década (2000–2009, 2010–2019 ou 2020–2027) e, opcionalmente, incluir lendas fora do período. A seleção padrão mantém o elenco completo.

## Fluxo

1. Escolha o modo e o formato
2. Tela de **preparação** (elencos zerados, nenhum gasto automático)
3. Clique em **Iniciar Leilão**
4. A cada rodada um jogador é revelado
5. Use **+1**, **+5** ou **+10** para compor o aumento e **Enviar lance** para confirmar; também é possível **Passar**
6. Se um passa e o outro ofertado → o ofertante leva
7. Se ambos passam → próximo jogador

## Tecnologias

- HTML5 + CSS3 + JavaScript vanilla
- PeerJS para multiplayer P2P
- 100% estático → GitHub Pages / Netlify / Vercel

## Deploy

```bash
# GitHub Pages, Netlify ou Vercel
# Basta publicar a pasta leilao-fc (ou o conteúdo na raiz)
```

Nenhum build step necessário.
