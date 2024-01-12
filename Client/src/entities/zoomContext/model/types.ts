export type ZoomContext = Partial<{
    aud: string;
    entitlements: Array<string>;
    exp: number;
    iss: string;
    theme: string;
    ts: number;
    typ: string;
    uid: string;
    mid?: string;
}>;

export type ZoomContextString = string | null;

export type DecryptedContext = ZoomContext | null;

export type ZoomTokens = {
    access_token: string;
    refresh_token: string;
} | null;

export type ZoomUser = {
    display_name: string;
    firstname: string;
    surname: string;
    email: string;
} | null;

export type UserZoomContext = Partial<{
    context: ZoomContextString;
    decrypted: DecryptedContext;
    tokens: ZoomTokens;
    user: ZoomUser;
}>;
