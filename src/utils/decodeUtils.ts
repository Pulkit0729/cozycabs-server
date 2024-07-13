import base64url from 'base64url';

export function getIdPass(header: any) {
    const authHeader = header["authorization"];
    const decodedAuth = base64url.decode(authHeader.slice(6));
    const email = decodedAuth.split(':')[0].toLowerCase();
    const password = decodedAuth.split(':')[1];
    return { email, password };
}

export function getBearerToken(header: any) {
    const authHeader = header["authorization"];
    const decodedAuth = authHeader.slice(6);
    return decodedAuth.trim();
}

export function getApiKey(header: any) {
    const apiKey = header["x-api-key"];
    return apiKey.trim();
}

