export class CookieHelper {

    public static check(name: string): boolean {
        name = encodeURIComponent(name);
        let regexp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
        let exists = regexp.test(document.cookie);
        return exists;
    }


    public static get(name: string): string {
        if (CookieHelper.check(name)) {
            name = encodeURIComponent(name);
            let regexp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
            let result = regexp.exec(document.cookie);
            return decodeURIComponent(result[1]);
        } else {
            return null;
        }
    }

}