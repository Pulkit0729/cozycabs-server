import { getDriver } from "../dal/driver.dal";
import { getUser } from "../dal/user.dal";
import logger from "../logger/logger";
import { getApiKey, getBearerToken } from "../utils/decode.util";
import { verifyJWT } from "../utils/jwt.util";

export default async function apolloMiddleware({ req }: { req: any }): Promise<any> {

    try {
        const jwt = getBearerToken(req.headers);
        if (jwt === undefined || jwt === null) {
            return {};
        }
        const token: any = verifyJWT(jwt);
        const user = await getUser(token.sub);
        if (!user || !user.phoneConfirmed) {
            const driver = await getDriver(token.sub);
            if (!driver || !driver.phoneConfirmed) {
                return {}
            }
            return { driver: driver }
        }
        return { user: user }

    } catch (error: any) {
        logger.error(`authMiddleware, error: ${error.message}`);
    }
    try {
        const apiKey = getApiKey(req.headers);
        if (apiKey == process.env.API_KEY) {
            return { isAdmin: true };
        }
    }
    catch (error: any) {
        logger.error(`authMiddleware, error: ${error.message}`);
        return {};
    }
}