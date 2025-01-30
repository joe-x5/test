
var header = document.getElementById('header');
var f1 = document.getElementsByClassName('footerelement')[0];
var f2 = document.getElementsByClassName('footerelement')[1];
var f3 = document.getElementsByClassName('footerelement')[2];
var app = document.getElementById('app');
var loader = document.getElementById('loader');
var ltext = document.getElementsByClassName('loading')[0];
var setime;

function getFavData(l) {
    l = new URL(l).protocol + new URL(l).hostname;
    l = new URL(l);
    return l + 'favicon.ico';
}

function tooglecursor() {
    if (navigator.spatialNavigationEnabled == true) { navigator.spatialNavigationEnabled = false; } else {
        navigator.spatialNavigationEnabled = true;
    }
}


function setuplink() {
    app.innerHTML = '<br><br><center><h3>- Setup Your Link -</h3><br><center><span id="error" style="color: red; font-size:small"></span></center></center><input type="url" value="http://" placeholder="http://wikimedia.github.io/wikipedia-kaios" id="link" class="focusable" tabindex="0"><button id="setupbtn" class="focusable" tabindex="1">Check & Setup</button>';
    document.querySelectorAll('.focusable')[0].focus();
    document.body.removeEventListener('keyup', keyupload);
    document.body.addEventListener('keyup', keyupsetuplink);
    document.getElementById('setupbtn').addEventListener('click', function () { validlink(document.getElementById('link').value); });
}

function validlink(link) {
    if (!urlreachable(link)) { document.getElementById('error').innerHTML = ('* Invalid Url'); } else {

        var links = localStorage.getItem('link');


        loader.style.display = 'flex'; ltext.innerHTML = 'Processing ...';
        setTimeout(function () { ltext.innerHTML = 'Setting Up ...'; }, 1000);

        if (links == null) {
            setTimeout(function () {
                if (!localStorage.setItem('link', link)) { ltext.innerHTML = 'Done ...'; loader.style.display = 'none'; load(link); } else {
                    ltext.innerHTML = 'Something Is Wrong'; window.close();
                }
            }, 3000);
        } else {
            setTimeout(function () {
                if (!localStorage.setItem('link', localStorage.getItem('link') + '|' + link)) { ltext.innerHTML = 'Done ...'; loader.style.display = 'none'; load(link); } else {
                    ltext.innerHTML = 'Something Is Wrong'; window.close();
                }
            }, 3000);
        }
        document.body.removeEventListener('keyup', keyupsetuplink);
    }
}

function visitlink(link) {
    loader.style.display = 'flex'; ltext.innerHTML = 'Loading ...';
    window.location.href = link;
    //document.addEventListener('keyup', function(e) {if(e.key) { loader.style.display = 'none'; ltext.innerHTML = ''; }});
}

