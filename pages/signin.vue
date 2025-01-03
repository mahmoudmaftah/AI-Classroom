<template>
    <div>
      <div
        id="g_id_onload"
        data-client_id="5386076183-enbj35ntaeqep1gn5dcttjbbnj129uj0.apps.googleusercontent.com"
        data-callback="onSignIn"
        data-login_uri="http://localhost:3000/oauth/callback"
      ></div>
      <div id="g_signin2"></div>
    </div>
  </template>
  
  <script>
  import { useRouter } from '#app'; // Use Nuxt's useRouter for navigation
  
  export default {
    mounted() {
      // Load Google Sign-In API script and initialize
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '5386076183-enbj35ntaeqep1gn5dcttjbbnj129uj0.apps.googleusercontent.com',
          callback: this.onSignIn,
        });
  
        window.google.accounts.id.renderButton(document.getElementById('g_signin2'), {
          theme: 'outline',
          size: 'large',
        });
      }
    },
    methods: {
      async onSignIn(response) {
        const { credential } = response;
  
        // Decode JWT token or handle user authentication here
        const user = this.decodeJwt(credential);
        console.log('User Info:', user);
  
        // Store token in cookies
        const authToken = useCookie('auth_token');
        authToken.value = credential;
  
        // Redirect to the dashboard after successful login
        const router = useRouter();
        router.push('/dashboard');
      },
      decodeJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
        return JSON.parse(jsonPayload);
      },
    },
  };
  </script>
  