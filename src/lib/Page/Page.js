var Thing = require('../Thing/Thing.js');

class Page {
    static download(data, filename, type) {
        var file = new Blob([data], {type: type});
        var url = URL.createObjectURL(file);
        var a = window.document.createElement("a");
        a.href = url;
        a.download = filename;
        window.document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            window.document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    static getDocumentHTML () {
        var entireDoc = window.document.getElementsByTagName('html')[0];
        var entireDocStr = '<html>' + entireDoc.innerHTML + '</html>';
        return entireDocStr;
    }

    static saveDocToFile() {
        var randnum = parseInt(Math.random()*100000000);
        Page.download(Page.getDocumentHTML(), 'Thing_saved_file_' + randnum + '.html', 'text/html');
    }
}
Thing.addClass(Page);

module.exports = Page;
