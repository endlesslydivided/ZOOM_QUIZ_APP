import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { URL } from 'url';
import {rand,base64URL} from './utils/apiUtils'
import * as crypto from 'crypto'



@Injectable()
export class AppService 
{
    
    constructor()
    {

    }
   
    async getInstallURL()
    {

        const state = rand('base64');
        const verifier = rand('ascii');

        const digest = crypto
            .createHash('sha256')
            .update(verifier)
            .digest('base64')
            .toString();

        const challenge = base64URL(digest);

        const url = new URL('/oauth/authorize', process.env.ZM_HOST || 'https://zoom.us');

        url.searchParams.set('response_type', 'code');
        url.searchParams.set('client_id', process.env.ZM_CLIENT_ID);
        url.searchParams.set('redirect_uri', process.env.ZM_REDIRECT_URL);
        url.searchParams.set('code_challenge', challenge);
        url.searchParams.set('code_challenge_method', 'S256');
        url.searchParams.set('state', state);

        return { url, state, verifier };
    }
}
