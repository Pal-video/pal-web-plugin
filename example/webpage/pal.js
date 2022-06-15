(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.palBundle = factory());
})(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    // import {Axios} from 'axios';
    class HttpClient {
        //   private axios: Axios;
        constructor({ baseUrl, apiKey }) {
            // this.axios = new Axios({
            //   baseURL: baseUrl,
            //   headers: {
            //     Authorization: `Bearer ${apiKey}`,
            //   },
            // });
        }
        get(method) {
            throw new Error('Method not implemented.');
            // return this.axios.get(method);
        }
        post(method, data) {
            throw new Error('Method not implemented.');
            // return this.axios.post(method, data);
        }
        put(method, data) {
            throw new Error('Method not implemented.');
            // return this.axios.post(method, data);
        }
    }

    const sessionKey = 'PalSession';
    class LocalstorageService {
        constructor() {
            this._session = null;
            const saveSession = sessionStorage.getItem(sessionKey) || localStorage.getItem(sessionKey);
            if (saveSession) {
                this._session = JSON.parse(saveSession);
            }
        }
        /**
         * Check if user has a session stored
         * @returns True if the user session is set.
         */
        hasSession() {
            return !!this.session;
        }
        /**
         * Gets the user session stored.
         * @return The user session or null if no session found.
         */
        get session() {
            return this._session;
        }
        /**
         * Sets the user session.
         * Otherwise, the credentials are only persisted for the current session.
         * @param session The user session.
         * @param remember True to remember credentials across sessions (default true).
         */
        setSession(session, remember) {
            this._session = session || null;
            if (session) {
                const storage = remember ? localStorage : sessionStorage;
                storage.setItem(sessionKey, JSON.stringify(session));
            }
            else {
                sessionStorage.removeItem(sessionKey);
                localStorage.removeItem(sessionKey);
            }
        }
        /**
         * Clears the user session.
         */
        clear() {
            this._session = null;
            sessionStorage.clear();
            localStorage.clear();
        }
    }

    var PlatformTypes;
    (function (PlatformTypes) {
        PlatformTypes["Android"] = "android";
        PlatformTypes["iOS"] = "ios";
        PlatformTypes["web"] = "web";
    })(PlatformTypes || (PlatformTypes = {}));

    class SessionsApi {
        constructor(localstorageService, httpClient) {
            this.localstorageService = localstorageService;
            this.httpClient = httpClient;
        }
        createSession(request) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpClient.post('/sessions', {
                    frameworkType: request.frameworkType,
                    platform: request.platform,
                });
                this.localstorageService.setSession(response);
                return response;
            });
        }
        getSession() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.localstorageService.session;
            });
        }
        clearSession() {
            return this.localstorageService.clear();
        }
    }

    class Pal {
        constructor(sessionsApi, options) {
            this.sessionsApi = sessionsApi;
            this.hasInitialized = false;
            this.options = options;
        }
        static getInstance() {
            if (!this._instance) {
                throw new Error('Pal has not been initialized, please call createInstance');
            }
            return this._instance;
        }
        static createInstance(options) {
            const httpClient = new HttpClient({
                baseUrl: options.serverUrl,
                apiKey: options.apiKey,
            });
            const sessionsApi = new SessionsApi(new LocalstorageService(), httpClient);
            this._instance = new Pal(sessionsApi, options);
        }
        initialize() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                yield this.sessionsApi.createSession({
                    frameworkType: 'JAVASCRIPT',
                    platform: (_a = this.options.platform) !== null && _a !== void 0 ? _a : PlatformTypes.web,
                });
                this.hasInitialized = true;
            });
        }
        getSession() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.hasInitialized) {
                    throw new Error('Pal has not been initialized');
                }
                return this.sessionsApi.getSession();
            });
        }
        clearSession() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.hasInitialized) {
                    throw new Error('Pal has not been initialized');
                }
                yield this.sessionsApi.clearSession();
            });
        }
    }

    return Pal;

}));
