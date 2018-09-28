// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
let enquire: any;
if (typeof window !== 'undefined') {
    const matchMediaPolyfill = (mediaQuery: string): MediaQueryList => {
        return {
            media: mediaQuery,
            // tslint:disable-next-line:object-literal-sort-keys
            matches: false,
            // tslint:disable-next-line:no-empty
            addListener() { },
            // tslint:disable-next-line:no-empty
            removeListener() { },
        };
    };
    window.matchMedia = window.matchMedia || matchMediaPolyfill;
    // tslint:disable-next-line:no-var-requires
    enquire = require('enquire.js'); // eslint-disable-line global-require
}

export function getMenuItems(moduleData: any, locale: any) {
    const menuMeta = moduleData.map((item: any) => item.meta);
    const menuItems = {};
    menuMeta.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).forEach((meta: any) => {
        const category = (meta.category && meta.category[locale]) || meta.category || 'topLevel';
        if (!menuItems[category]) {
            menuItems[category] = {};
        }

        const type = meta.type || 'topLevel';
        if (!menuItems[category][type]) {
            menuItems[category][type] = [];
        }

        menuItems[category][type].push(meta);
    });
    return menuItems;
}

export function isZhCN(pathname: any) {
    return /-cn\/?$/.test(pathname);
}

export function getLocalizedPathname(path: any, zhCN: any) {
    const pathname = path.startsWith('/') ? path : `/${path}`;
    if (!zhCN) {
        // to enUS
        return /\/?index-cn/.test(pathname) ? '/' : pathname.replace('-cn', '');
    } else if (pathname === '/') {
        return '/index-cn';
    } else if (pathname.endsWith('/')) {
        return pathname.replace(/\/$/, '-cn/');
    }
    return `${pathname}-cn`;
}

export function ping(callback: any) {
    // eslint-disable-next-line
    const url =
        'https://private-a' +
        'lipay' +
        'objects.alip' +
        'ay.com/alip' +
        'ay-rmsdeploy-image/rmsportal/RKuAiriJqrUhyqW.png';
    const img = new Image();
    let done: any;
    const finish = (status: any) => {
        if (!done) {
            done = true;
            img.src = '';
            callback(status);
        }
    };
    img.onload = () => finish('responded');
    img.onerror = () => finish('error');
    img.src = url;
    return setTimeout(() => finish('timeout'), 1500);
}

export function isLocalStorageNameSupported() {
    const testKey = 'test';
    const storage = window.localStorage;
    try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

export function enquireScreen(cb: any) {
    if (!enquire) {
        return;
    }
    /* eslint-disable no-unused-expressions */
    // and (min-width: 320px)
    enquire.register('only screen and (max-width: 768px)', {
        match: () => {
            // tslint:disable-next-line:no-unused-expression
            cb && cb(true);
        },
        unmatch: () => {
            // tslint:disable-next-line:no-unused-expression
            cb && cb();
        },
    });
    /* eslint-enable no-unused-expressions */
}

export function loadJSONP(path: string, callback: (res: any) => void) {
    const callbackName = 'jsonp_' + new Date().getTime();
    window[callbackName] = callback;
    const head = document.getElementsByTagName('head')[0];
    const el = document.createElement('script');
    el.src = path + '&callback=' + callbackName;
    head.insertBefore(el, head.firstChild);
}
