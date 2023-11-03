import { API_BASE_URL } from "../config";

export class Authentication {

    _instance = null;

    jwt = localStorage.getItem("jwt");
    refreshtoken = localStorage.getItem("refreshtoken");
    validUntil = localStorage.get("jwt_exp");

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

        if (response.ok) {
            console.error(`Error in user ${action}: Invalid email or password`);
            return false;
        }

        const { jwt, refreshtoken, exp } = await response.json();
        if (!jwt || !refreshtoken || !exp) {
            console.error(`Error in user ${action}: Missing token or expiration`);
            return false;
        }

        localStorage.setItem("jwt", jwt);
        localStorage.setItem("refreshtoken", refreshtoken);
        localStorage.setItem("jwt_exp", exp);
        return jwt;
    }

    async login(email, password) {
        return await this.loginOrRegister("login", email, password);
    }

    async register(email, password) {
        return await this.loginOrRegister("register", email, password);
    }

}