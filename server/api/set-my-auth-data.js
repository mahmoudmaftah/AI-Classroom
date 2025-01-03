// export default defineEventHandler(async (event) => {
//     try{
//     const body = await readBody(event); // Read request body
//     const { token } = body;

//     setCookie(event, 'auth_token', token);
//     } catch (err) {
//         return err;
//     }

// });

import connectToDatabase from "../utils/mongodb";
import get_my_auth_data from "../utils/auth";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event); // Read request body
        const { token } = body;

        setCookie(event, 'auth_token', token);

        const convert = (token) => {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        }
        const authData = convert(token);
        const db = await connectToDatabase();
        const usersCollection = db.collection("users");

        // Fetch the user's last login date
        const user = await usersCollection.findOne({ googleId: authData.sub });

        console.log("user", user);

        const today = new Date().toISOString().split("T")[0]; // Current date (YYYY-MM-DD)

        if (user) {
            const lastLoginDate = user.lastLoginDate || null;

            // Calculate streak based on the last login date
            let loginStreak = user.loginStreak || 0;
            if (lastLoginDate) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = yesterday.toISOString().split("T")[0];

                if (lastLoginDate === yesterdayString) {
                    loginStreak += 1; // Increment streak
                } else if (lastLoginDate !== today) {
                    loginStreak = 1; // Reset streak
                }
            } else {
                loginStreak = 1; // First-time login
            }

            // Update user record
            await usersCollection.updateOne(
                { googleId: authData.sub },
                { $set: { lastLoginDate: today, loginStreak } }
            );
        } else {
            // Create a new user record
            await usersCollection.insertOne({
                googleId: authData.sub,
                lastLoginDate: today,
                loginStreak: 1,
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error updating login streak:", error);
        return { error: "Failed to update login streak." };
    }
});
