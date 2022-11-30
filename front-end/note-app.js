function hideItems(items, hide=true) {
    for(let item of items) {
        if(hide) {
            item.classList.add('hidden')
        } else {
            item.classList.remove('hidden')
        }
    }
}

function fadeInOut(items, fadein=true) {
    let fadeTime = 500;
    let fadeDelta = .10;
    for(let item of items) {
        let opacity = (fadein) ? 0 : 1;
        item.style.opacity = opacity;

        let fadesLeft = fadeTime * fadeDelta;
        let fade = function() {
            opacity += (fadein) ? fadeDelta : -fadeDelta;
            item.style.opacity = opacity;
            fadesLeft--;
            if(fadesLeft > 0) {
                setTimeout(fade, fadeTime * fadeDelta);
            }
        }
        fade();
    }
}

function launchUser(userName = "") {
    // check to see if user exists
    let userScreen = document.getElementById('user-div');
    let name = userName.trim();

    // else create class new user
    // check for valid names!!!!!!
    user = new User(name, userScreen, db);
    let userItems = user.getHTMLElements();
    hideItems(userItems);
    setTimeout(() =>{
        hideItems(userItems, false);
        fadeInOut(userItems, true);
    }, 500);
    
}

function displayLogin() {
    // parameters for login screen
    let LOGIN_SCREEN_ID = 'login-div';
    let WELCOME_TEXT = 'Welcome';
    let ENTER_TEXT = 'Enter Name';
    let LOGIN_INPUT = '__input__';
    let PLACE_HOLDER_TEXT = 'Enter name...';
    let LOGIN_LABLES = [WELCOME_TEXT, ENTER_TEXT, LOGIN_INPUT];
    let LOGIN_ITEM_CLASS = 'login-item';

    // create login screen
    let startScreen = document.getElementById(LOGIN_SCREEN_ID);
    let loginItems = [];
    for(let itemText of LOGIN_LABLES) {
        let item;
        if(itemText === LOGIN_INPUT) {
            item = document.createElement('input');
            item.placeholder = PLACE_HOLDER_TEXT;
            item.onkeyup = (e) => {
                if(e.key === 'Enter') {
                    fadeInOut(loginItems, false)
                    lauchUser(item.value);
                    item.disabled = true;
                }
            }

        } else {
            item = document.createElement('div');
            item.innerHTML = itemText;
        }
        item.classList.add(LOGIN_ITEM_CLASS);
        startScreen.appendChild(item);
        loginItems.push(item);
    }
    fadeInOut(loginItems, true);
}

(function app() {
    setupDB("note-taker-db", launchUser)
   // console.log(db);
   //if (firstUser) {
    // launchUser("Temp");
   // }
   // else {
   //     displayLogin();
   // }
    
})();