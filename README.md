# Site CATETO Topografia

Site estático para GitHub Pages.

```
index.html            site principal
assets/config.js      tour e panorâmica da secção CATETO360
tour/principal/        tour virtual Panotour (fundo da secção CATETO360)
```

## 1. Área de clientes

O botão "Área de clientes" abre a área que já existe em https://cateto360.com/login.php.

## 2. Comentários

O formulário "Deixe o seu comentário" abre o programa de email do visitante com a mensagem para ct@cateto.pt. Para publicar um comentário novo, acrescente uma linha à lista `BASE` em `assets/comentarios.js` (nome, data AAAA-MM-DD, língua pt/en/fr, texto).

## 3. Tour virtual no fundo da secção CATETO360

A secção CATETO360 mostra por trás do texto o tour `tour/principal/` (Estiramantens) a rodar sozinho, sem botões nem menus.

- `tour/principal/fundo.html` é a versão de fundo (feita para o site). O resto da pasta é o tour tal como sai do Panotour.
- Para trocar de tour: copie a pasta `indexdata` do novo tour para `tour/<nome>/`, copie também o `fundo.html` para lá e mude `TOUR` em `assets/config.js`. O fundo começa na primeira vista definida no Panotour.
- A velocidade de rotação muda-se em `VELOCIDADE`, no `fundo.html`.
- O tour serve só de fundo e não se pode abrir à parte. Para isso, copie para `tour/principal/` apenas a pasta `indexdata` do Panotour, **sem** o `index.html` dele.
- Se não houver tour, o site usa a panorâmica `assets/360.jpg`.

## 4. Publicar no GitHub Pages

1. Crie um repositório no GitHub (por exemplo `cateto-site`) e envie todos estes ficheiros.
2. **Settings > Pages**: Source **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Domínio: em **Custom domain** escreva `www.cateto.pt` e ative **Enforce HTTPS**.
4. No fornecedor do domínio, configure o DNS:
   - `www` → registo **CNAME** para `<o-seu-utilizador>.github.io`
   - `cateto.pt` (raiz) → registos **A** para `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

A mudança de DNS pode levar algumas horas a propagar.
