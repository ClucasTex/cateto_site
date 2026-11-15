// CATETO: aviso por email quando um cliente descarrega ou abre um ficheiro.
// Cole este código num projeto novo em script.google.com (com a sua conta Google)
// e publique-o como "Aplicação Web" (ver README).

const SEGREDO = 'COLE_AQUI_O_SEGREDO';   // igual ao guardado no Supabase (aviso_config)
const PARA = 'ct@cateto.pt';                           // para onde vão os avisos
const GESTAO = 'https://clucastex.github.io/cateto_site/clientes/admin.html';

function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return ContentService.createTextOutput('erro'); }
  if (d.segredo !== SEGREDO) return ContentService.createTextOutput('recusado');

  MailApp.sendEmail({
    to: PARA,
    subject: 'CATETO | ' + d.cliente + ' ' + d.acao + ': ' + d.item,
    body:
      d.cliente + ' (' + d.email + ') ' + d.acao + ' "' + d.item + '" em ' + d.quando + '.\n\n' +
      'Ver toda a atividade do cliente na gestão:\n' + GESTAO,
    name: 'Área de clientes CATETO'
  });
  return ContentService.createTextOutput('ok');
}

// Para experimentar: no editor, escolha "testarAviso" e carregue em Executar.
function testarAviso() {
  doPost({ postData: { contents: JSON.stringify({
    segredo: SEGREDO, cliente: 'Cliente de teste', email: 'teste@exemplo.pt',
    acao: 'descarregou', item: 'Planta.pdf', quando: 'agora' }) } });
}
