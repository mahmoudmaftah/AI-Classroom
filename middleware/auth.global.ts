export default defineNuxtRouteMiddleware((to, from) => {
    const authToken = useCookie('auth_token');
  
    console.log('Navigating to:', to.path);
    console.log('Auth token exists:', !!authToken.value);
  
    // Define public pages (accessible without authentication)
    const publicPages = ['/signin', '/'];
  
    // Redirect to /signin if not authenticated and trying to access a private page
    if (!authToken.value) {
      if (!publicPages.includes(to.path)) {
        return navigateTo('/');
      }
      return; // Allow access to public pages
    }
  
    // If authenticated and trying to access a public page, redirect to /dashboard
    if (authToken.value && publicPages.includes(to.path)) {
      return navigateTo('/dashboard');
    }
  
    // Allow navigation if already authenticated and on a private page
  });
  