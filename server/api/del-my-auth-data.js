export default defineEventHandler(async (event) => {
    try {
        deleteCookie(event, 'auth_token');
    } catch (err) {
        return err;
    }

});
