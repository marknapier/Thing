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

        // html only: don't save scripts
        $('script').remove();

        Page.download(Page.getDocumentHTML(), 'Thing_saved_file_' + randnum + '.html', 'text/html');
    }

    static initEvents() {
        // Listen for keypress
        document.addEventListener('keypress', function (e) {
          var el = document.body;
          var n = Number(e.key);
          if (n >= 0 && n <= 9) {
            // Number keys scale the page from .1 to .9. 0 is fullsize
            var scale = n === 0 ? 1 : n/10;
            el.style.transformOrigin = 'left top';
            el.style.transform = 'scale(' + scale + ')';
          }
          else if (e.key === 's') {
            // s toggles scrolling on/off
            el.style.overflow = (el.style.overflow === 'hidden') ? 'scroll' : 'hidden';
          }
        });
    }
}
Thing.addClass(Page);

module.exports = Page;
