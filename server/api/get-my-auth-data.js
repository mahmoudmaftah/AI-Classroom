export default defineEventHandler(async (event) => {

    try {
        const token = getCookie(event, 'auth_token');
        if (!token) {
            return { error: "No token found" };
        }
        // Decode JWT token to extract user info (if necessary)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (err) {
        return err;
    }

});