function load(link) {
    if (localStorage.getItem('note') == null) { alert('Press 0 For Toggle Cursor'); localStorage.setItem('note', 'yes'); } else { }

    var links = localStorage.getItem('link').split('|');
    var linkshtml = '';
    for (var i = 0; i < links.length; i++) { linkshtml += '<div class="box focusable" data-link="' + links[i] + '" id="link" tabindex="' + i + '"><img src="' + getFavData(links[i]) + '" onerror="this.src=\'icons/net.png\';" width="24px" id="licon"></div>'; }
    app.innerHTML = '<center>' + linkshtml + '<div class="box focusable" tabindex="' + links.length + '" id="addnewlink"><img src="icons/plus.png" width="24px"></div><div class="box focusable" tabindex="' + (links.length + 1) + '" id="resetlink" style="display:block">Reset</div></center><div class="toasttext">Link Load Successfully</div>';
    document.querySelectorAll('.focusable')[0].focus();
    header.innerHTML = document.querySelectorAll('.focusable')[0].getAttribute('data-link').split('.')[0].replace(/http:\/\//g, '').replace(/https:\/\//g, ''); f1.innerHTML = 'Delete';
    document.body.addEventListener('keyup', keyupload);

    document.querySelectorAll('#addnewlink')[0].addEventListener('click', function () { setuplink(); });
    document.querySelectorAll('#resetlink')[0].addEventListener('click', function () { localStorage.removeItem('link'); window.location.reload(); });
    document.querySelectorAll('#addnewlink')[0].addEventListener('focus', function () { f1.innerHTML = ''; header.innerHTML = 'Add Link'; f2.innerHTML = 'OK'; });
    document.querySelectorAll('#resetlink')[0].addEventListener('focus', function () { f1.innerHTML = ''; header.innerHTML = 'Reset All'; f2.innerHTML = 'OK'; });

    for (var j = 0; j < document.querySelectorAll('#link').length; j++) {
        document.querySelectorAll('#licon')[j].addEventListener('error', function () { this.src = 'icons/net.png'; });
        document.querySelectorAll('#link')[j].addEventListener('click', function () { visitlink(this.getAttribute('data-link')); });
        document.querySelectorAll('#link')[j].addEventListener('focus', function () { f1.innerHTML = 'Delete'; f2.innerHTML = 'Visit'; header.innerHTML = this.getAttribute('data-link').split('.')[0].replace(/http:\/\//g, '').replace(/https:\/\//g, ''); });
        document.querySelectorAll('#link')[j].removeEventListener('keyup', keyupremove);
        document.querySelectorAll('#link')[j].addEventListener('keyup', keyupremove);
    }
}

if (localStorage.getItem('link') == null || localStorage.getItem('link') == '|') {
    localStorage.removeItem('link');
    setuplink();
} else {
    load(localStorage.getItem('link'));
}


function keyupsetuplink(e) {
    switch (e.key) {
        case 'ArrowDown': focus(1);
            break;
        case 'ArrowUp': focus(-1);
            break;
        case 'Down': focus(1);
            break;
        case 'Up': focus(-1);
            break;
        case 'Enter': document.activeElement.click();
            break;
        case 'SoftRight': window.close();
            break;
    }
}


function keyupload(e) {
    switch (e.key) {
        case 'ArrowDown': focus(3);
            break;
        case 'ArrowUp': focus(-3);
            break;
        case 'ArrowLeft': focus(-1);
            break;
        case 'ArrowRight': focus(1);
            break;
        case 'Down': focus(1);
            break;
        case 'Up': focus(-1);
            break;
        case 'Enter': document.activeElement.click();
            break;
        case 'SoftRight': window.close();
            break;
        case 'Backspace': loader.style.display = 'none';
            break;
        case '0': tooglecursor();
            break;
    }
}

function keyupremove(e) {
    if (e.key == 'F1' || e.key == 'SoftLeft') {
        if (document.querySelectorAll('#link').length > 1) {
            if (this == this.parentNode.firstElementChild) {
                localStorage.setItem('link', localStorage.getItem('link').replace(this.getAttribute('data-link') + '|', ''));
            } else {
                localStorage.setItem('link', localStorage.getItem('link').replace('|' + this.getAttribute('data-link'), ''));
            }
        } else {
            localStorage.removeItem('link');
        }
        window.location.reload();
        document.querySelector('.toasttext').innerHTML = 'Link Deleted';
    }
}

function focus(move) {
    var currentIndex = document.activeElement.tabIndex;
    var next = currentIndex + move;
    if (next > document.querySelectorAll('.focusable').length - 1) { next = 0; } else if (next < 0) { next = document.querySelectorAll('.focusable').length - 1; }
    var items = document.querySelectorAll('.focusable');
    var targetElement = items[next];
    targetElement.focus(); loader.style.display = 'none';
    targetElement.scrollIntoView({ block: 'center' });

}


document.addEventListener('DOMContentLoaded', () => {
    getKaiAd({
        publisher: '58d21092-87f8-47c3-883d-fcd67eb318d8',
        app: 'pwa_manager',
        slot: 'pwa_manager',
        onerror: err => console.error('Custom catch:', err),
        onready: ad => {
            ad.call('display');
        }
    });
});


document.body.addEventListener('keyup', () => {
    getKaiAd({
        publisher: '58d21092-87f8-47c3-883d-fcd67eb318d8',
        app: 'pwa_manager',
        slot: 'pwa_manager',
        onerror: err => console.error('Custom catch:', err),
        onready: ad => {
            ad.call('display');
        }
    });
});









function urlreachable(r) { try { return u = new URL(r), !0 } catch (r) { return !1 } }