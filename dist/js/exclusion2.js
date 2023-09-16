"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_filtered_url = void 0;
const filterlist = ["stackoverflow.com"];
function is_filtered_url() {
    for (let filter_url of filterlist) {
        if (document.URL.indexOf(filter_url) > -1) {
            console.log('No Extension due to filter rule');
            return true;
        }
    }
    return false;
}
exports.is_filtered_url = is_filtered_url;
