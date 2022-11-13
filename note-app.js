(
    function app() {
        let welcomeContainer = document.getElementById('welcome-screen');
        let nameText = document.createElement('input');
        let loginBtn = document.createElement('button');

        function buildLogin() {
            let h1 = document.createElement('h1');
            let welcomeLbl = document.createElement('label');
            welcomeLbl.innerText = 'Welocome!';
            h1.appendChild(welcomeLbl);
            welcomeContainer.appendChild(h1);


            let loginContainer = document.createElement('div');
            nameText.placeholder = 'Enter user name...';
            loginContainer.appendChild(nameText);
            loginBtn.innerHTML = 'Go';
            loginContainer.appendChild(loginBtn);

            let nameLbl  = document.createElement('h2');
            nameLbl.innerHTML = "What's your name?";
            nameLbl.style = 'width: 100%;'
            welcomeContainer.appendChild(nameLbl);
            welcomeContainer.appendChild(loginContainer);
        }

        buildLogin();

        let userContainer = document.getElementById('user-screen');
        let user = null;
        loginBtn.onclick = () => {
            // check to see if user exists
            let name = nameText.value.trim();
            // if exist then load their page

            // else create class new user
            if(name) { // check for valid names!!!!!!
                welcomeContainer.classList.add('hidden');
                userContainer.classList.remove('hidden');
                user = new User(name, userContainer);
            }

            // display user page
        }
    }
)();