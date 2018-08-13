
const STORAGE_KEY = '_user';
const AVATAR_TEMPLATE = 'https://avatars1.githubusercontent.com/u/{id}?v=4';

export class Authentication {
    public static getCurrentUser() {
        let content = localStorage.getItem(STORAGE_KEY);
        if (content) {
            content = decodeURIComponent(unescape(atob(content)));
            try {
                const json = JSON.parse(content);
                json.avatar_url = Authentication.getAvatarFromId(json.githubId);
                return json;
            } catch (ex) {
                // tslint:disable-next-line:no-console
                console.warn('json parse storage error');
            }
        } else {
            return null;
        }
    }

    public static getAvatarFromId(id: any) {
        return AVATAR_TEMPLATE.replace('{id}', id);
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