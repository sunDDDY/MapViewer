import uuidv4 from 'uuid/v4';
import ClientOAuth2 from 'client-oauth2';

const credentials = {
    clientId: '073D5473-9AAB-432B-ACB9-7820256ADD1B',
    issuer: 'https://adfs01.issukraine.com/adfs',
    resource: 'https://api.issukraine.com'
};
const state_storeName = 'api-token-state';
const tokenInfo_storeName = 'api-token-info';

function trimHash(url) {
    return url.split('#')[0];
}

function hasHash(url) {
    return url !== trimHash(url);
}

function getClientOAuth2(state) {
    return new ClientOAuth2({
        clientId: credentials.clientId,
        accessTokenUri: `${credentials.issuer}/oauth2/access_token`,
        authorizationUri: `${credentials.issuer}/oauth2/authorize`,
        redirectUri: trimHash(window.location.href),
        state: state
    });
}

class TokenInfo {
    constructor(accessToken, expires) {
        this.accessToken = accessToken;
        this.expires = expires;
    }

    get msLeft() {
        return this.expires - new Date();
    }

    get isOk() {
        if (!this.accessToken)
            return false;
        return !(!this.expires || isNaN(this.expires) || this.expires < new Date());
    }

    _save2Storage() {
        localStorage[tokenInfo_storeName] = this._stringify();
    }

    _stringify() {
        return JSON.stringify(this);
    }

    static async _request() {
        var state = TokenInfo._getStateFromStorage(true);
        var clientOAuth2 = getClientOAuth2(state);
        window.location.href = await clientOAuth2.token.getUri({ query: { resource: credentials.resource } });
    }

    static _parse(str) {
        if (!str) {
            return null;
        }
        var json = JSON.parse(str);
        var accessToken = json.accessToken;
        var expires = new Date(Date.parse(json.expires));
        var info = new TokenInfo(accessToken, expires);
        if (!info.isOk) {
            return null;
        }
        return info;
    }

    static _getFromToken(token) {
        var accessToken = token.accessToken;
        var expires = token.expires;
        var info = new TokenInfo(accessToken, expires);
        if (!info.isOk) {
            return null;
        }
        return info;
    }

    static async _getFromURL() {
        if (!hasHash(window.location.href)) {
            return null;
        }
        var state = this._getStateFromStorage(false);
        if (!state) {
            return null;
        }
        var clientOAuth2 = getClientOAuth2(state);
        var token;
        try {
            token = await clientOAuth2.token.getToken(window.location.href);
        }
        catch (e) {
            if (e instanceof TypeError) { // client-oauth2 getToken failed with TypeError
                token = null;
            } else {
                throw e;
            }
        }
        if (!token) {
            return null;
        }
        return TokenInfo._getFromToken(token);
    }

    static _removeFromURL() {
        window.history.replaceState({}, document.title, trimHash(window.location.href));
    }

    static _getFromStorage() {
        return TokenInfo._parse(localStorage[tokenInfo_storeName]);
    }

    static _removeFromStorage() {
        localStorage.removeItem(tokenInfo_storeName);
    }

    static _getStateFromStorage(fresh) {
        if (fresh) {
            localStorage[state_storeName] = uuidv4();
        }
        return localStorage[state_storeName];
    }

    static _removeStateFromStorage() {
        localStorage.removeItem(state_storeName);
    }
}

export default class Auth {
    static async run(autoRefresh = false) {
        var info = null;

        if (!info) {
            info = TokenInfo._getFromStorage();
        }

        if (!info) {
            info = await TokenInfo._getFromURL();
            if (info) {
                info._save2Storage();
                TokenInfo._removeFromURL();
            }
        }

        if (!info) {
            await TokenInfo._request();
        }

        if (info && autoRefresh) {
            setTimeout(Auth.run, info.msLeft);
        }

        return info;
    }

    static cleanCache() {
        TokenInfo._removeFromStorage();
        TokenInfo._removeStateFromStorage();
    }
}
