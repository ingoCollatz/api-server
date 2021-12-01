import {Context} from "../../context";
import {Client} from "../../auth-client/client";
import {PrismaClient} from "../../api-db/client";

export function depositChallengeResolver(prisma:PrismaClient) {
    return async (parent: any, args:{jwt:string}, context: Context) => {
        if (!process.env.APP_ID) {
            throw new Error('process.env.APP_ID is not set')
        }
        if (!process.env.ACCEPTED_ISSUER) {
            throw new Error('process.env.ACCEPTED_ISSUER is not set')
        }

        const now = new Date();

        const authClient = new Client(process.env.APP_ID, process.env.ACCEPTED_ISSUER);

        console.log(`'${context.ipAddress}' tries to deposit a challenge ..`);

        const tokenPayload = await authClient.verify(args.jwt);
        if (!tokenPayload)
        {
            const msg = `'${context.ipAddress}' tried to deposit a challenge but ran into an error: Couldn't decode the supplied JWT.`;
            throw new Error(msg)
        }

        if (!tokenPayload.challenge || !tokenPayload.challengeValidTo) {
            const msg = `'${context.ipAddress}' tried to deposit a challenge but ran into an error: The supplied jwt is not a valid delegated challenge.`;
            throw new Error(msg)
        }

        const delegatedChallengeRequest = await prisma.delegatedChallenges.findUnique({where: {delegateAuthCode: tokenPayload.sub}});
        if (!delegatedChallengeRequest) {
            const msg = `'${context.ipAddress}' tried to deposit a challenge but ran into an error: Couldn't find a delegated challenge request with code '${tokenPayload.sub}'.`;
            throw new Error(msg)
        }
        if (delegatedChallengeRequest.requestValidTo < now) {
            const msg = `'${context.ipAddress}' tried to deposit a challenge but ran into an error: The delegated challenge request with the id ${delegatedChallengeRequest.id} already timed out when the auth-service wanted to deposit the challenge.`;
            throw new Error(msg)
        }

        const challengeValidTo = new Date(tokenPayload.challengeValidTo);
        await prisma.delegatedChallenges.update({
            where: {
                delegateAuthCode: tokenPayload.sub
            },
            data: {
                challengeDepositedAt: now,
                challenge: tokenPayload.challenge,
                challengeValidTo: challengeValidTo
            }
        });

        return {
            success: true
        }
    }
}