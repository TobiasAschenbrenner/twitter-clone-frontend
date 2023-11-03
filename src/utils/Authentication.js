import { API_BASE_URL } from "../config";

export class Authentication {

    _instance = null;

    jwt = localStorage.getItem("jwt");
    refreshtoken = localStorage.getItem("refreshtoken");
    validUntil = localStorage.getItem("jwt_exp");

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
        localStorage.setItem("jwt", jwt);
        this.refreshtoken = refreshToken;
        localStorage.setItem("refreshtoken", refreshToken);
        this.validUntil = exp;
        localStorage.setItem("jwt_exp", exp);
        return jwt;
    }

    async login(email, password) {
        return await this.loginOrRegister("login", email, password);
    }

    async register(email, password) {
        return await this.loginOrRegister("register", email, password);
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
        localStorage.setItem("jwt", jwt);
        this.validUntil = exp;
        localStorage.setItem("jwt_exp", exp);
        return jwt;
    }

    async getJwt() {
        if (this.shouldRefreshToken()) return await this.refreshJwt();
        else return this.jwt;
    }

}