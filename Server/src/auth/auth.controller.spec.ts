import { Test } from "@nestjs/testing";
import * as Express from "express";
import { Session } from "express-session";
import * as Sinon from "sinon";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe('AuthController', () => {
    let controller: AuthController;

    const userMock={
        email:'someone@gmail.com',
        firstname:'Alexander',
        surname:'Kovalyov',
        displayName:'Alexander Kovalyov'
    }

    const tokenMock={
        access_token:'123qweasd3edwedfatg5ege4',
        refresh_token:'3q498hofuera9tc38ahwrcfc9',
        state:'12345'
    }

    const deepLinkMock = 'https://zoom.us/';


    const mockAuthService={
        tokenRequest:jest.fn().mockResolvedValue(tokenMock),
        apiRequest:jest.fn(),
        getToken:jest.fn().mockResolvedValue(tokenMock),
        refreshToken:jest.fn().mockResolvedValue(tokenMock),
        getMe:jest.fn().mockResolvedValue(userMock),
        getDeeplink:jest.fn().mockResolvedValue(deepLinkMock)
    }


    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService],
        })
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .compile();
    
        controller = module.get<AuthController>(AuthController);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getToken',() =>
    {
        const query ={
            code:'12345',
            verifier:'12345'
        }
       
        it('should return token entry', async () => {
       
            const tokenEntry = await controller.getToken(query)

            expect(mockAuthService.getToken).toHaveBeenCalledTimes(1);
            expect(mockAuthService.getToken).toBeCalledWith(query.code, query.verifier, 'S256');

            expect(tokenEntry).toEqual(tokenMock);
        })
    });

    describe('redirect',() =>
    {
        const code:string = '12345';
        const res = {} as unknown as Express.Response;
        res.json = jest.fn();
        res.status = jest.fn(() => res);
        res.redirect = jest.fn();

        const session:Session & { state: string; verifier: string } = {
            state:'12345',
            verifier:'54321',
            id:"",
            cookie:null,
            regenerate:null, 
            destroy:null, 
            reload:null, 
            touch:null,
            resetMaxAge:null,
            save:null
        }; 
       
        it('should redirect user', async () => {
           
            await controller.redirect(code,res,session)

            expect(mockAuthService.getDeeplink).toHaveBeenCalledTimes(1);
            expect(mockAuthService.getDeeplink).toBeCalledWith(session,code);

            expect(res.redirect).toHaveBeenCalledTimes(1);
            expect(res.redirect).toBeCalledWith(deepLinkMock);
        });
    });

    describe('refreshToken',() =>
    {
        const token = '239rh0fuqufwh0rghosivd.a2uhqfewaugahvbiuyajhf.76u234ehofqewn8oh3f90he';
       
        it('should return token entry', async () => {
            const tokenEntry = await controller.refreshToken(token)

            expect(mockAuthService.refreshToken).toHaveBeenCalledTimes(1);
            expect(mockAuthService.refreshToken).toBeCalledWith(token);

            expect(tokenEntry).toEqual(tokenMock);

        })
    });

    describe('getMe',() =>
    {
        const token = '239rh0fuqufwh0rghosivd.a2uhqfewaugahvbiuyajhf.76u234ehofqewn8oh3f90he';

        it('should user entry', async () => {
            const userEntry = await controller.getMe(token)
    
            expect(mockAuthService.getMe).toHaveBeenCalledTimes(1);
            expect(mockAuthService.getMe).toBeCalledWith(token);

            expect(userEntry).toEqual(userMock);
        });
    });
})