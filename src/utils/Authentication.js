import { API_BASE_URL } from "../config";

export class Authentication {

    _instance = null;

    _jwt = localStorage.getItem("jwt");
    get jwt() {
        return this._jwt;
    }
    set jwt(value) {
        this._jwt = value;
        localStorage.setItem("jwt", value);
    }
    
    _refreshtoken = localStorage.getItem("refreshtoken");
    get refreshtoken() {
        return this._refreshtoken;
    }
    set refreshtoken(value) {
        this._refreshtoken = value;
        localStorage.setItem("refreshtoken", value);
    }

    _validUntil = localStorage.getItem("jwt_exp");
    get validUntil() {
        return this._validUntil;
    }
    set validUntil(value) {
        this._validUntil = value;
        localStorage.setItem("jwt_exp", value);
    }

    constructor() {
        this._instance = this;
    }

    static getInstance() {
        if (this._instance == null) {
            this._instance = new Authentication();
        }
        return this._instance;
    }

    async loginOrRegister(action, email, password) {
        const response = await fetch(`${API_BASE_URL}/v1/auth/${action}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            console.error(`Error in user ${action}: Invalid email or password`);
            return false;
        }

        const { jwt, refreshToken, exp } = await response.json();
        if (!jwt || !refreshToken || !exp) {
            console.error(`Error in user ${action}: Missing token or expiration`);
            return false;
        }

        this.jwt = jwt;
        this.refreshtoken = refreshToken;
        this.validUntil = exp;
        return jwt;
    }

    async login(email, password) {
        return await this.loginOrRegister("login", email, password);
    }

    async register(email, password) {
        return await this.loginOrRegister("register", email, password);
    }

    async createUser(username, displayname) {
        const response = await fetch(`${API_BASE_URL}/v1/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await this.getJwt()}`,
            },
            body: JSON.stringify({ username, displayname }),
        });
        if (!response.ok) {
            console.error("Error creating user");
            return false;
        }

        const { exp, jwt, refreshToken } = await response.json();
        if (!jwt || !refreshToken || !exp) {
            console.error("Error creating user: Missing token or expiration");
            return false;
        }

        this.jwt = jwt;
        this.refreshtoken = refreshToken;
        this.validUntil = exp;
        return jwt;
    }

    shouldRefreshToken() {
        if (!this.validUntil) return true;
        return Math.floor(Date.now() / 1000) >= this.validUntil;
    }

    async refreshJwt() {
        const response = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "refreshToken": this.refreshtoken }),
        });

        if (!response.ok) {
            console.error("Error refreshing token");
            return false;
        }

        const { jwt, exp } = await response.json();
        if (!jwt || !exp) {
            console.error("Error refreshing token: Missing token or expiration");
            return false;
        }

        this.jwt = jwt;
        this.validUntil = exp;
        return jwt;
    }

    async getJwt() {
        if (this.shouldRefreshToken()) return await this.refreshJwt();
        else return this.jwt;
    }

}