# Site CATETO Topografia

Site estático para GitHub Pages, com área de clientes e comentários ligados ao Supabase (gratuito).

```
index.html            site principal
clientes/index.html   área de clientes (entrar, recuperar palavra-passe, ficheiros e tours 360°)
clientes/admin.html   gestão (criar clientes, carregar ficheiros, tours, aprovar comentários)
assets/config.js      ligação ao Supabase
supabase/setup.sql    tabelas e regras de segurança
tour/principal/        tour virtual Panotour (fundo da secção CATETO360)
```

## 1. Supabase (área de clientes e comentários)

O GitHub Pages só serve páginas estáticas e não corre PHP. O login, os ficheiros e os comentários ficam no Supabase.

1. Crie uma conta em https://supabase.com e um projeto novo (região: West EU).
2. **SQL Editor**: cole o conteúdo de `supabase/setup.sql` e carregue em **Run**. O administrador definido é `ct@cateto.pt`; troque na última linha se quiser outro email.
3. **Authentication > Users > Add user**: crie a sua conta com o email do administrador e uma palavra-passe.
4. **Authentication > Sign In / Providers > Email**: desligue **Confirm email**, para que os clientes que cria possam entrar logo. Se o deixar ligado, cada cliente recebe primeiro um email de confirmação.
5. **Authentication > URL Configuration**: em **Site URL** ponha `https://www.cateto.pt` e em **Redirect URLs** acrescente `https://www.cateto.pt/clientes/`. Isto serve para o link de "Esqueci-me da palavra-passe".
6. **Project Settings > API**: copie o **Project URL** e a chave **anon public** para `assets/config.js`.

Tamanho máximo por ficheiro no plano gratuito: 50 MB (pode alterar em Storage > Settings). O plano gratuito inclui 1 GB de ficheiros.

## 2. Usar a área de clientes

- Entre em `/clientes/` com a conta de administrador. Aparece o link **Gestão**.
- **Novo cliente**: nome, email e palavra-passe (o botão Gerar cria uma). No fim aparece a mensagem pronta a copiar e enviar ao cliente.
- Escolha o cliente na lista para carregar ficheiros (PDF, DWG, DXF, ZIP...) e acrescentar links de tours 360°.
- Separador **Comentários**: aprove ou apague os comentários deixados no site. Só os aprovados aparecem.
- Para apagar a conta de um cliente: Supabase > Authentication > Users > apagar. Os tours e a ficha saem automaticamente; os ficheiros apague-os antes, na gestão.

Os clientes antigos do cateto360.com não passam automaticamente: crie-os de novo na gestão.

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
