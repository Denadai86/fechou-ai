import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Definimos com precisão o que é público
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api(.*)', 
  '/dashboard/(.*)', // Exemplo de rota pública adicional
  '/teste(.*)', // Rota de teste pública
]);

export default clerkMiddleware(async (auth, request) => {
  // Se não for rota pública, exige login
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Garante que o Next.js execute o proxy em todas as rotas, 
    // exceto arquivos estáticos (imagens, etc)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
