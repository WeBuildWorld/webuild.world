
const STORAGE_KEY = '_user';
const AVATAR_TEMPLATE = 'https://avatars1.githubusercontent.com/u/{id}?v=4';

export class Authentication {
    public static getCurrentUser() {
        let content = localStorage.getItem(STORAGE_KEY);
        if (content) {
            // tslint:disable-next-line:no-debugger
            // debugger;
            content = atob(unescape(decodeURIComponent(content)));
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

    public static getAvatarFromId(id: string) {
        return AVATAR_TEMPLATE.replace('{id}', id);
    }

    public static setCurrentUser(user: any) {
        let content = JSON.stringify(user);
        content = btoa(escape(encodeURIComponent(content)));
        localStorage.setItem(STORAGE_KEY, content);
    }
}