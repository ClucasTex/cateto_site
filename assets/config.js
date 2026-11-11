// Configuração do site CATETO
// 1) Crie um projeto gratuito em https://supabase.com
// 2) Em Project Settings > API copie o "Project URL" e a chave "anon public"
// 3) Cole-os aqui. A chave "anon" pode estar pública; a segurança é feita pelas regras do ficheiro supabase/setup.sql
window.CATETO = {
  SUPABASE_URL: "",       // ex.: "https://abcdxyz.supabase.co"
  SUPABASE_ANON_KEY: "",  // ex.: "eyJhbGciOi..."

  // Tour virtual (pasta do Panotour com o ficheiro fundo.html) que roda no fundo da secção CATETO360.
  // Deixe "" para usar só a panorâmica abaixo.
  TOUR: "tour/principal/",

  // Panorâmica 360° usada se o tour não existir (imagem equirectangular 2:1, ex.: 6000x3000) que roda no fundo da secção CATETO360.
  // Ponha o ficheiro em assets/ e escreva aqui o nome. Deixe "" para não mostrar.
  PANORAMA: "assets/360.jpg"
};

window.CATETO.db = function () {
  var c = window.CATETO;
  if (!c.SUPABASE_URL || !c.SUPABASE_ANON_KEY || !window.supabase) return null;
  if (!c._db) c._db = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);
  return c._db;
};
