"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gettikTokToken = void 0;
function gettikTokToken() {
    const arr = [
        'f14f66dcf3msh77e651411894bd9p1bbd03jsn5e107a09d497',
        '94fa79f580msha29c42dcf800c2ap1af9ccjsna0ea5b117667',
        '6c6fd5bcb8msh5430c505dbd79d0p1202e7jsnf26e7df8338d',
        'd454ac46d1mshe245878b11cbce4p1b0e81jsneabdfd546e1e',
        'faa9c20c8bmsh38e1677fdd6bcfbp19405fjsn6d6578d89395',
        '07100f7606msh9ac53877e5782e0p14c4d3jsn6456146bce22',
        '17a4f33a8bmsh263e2acea7e5908p115596jsn54a0a99cadb6',
    ];
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}
exports.gettikTokToken = gettikTokToken;
