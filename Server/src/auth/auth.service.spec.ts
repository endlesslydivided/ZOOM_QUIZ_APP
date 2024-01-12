import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { Session } from 'express-session';

import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

jest.mock('axios');

describe('AuthService', () => {
  let service: AuthService;

  const userMock = {
    email: 'someone@gmail.com',
    firstname: 'Alexander',
    surname: 'Kovalyov',
    displayName: 'Alexander Kovalyov',
  };

  const codeDummy = 'aoisfdhw9w834qhf34g';
  const verifierDummy = '8gw0hv48h9cfq0398f3';

  const sessionDummy: Session & { state: string; verifier: string } = {
    state: '34qgrvetyb674',
    verifier: verifierDummy,
    id: '123easd23dq3f34',
    cookie: null,
    regenerate: null,
    destroy: null,
    reload: null,
    touch: null,
    resetMaxAge: null,
    save: null,
  };

  const tokenMock =
    '239rh0fuqufwh0rghosivd.a2uhqfewaugahvbiuyajhf.76u234ehofqewn8oh3f90he';

  const tokenEntryMock = {
    access_token: tokenMock,
    refresh_token: tokenMock,
  };

  const deeplinkMock = {
    deeplink: 'https://zoom.us/wej9f8734hf3',
  };

  const axiosMock = axios as jest.MockedFunction<typeof axios>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, {
        provide: ConfigService,
        useValue: {
          get(key:string)
          {
            if(key === "ZM_HOST")
            {
              return process.env.ZM_HOST;
            }
          }
        },
      },],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDeeplink', () => {
    it('should return link', async () => {
      service.getToken = jest.fn().mockResolvedValue(tokenEntryMock);
      service.apiRequest = jest.fn().mockResolvedValue(deeplinkMock);

      const deeplink = await service.getDeeplink(sessionDummy, codeDummy);

      expect(service.getToken).toHaveBeenCalledTimes(1);
      expect(service.getToken).toBeCalledWith(codeDummy, verifierDummy, 'S256');

      expect(service.apiRequest).toHaveBeenCalledTimes(1);
      expect(service.apiRequest).toBeCalledWith(
        'POST',
        '/zoomapp/deeplink',
        tokenEntryMock.access_token,
        {
          action: JSON.stringify({
            url: '/',
            role_name: 'Owner',
            verified: 1,
            role_id: 0,
          }),
        },
      );

      expect(deeplink).toEqual(deeplinkMock.deeplink);
    });
  });

  describe('getMe', () => {
    it('should return user', async () => {
      service.apiRequest = jest.fn().mockResolvedValue(userMock);

      const user = await service.getMe(tokenMock);

      expect(service.apiRequest).toHaveBeenCalledTimes(1);
      expect(service.apiRequest).toBeCalledWith('GET', `/users/me`, tokenMock);

      expect(user).toEqual(userMock);
    });
  });

  describe('refreshToken', () => {
    it('should return token entry', async () => {
      service.tokenRequest = jest.fn().mockResolvedValue(tokenEntryMock);

      const tokenEntry = await service.refreshToken(tokenMock);

      expect(service.tokenRequest).toHaveBeenCalledTimes(1);
      expect(service.tokenRequest).toBeCalledWith({
        refresh_token: tokenMock,
        grant_type: 'refresh_token',
      });

      expect(tokenEntry).toEqual(tokenEntryMock);
    });

    it('should throw internal server error', async () => {
      await expect(service.refreshToken(null)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getToken', () => {
    it('should return token entry', async () => {
      service.tokenRequest = jest.fn().mockResolvedValue(tokenEntryMock);

      const tokenEntry = await service.getToken(
        codeDummy,
        verifierDummy,
        'S256',
      );

      expect(service.tokenRequest).toHaveBeenCalledTimes(1);
      expect(service.tokenRequest).toBeCalledWith({
        code: codeDummy,
        code_verifier: verifierDummy,
        redirect_uri: process.env.ZM_REDIRECT_URL,
        grant_type: 'authorization_code',
        code_challenge_method: 'S256',
      });

      expect(tokenEntry).toEqual(tokenEntryMock);
    });

    it('should throw internal server error', async () => {
      await expect(
        service.getToken(null, verifierDummy, 'S256'),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw internal server error', async () => {
      await expect(service.getToken(codeDummy, null, 'S256')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('tokenRequest', () => {
    const params = {};
    const id = '92wef80hqf-asdfasdfwe-34sdfsafq-q34g34g';
    const secret = '0327t8frp9wgh094f';

    it('should return token entry', async () => {
      axiosMock.mockResolvedValueOnce({ data: tokenEntryMock });

      const tokenEntry = await service.tokenRequest(params, id, secret);

      expect(axiosMock).toHaveBeenCalledTimes(1);

      expect(tokenEntry).toEqual(tokenEntryMock);
    });

    it('should throw bad request exception', async () => {
      axiosMock.mockRejectedValue('error data');

      await expect(service.tokenRequest(params, id, secret)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('apiRequest', () => {
    const endpoint = '/anything';
    const method = 'GET';

    it('should return object', async () => {
      axiosMock.mockResolvedValue({ data: tokenEntryMock });

      const tokenEntry = await service.apiRequest(method, endpoint, tokenMock);

      expect(axiosMock).toHaveBeenCalledTimes(1);

      expect(tokenEntry).toEqual(tokenEntryMock);
    });

    it('should throw bad request exception', async () => {
      axiosMock.mockRejectedValue('error data');

      await expect(
        service.apiRequest(method, endpoint, tokenMock),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
