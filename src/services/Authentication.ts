import { ICredential } from '../types';

const STORAGE_KEY = '_user';
const AVATAR_TEMPLATE = 'https://avatars1.githubusercontent.com/u/{id}?v=4';
const GITHUB_LINK = 'https://github.com/{login}';

export class Authentication {
    public static getCurrentUser() {
        let content = localStorage.getItem(STORAGE_KEY);
        if (content) {
            content = decodeURIComponent(unescape(atob(content)));
            try {
                const json = JSON.parse(content);
                json.avatar_url = Authentication.getAvatarFromId(json.githubId);
                json.name = json.name || '';
                return json;
            } catch (ex) {
                // tslint:disable-next-line:no-console
                console.warn('json parse storage error');
            }
        } else {
            return null;
        }
    }

    public static getGithubIdAndName(user: ICredential) {
        return user.githubId + user.login;
    }

    public static getAvatarFromId(id: any) {
        id = id || '';
        const numberId = id.toString().replace(/[^0-9]/ig, '');
        return AVATAR_TEMPLATE.replace('{id}', numberId);
    }

    public static getGithubLink(id: any) {
        id = id || '';
        const login = id.toString().replace(/^\d+/ig, '');
        return GITHUB_LINK.replace('{login}', login);
    }

    public static setCurrentUser(user: any) {
        if (!user) {
            localStorage.removeItem(STORAGE_KEY);
        }
        let content = JSON.stringify(user);
        content = btoa(escape(encodeURIComponent(content)));
        localStorage.setItem(STORAGE_KEY, content);
    }
}
