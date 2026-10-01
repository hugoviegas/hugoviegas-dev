import { useCallback } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import type { Translation } from "@/config/translations";

// Admin-only strings live in the lazy admin chunk so they stay out of the
// homepage bundle. Same EN / PT shape as src/config/translations.ts.
const adminStrings = {
  title: { EN: "Content admin", PT: "Administração de conteúdo" },
  intro: {
    EN: "Private area. Sign in with the owner's Google account.",
    PT: "Área privada. Entre com a conta Google do proprietário.",
  },
  signIn: { EN: "Sign in with Google", PT: "Entrar com Google" },
  signOut: { EN: "Sign out", PT: "Sair" },
  loading: { EN: "Checking sign-in…", PT: "Verificando login…" },
  checking: { EN: "Checking access…", PT: "Verificando acesso…" },
  denied: {
    EN: "This account does not have access. It has been signed out.",
    PT: "Esta conta não tem acesso. Ela foi desconectada.",
  },
  error: {
    EN: "Could not verify access. Check your connection and try again.",
    PT: "Não foi possível verificar o acesso. Verifique sua conexão e tente novamente.",
  },
  retry: { EN: "Try again", PT: "Tentar novamente" },
  signInError: {
    EN: "Sign-in failed. Try again.",
    PT: "Falha ao entrar. Tente novamente.",
  },
  unconfigured: {
    EN: "Firebase is not configured for this build. Set the VITE_FIREBASE_* variables.",
    PT: "O Firebase não está configurado nesta build. Defina as variáveis VITE_FIREBASE_*.",
  },
  signedInAs: { EN: "Signed in as", PT: "Conectado como" },
  granted: { EN: "Access confirmed.", PT: "Acesso confirmado." },

  // Dashboard and collections
  "tab.overview": { EN: "Overview", PT: "Visão geral" },
  "tab.files": { EN: "Files", PT: "Arquivos" },
  "tab.settings": { EN: "Settings", PT: "Configurações" },
  "col.experience": { EN: "Experience", PT: "Experiência" },
  "col.education": { EN: "Education", PT: "Formação" },
  "col.projects": { EN: "Projects", PT: "Projetos" },
  "col.projectDetails": { EN: "Project pages", PT: "Páginas de projeto" },
  "col.skills": { EN: "Skills", PT: "Habilidades" },
  "col.about": { EN: "About", PT: "Sobre" },
  overviewIntro: {
    EN: "Published docs appear on the site right away. Page titles, social previews, and the bundled snapshot update on the next deploy.",
    PT: "Documentos publicados aparecem no site na hora. Títulos de página, prévias sociais e o snapshot do build atualizam no próximo deploy.",
  },
  collectionLabel: { EN: "Collection", PT: "Coleção" },
  publishedLabel: { EN: "Published", PT: "Publicados" },
  draftsLabel: { EN: "Drafts", PT: "Rascunhos" },
  loadingContent: { EN: "Loading…", PT: "Carregando…" },
  loadError: { EN: "Could not load content:", PT: "Não foi possível carregar o conteúdo:" },
  reload: { EN: "Reload", PT: "Recarregar" },

  // List actions
  newDoc: { EN: "New", PT: "Novo" },
  edit: { EN: "Edit", PT: "Editar" },
  publish: { EN: "Publish", PT: "Publicar" },
  unpublish: { EN: "Unpublish", PT: "Despublicar" },
  moveUp: { EN: "Move up", PT: "Mover para cima" },
  moveDown: { EN: "Move down", PT: "Mover para baixo" },
  history: { EN: "History", PT: "Histórico" },
  delete: { EN: "Delete", PT: "Excluir" },
  statusPublished: { EN: "Published", PT: "Publicado" },
  statusDraft: { EN: "Draft", PT: "Rascunho" },
  emptyList: { EN: "No docs yet.", PT: "Nenhum documento ainda." },
  saved: { EN: "Saved.", PT: "Salvo." },
  deleted: { EN: "Deleted. It can be restored from history.", PT: "Excluído. Pode ser restaurado pelo histórico." },
  saveError: { EN: "Could not save:", PT: "Não foi possível salvar:" },
  staleError: {
    EN: "This doc changed since it was loaded. Reload and try again.",
    PT: "Este documento mudou desde que foi carregado. Recarregue e tente de novo.",
  },
  publishBlocked: {
    EN: "Fill in the required text in English and Portuguese before publishing.",
    PT: "Preencha o texto obrigatório em inglês e português antes de publicar.",
  },
  confirmDeleteTitle: { EN: "Delete this doc?", PT: "Excluir este documento?" },
  confirmDeleteBody: {
    EN: "It disappears from the site after the next refresh. A copy stays in history.",
    PT: "Ele some do site na próxima atualização. Uma cópia fica no histórico.",
  },
  cancel: { EN: "Cancel", PT: "Cancelar" },
  confirm: { EN: "Confirm", PT: "Confirmar" },

  // Editor
  editorNew: { EN: "New doc", PT: "Novo documento" },
  editorEdit: { EN: "Edit doc", PT: "Editar documento" },
  save: { EN: "Save", PT: "Salvar" },
  saving: { EN: "Saving…", PT: "Salvando…" },
  back: { EN: "Back to list", PT: "Voltar à lista" },
  english: { EN: "English", PT: "Inglês" },
  portuguese: { EN: "Portuguese (Brazil)", PT: "Português (Brasil)" },
  sharedFields: { EN: "Both languages", PT: "Ambos os idiomas" },
  addItem: { EN: "Add item", PT: "Adicionar item" },
  removeItem: { EN: "Remove item", PT: "Remover item" },
  itemLabel: { EN: "Item", PT: "Item" },
  formHasErrors: { EN: "Fix the highlighted fields.", PT: "Corrija os campos destacados." },
  "err.publishBoth": {
    EN: "Required in both languages before publishing.",
    PT: "Obrigatório nos dois idiomas antes de publicar.",
  },
  "err.tooLong": { EN: "Too long.", PT: "Muito longo." },
  "err.format": { EN: "Invalid format.", PT: "Formato inválido." },
  "err.idTaken": { EN: "This id already exists.", PT: "Este id já existe." },
  "err.invalid": { EN: "Invalid value.", PT: "Valor inválido." },

  // Fields
  "field.id": { EN: "Id (lowercase letters, numbers, hyphens)", PT: "Id (letras minúsculas, números, hífens)" },
  "field.published": { EN: "Published", PT: "Publicado" },
  "field.order": { EN: "Order", PT: "Ordem" },
  "field.title": { EN: "Title", PT: "Título" },
  "field.organization": { EN: "Organisation", PT: "Organização" },
  "field.location": { EN: "Location", PT: "Local" },
  "field.period": { EN: "Period", PT: "Período" },
  "field.description": { EN: "Description", PT: "Descrição" },
  "field.bullets": { EN: "Bullets", PT: "Tópicos" },
  "field.imageAlt": { EN: "Image alt text", PT: "Texto alternativo da imagem" },
  "field.image": { EN: "Image", PT: "Imagem" },
  "field.imageWidth": { EN: "Image width (px)", PT: "Largura da imagem (px)" },
  "field.imageHeight": { EN: "Image height (px)", PT: "Altura da imagem (px)" },
  "field.technologies": { EN: "Technologies", PT: "Tecnologias" },
  "field.liveUrl": { EN: "Live URL", PT: "URL ao vivo" },
  "field.githubUrl": { EN: "GitHub URL", PT: "URL do GitHub" },
  "field.detailPath": { EN: "Detail page path", PT: "Caminho da página de detalhe" },
  "field.summary": { EN: "Summary", PT: "Resumo" },
  "field.sections": { EN: "Sections", PT: "Seções" },
  "field.sectionId": { EN: "Section id", PT: "Id da seção" },
  "field.body": { EN: "Body", PT: "Texto" },
  "field.items": { EN: "Items", PT: "Itens" },
  "field.faq": { EN: "FAQ", PT: "Perguntas frequentes" },
  "field.question": { EN: "Question", PT: "Pergunta" },
  "field.answer": { EN: "Answer", PT: "Resposta" },
  "field.storyTitle": { EN: "Story title", PT: "Título da história" },
  "field.storyIntro": { EN: "Story intro", PT: "Introdução da história" },
  "field.story": { EN: "Story", PT: "História" },
  "field.stack": { EN: "Stack", PT: "Tecnologias" },
  "field.label": { EN: "Label", PT: "Rótulo" },
  "field.group": { EN: "Group", PT: "Grupo" },
  "field.iconKey": { EN: "Icon", PT: "Ícone" },
  "field.paragraphs": { EN: "Summary paragraphs", PT: "Parágrafos do resumo" },
  "field.highlights": { EN: "Highlights", PT: "Destaques" },
  "field.fullStory": { EN: "Full story", PT: "História completa" },
  "hint.onePerLine": { EN: "One per line.", PT: "Um por linha." },
  "hint.httpsOrEmpty": { EN: "https:// address, or empty.", PT: "Endereço https://, ou vazio." },
  "hint.detailPath": {
    EN: "For example /projects/big-bang-duel, or empty.",
    PT: "Por exemplo /projects/big-bang-duel, ou vazio.",
  },
  "hint.sectionId": {
    EN: "The page uses try, built, and challenges.",
    PT: "A página usa try, built e challenges.",
  },
  "hint.markdown": {
    EN: "Markdown: # headings, - lists, **bold**, *italic*, > quotes.",
    PT: "Markdown: # títulos, - listas, **negrito**, *itálico*, > citações.",
  },
  "hint.projectDetails": {
    EN: "Only darcy-mcgees and big-bang-duel have pages on the site. Other ids are stored but not shown.",
    PT: "Só darcy-mcgees e big-bang-duel têm páginas no site. Outros ids ficam salvos, mas não aparecem.",
  },
  noneOption: { EN: "None", PT: "Nenhum" },
  "group.programming": { EN: "Programming", PT: "Programação" },
  "group.it": { EN: "IT & infrastructure", PT: "TI e infraestrutura" },
  "group.certification": { EN: "Skills & certifications", PT: "Habilidades e certificações" },
  "group.focus": { EN: "Professional focus", PT: "Foco profissional" },

  // History
  historyTitle: { EN: "History", PT: "Histórico" },
  historyEmpty: { EN: "No earlier versions.", PT: "Nenhuma versão anterior." },
  historyVersion: { EN: "Version", PT: "Versão" },
  restore: { EN: "Restore", PT: "Restaurar" },
  deletedTitle: {
    EN: "Deleted docs (open history to restore)",
    PT: "Documentos excluídos (abra o histórico para restaurar)",
  },
  restored: { EN: "Restored.", PT: "Restaurado." },
  restoreInvalid: {
    EN: "This version no longer matches the content rules and cannot be restored as is.",
    PT: "Esta versão não segue mais as regras de conteúdo e não pode ser restaurada como está.",
  },
  confirmRestoreTitle: { EN: "Restore this version?", PT: "Restaurar esta versão?" },
  confirmRestoreBody: {
    EN: "The current version is saved to history first.",
    PT: "A versão atual é salva no histórico antes.",
  },

  // Settings
  useRemoteLabel: {
    EN: "Use Firestore content on the public site",
    PT: "Usar o conteúdo do Firestore no site público",
  },
  useRemoteHint: {
    EN: "Kill switch. When off, the site and the build use the committed snapshot only.",
    PT: "Chave de emergência. Desligada, o site e o build usam só o snapshot do repositório.",
  },
  lastUpdated: { EN: "Last content update:", PT: "Última atualização de conteúdo:" },
  "files.intro": {
    EN: "Files are uploaded to the public Vercel Blob store and appear on the site right after saving. Replacing a file does not delete the old one; remove old files in the Vercel dashboard.",
    PT: "Os arquivos vão para a store pública do Vercel Blob e aparecem no site logo depois de salvar. Substituir um arquivo não apaga o antigo; remova os antigos no painel da Vercel.",
  },
  "files.cvTitle": { EN: "CV (PDF)", PT: "Currículo (PDF)" },
  "files.cvCurrent": { EN: "Open the current CV", PT: "Abrir o currículo atual" },
  "files.cvFallback": {
    EN: "No CV uploaded yet. The site uses the CV link built into the code.",
    PT: "Nenhum currículo enviado ainda. O site usa o link de currículo que está no código.",
  },
  "files.cvFile": { EN: "New CV file", PT: "Novo arquivo do currículo" },
  "files.pdfLimit": { EN: "PDF only, up to", PT: "Somente PDF, até" },
  "files.imageLimit": { EN: "Stored as WebP, AVIF, JPEG or PNG, up to", PT: "Salva como WebP, AVIF, JPEG ou PNG, até" },
  "files.autoCompress": {
    EN: "Any image works: larger files and other formats are compressed automatically, keeping the highest quality that fits.",
    PT: "Qualquer imagem serve: arquivos maiores e outros formatos são comprimidos automaticamente, com a maior qualidade que couber.",
  },
  "files.publicHint": {
    EN: "Anyone with the link can open the file.",
    PT: "Qualquer pessoa com o link pode abrir o arquivo.",
  },
  "files.uploadSave": { EN: "Upload and use", PT: "Enviar e usar" },
  "files.photoTitle": { EN: "Profile photo", PT: "Foto de perfil" },
  "files.photoCurrent": { EN: "Current photo:", PT: "Foto atual:" },
  "files.photoFallback": {
    EN: "No photo uploaded yet. The site uses the photo built into the code.",
    PT: "Nenhuma foto enviada ainda. O site usa a foto que está no código.",
  },
  "files.photoFile": { EN: "New photo file (optional when only editing the alt text)", PT: "Novo arquivo de foto (opcional se for só editar o texto alternativo)" },
  "files.altRequired": {
    EN: "Alt text is required in both languages.",
    PT: "O texto alternativo é obrigatório nos dois idiomas.",
  },
  "files.savePhoto": { EN: "Save photo", PT: "Salvar foto" },
  "files.projectFile": { EN: "Upload a new image", PT: "Enviar uma nova imagem" },
  "files.projectHint": {
    EN: "Width and height are filled in from the file. Save the project to use it.",
    PT: "A largura e a altura são preenchidas a partir do arquivo. Salve o projeto para usá-la.",
  },
  "files.upload": { EN: "Upload", PT: "Enviar" },
  "files.uploadedImage": { EN: "Uploaded image", PT: "Imagem enviada" },
  "upload.chooseFile": { EN: "Choose a file first.", PT: "Escolha um arquivo primeiro." },
  "upload.uploading": { EN: "Uploading…", PT: "Enviando…" },
  "crop.title": { EN: "Crop the image", PT: "Recortar a imagem" },
  "crop.description": {
    EN: "Drag the image or use the arrow keys to position it, and use the slider or + and − to zoom. The preview shows exactly what will be uploaded.",
    PT: "Arraste a imagem ou use as setas para posicionar, e use o controle deslizante ou + e − para dar zoom. A prévia mostra exatamente o que será enviado.",
  },
  "crop.previewLabel": { EN: "Crop preview", PT: "Prévia do recorte" },
  "crop.loading": { EN: "Loading the image…", PT: "Carregando a imagem…" },
  "crop.zoom": { EN: "Zoom", PT: "Zoom" },
  "crop.aspect": { EN: "Shape", PT: "Formato" },
  "crop.aspect.square": { EN: "Square (1:1)", PT: "Quadrado (1:1)" },
  "crop.aspect.wide": { EN: "Wide (16:9)", PT: "Panorâmico (16:9)" },
  "crop.aspect.classic": { EN: "Classic (4:3)", PT: "Clássico (4:3)" },
  "crop.aspect.original": { EN: "Original shape", PT: "Formato original" },
  "crop.result": { EN: "Result:", PT: "Resultado:" },
  "crop.reset": { EN: "Reset", PT: "Redefinir" },
  "crop.apply": { EN: "Apply crop", PT: "Aplicar recorte" },
  "crop.adjust": { EN: "Adjust crop", PT: "Ajustar recorte" },
  "crop.summary": { EN: "Crop:", PT: "Recorte:" },
  "crop.none": { EN: "No crop: the whole image will be used.", PT: "Sem recorte: a imagem inteira será usada." },
  "upload.preparing": { EN: "Preparing the image…", PT: "Preparando a imagem…" },
  "upload.compressedFrom": { EN: "Compressed:", PT: "Comprimida:" },
  "upload.decode": {
    EN: "The browser can't read this image. Try JPEG, PNG or WebP.",
    PT: "O navegador não consegue ler esta imagem. Tente JPEG, PNG ou WebP.",
  },
  "upload.sourceSize": {
    EN: "Images over 40 MB are too large to compress here. Reduce it first.",
    PT: "Imagens acima de 40 MB são grandes demais para comprimir aqui. Reduza antes.",
  },
  "upload.noFit": {
    EN: "Could not compress the image enough to fit the limit.",
    PT: "Não foi possível comprimir a imagem o bastante para caber no limite.",
  },
  "upload.saved": { EN: "Uploaded and saved.", PT: "Enviado e salvo." },
  "upload.readyToSave": {
    EN: "Uploaded. Save the project to use the new image.",
    PT: "Enviado. Salve o projeto para usar a nova imagem.",
  },
  "upload.type": { EN: "This file type is not allowed here.", PT: "Este tipo de arquivo não é permitido aqui." },
  "upload.size": { EN: "The file is larger than the limit.", PT: "O arquivo é maior que o limite." },
  "upload.name": {
    EN: "Set a valid id first (lowercase letters, numbers and hyphens).",
    PT: "Defina um id válido primeiro (letras minúsculas, números e hífens).",
  },
  "upload.auth": { EN: "Your session ended. Sign in again.", PT: "Sua sessão terminou. Entre novamente." },
  "upload.failed": { EN: "Upload failed.", PT: "O envio falhou." },
} satisfies Record<string, Translation>;

export type AdminStringKey = keyof typeof adminStrings;

export const useAdminT = () => {
  const { language } = useLanguage();
  return useCallback(
    (key: AdminStringKey) => adminStrings[key][language],
    [language],
  );
};

export { adminStrings };
