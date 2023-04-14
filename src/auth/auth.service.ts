import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { URL } from 'url';

@Injectable()
export class AuthService 
{
    private host:any;
    private baseURL:any;
    
    constructor()
    {
        this.host = new URL( process.env.ZM_HOST || 'https://zoom.us');
        this.host.hostname = `api.${this.host.hostname}`;
        this.baseURL = this.host.href;
    }

    async tokenRequest(params, id = '', secret = '')  
    {
        const username = id ||  process.env.ZM_CLIENT_ID;
        const password = secret || process.env.ZM_CLIENT_SECRET;

        return axios({
            data: new URLSearchParams(params).toString(),
            baseURL: process.env.ZM_HOST || 'https://zoom.us',
            url: '/oauth/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                username,
                password,
            },
        }).then(({ data }) => Promise.resolve(data));
    }


    async apiRequest(method, endpoint, token, data = null)
    {
        return axios({
            data,
            method,
            baseURL:this.baseURL,
            url: `/v2${endpoint}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(({ data }) => Promise.resolve(data));
    }

    async  getToken(code, verifier) 
    {
        if (!code || typeof code !== 'string')
        {
            throw new InternalServerErrorException('Authorization code must be a valid string')
        }

        if (!verifier || typeof verifier !== 'string')
        {
            throw new InternalServerErrorException('code verifier code must be a valid string')
        }

        return this.tokenRequest({
            code,
            code_verifier: verifier,
            redirect_uri: process.env.ZM_REDIRECT_URL,
            grant_type: 'authorization_code',
        });
    }


    async refreshToken (token)
    {
        if (!token || typeof token !== 'string')
        {
            throw new InternalServerErrorException('Refresh token must be a valid string')
        }

        return this.tokenRequest({
            refresh_token: token,
            grant_type: 'refresh_token',
        });
    }

    async getZoomUser (uid, token)
    {
        return this.apiRequest('GET', `/users/${uid}`, token);
    }

    async getDeeplink(token)
    {
        return this.apiRequest('POST', '/zoomapp/deeplink', token, {
            action: JSON.stringify({
                url: '/',
                role_name: 'Owner',
                verified: 1,
                role_id: 0,
            }),
        }).then((data) => Promise.resolve(data.deeplink));
    }
}
