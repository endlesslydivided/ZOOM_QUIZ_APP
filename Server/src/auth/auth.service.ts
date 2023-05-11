import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { Session as ExpressSession } from 'express-session';
import { URL } from 'url';

import { host as ZoomHost } from '../share/consts/variables.consts';

@Injectable()
export class AuthService {
  private baseURL: string;
  private host: URL;

  constructor() {
    this.host = ZoomHost;
    this.host.hostname = `api.${this.host.hostname}`;
    this.baseURL = this.host.href;
  }

  async tokenRequest(
    params: Record<string, string>,
    id = '',
    secret = '',
  ): Promise<Record<string, string>> {
    const username = id || process.env.ZM_CLIENT_ID;
    const password = secret || process.env.ZM_CLIENT_SECRET;

    return axios({
      data: new URLSearchParams(params).toString(),
      baseURL: this.host.href,
      url: '/oauth/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username,
        password,
      },
    })
      .then(({ data }) => {
        return Promise.resolve(data);
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestException(error);
      });
  }

  async apiRequest(
    method: string,
    endpoint: string,
    token: string,
    data: Record<string, string> = null,
  ): Promise<Record<string, string>> {
    return axios({
      data,
      method,
      baseURL: this.baseURL,
      url: `/v2${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(({ data }) => {
        return Promise.resolve(data);
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestException(error);
      });
  }

  async getToken(
    code: string,
    verifier: string,
    code_challenge_method: string,
  ): Promise<Record<string, string>> {
    if (!code || typeof code !== 'string') {
      throw new InternalServerErrorException(
        'Authorization code must be a valid string',
      );
    }

    if (!verifier || typeof verifier !== 'string') {
      throw new InternalServerErrorException(
        'Code verifier code must be a valid string',
      );
    }

    return this.tokenRequest({
      code,
      code_verifier: verifier,
      redirect_uri: process.env.ZM_REDIRECT_URL,
      grant_type: 'authorization_code',
      code_challenge_method,
    });
  }

  async refreshToken(token: string): Promise<Record<string, string>> {
    if (!token || typeof token !== 'string') {
      throw new InternalServerErrorException(
        'Refresh token must be a valid string',
      );
    }

    return this.tokenRequest({
      refresh_token: token,
      grant_type: 'refresh_token',
    });
  }

  async getMe(token: string): Promise<Record<string, string>> {
    return this.apiRequest('GET', `/users/me`, token);
  }

  async getDeeplink(
    session: ExpressSession & { state: string; verifier: string },
    code: string,
  ): Promise<string> {
    session.state = null;
    const verifier = session.verifier;
    session.verifier = null;

    const { access_token: accessToken } = await this.getToken(
      code,
      verifier,
      'S256',
    );
    return this.apiRequest('POST', '/zoomapp/deeplink', accessToken, {
      action: JSON.stringify({
        url: '/',
        role_name: 'Owner',
        verified: 1,
        role_id: 0,
      }),
    }).then((data) => Promise.resolve(data.deeplink));
  }
}
