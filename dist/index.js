export const RobloxProvider = (options) => {
    const { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET, scopes: SCOPES, redirectUri: REDIRECT_URI, checks: CHECKS = ['pkce', 'state'], rest: REST, } = options;
    return {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        id: 'roblox',
        name: 'Roblox',
        type: 'oauth',
        wellKnown: 'https://apis.roblox.com/oauth/.well-known/openid-configuration',
        authorization: { url: "https://apis.roblox.com/oauth/v1/authorize", params: { scope: SCOPES.join(' '), redirect_uri: REDIRECT_URI } },
        userinfo: "https://apis.roblox.com/oauth/v1/userinfo",
        idToken: true,
        checks: CHECKS,
        token: "https://apis.roblox.com/oauth/v1/token",
        client: {
            authorization_signed_response_alg: 'ES256',
            id_token_signed_response_alg: 'ES256',
        },
        profile(profile) {
            return {
                type: 'roblox',
                id: profile.sub,
                robloxId: profile.sub,
                name: profile.preferred_username,
                displayName: profile.nickname,
                picture: profile.picture
            };
        },
        ...REST,
    };
};
export const RobloxProviderJwtCallback = async (token, user) => {
    if (!user)
        return token;
    if (!(user?.type === 'roblox'))
        return token;
    token.id = user.id;
    token.robloxId = user.robloxId;
    token.name = user.name,
        token.displayName = user.displayName;
    token.picture = user.picture;
    token.type = "roblox";
    return token;
};
export const RobloxProviderSessionCallback = async (session, tokenOrUser) => {
    if (!(tokenOrUser?.type === 'roblox'))
        return session;
    session.user.id = tokenOrUser.id;
    session.user.robloxId = tokenOrUser.robloxId;
    session.user.name = tokenOrUser.name;
    session.user.displayName = tokenOrUser.displayName;
    session.user.picture = tokenOrUser.picture;
    return session;
};
export const RobloxProviderCallbacks_Jwt = {
    async jwt({ token, user }) {
        return await RobloxProviderJwtCallback(token, user);
    },
    async session({ session, token }) {
        return await RobloxProviderSessionCallback(session, token);
    },
};
export const RobloxProviderCallbacks_Database = {
    async session({ session, user }) {
        return await RobloxProviderSessionCallback(session, user);
    },
};
