import {Session} from "../../session";
import {Context} from "../../context";
import {PrismaClient} from "../../api-db/client";
import {Environment} from "../../environment";

export function exchangeTokenResolver(prisma:PrismaClient) {
    return async (parent: any, args: any, context: Context) => {
        if (!context.jwt) {
            throw new Error("No authorization header");
        }
        try {
            const session = await Session.createSessionFromJWT(prisma, context);
            const expires = new Date(Date.now() + session.maxLifetime * 1000);

            context.res?.cookie('session', session.sessionToken, <any>{
                domain: Environment.externalDomain,
                httpOnly: true,
                path: "/",
                sameSite: Environment.isLocalDebugEnvironment ? "Strict" : "None",
                secure: !Environment.isLocalDebugEnvironment,
                expires: expires
            });

            return {
                success: true
            }
        } catch (e) {
            return {
                success: false,
                errorMessage: "Couldn't create the session cookie from the supplied JWT. Please try again with a new JWT."
            }
        }
    }
}