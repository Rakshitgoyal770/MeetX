// packages/backend-common/src/config/index.ts
export const JWT_SECRET = "kjhjh"; 

if(!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}