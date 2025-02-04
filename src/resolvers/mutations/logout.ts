import {Context} from "../../context";
import {Environment} from "../../environment";
import {Session as DBSession} from "../../api-db/client";
import {Session} from "../../session";

export function logout() {
    return async (parent: any, args: any, context: Context) => {
        let session:DBSession|null = null;
        try {
            session = await context.verifySession();
        } catch (e) {
        }
        if (session) {
            await Session.logout(context, Environment.readWriteApiDb, session.sessionToken);
        }

        Environment.externalDomains.forEach((externalDomain) => {
            context.setCookies.push({
                name: `session_${externalDomain.replace(/\./g, "_")}`,
                value: "",
                options: {
                    domain: externalDomain,
                    httpOnly: true,
                    path: "/",
                    sameSite: Environment.cookieSameSitePolicy,
                    secure: !Environment.cookieSecurePolicy ? undefined : "Secure",
                    maxAge: 0
                }
            });
        });

        return {
            success: true
        }
    }
}
