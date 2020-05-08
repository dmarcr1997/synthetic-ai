const BASE_URL = "http://localhost:3000"
document.addEventListener('DOMContentLoaded', (e) => renderHomePage());
const mainContent = document.getElementsByClassName('user_location')[0];
let renderHomePage = function(){
    let box = document.createElement('div')
    let attrs = []
    box.style.width = '100%';
    box.style.height = '100%';
    box.style.background = '#C4C4C4';
    box.innerHTML = "Welcome to Synthetic Ai!!";
    mainContent.appendChild(box);
    let buttons = createHomeButtons();
    console.log(buttons);
    for(let i = 0; i < buttons.length; i++){
        mainContent.appendChild(buttons[i]);
    }
}

let createHomeButtons = function(){
    let loginForm = document.createElement('input')
    let login = document.createElement('button');
    login.innerHTML = 'Login';
    login.addEventListener('click', () => sendInfo(`${BASE_URL}/sessions`, loginForm.value));
    let signUpForm = document.createElement('input')
    let signup = document.createElement('button');
    signup.innerHTML = 'Signup';
    signup.addEventListener('click', () => sendInfo(`${BASE_URL}/users/new`, signUpForm.value));
    let about = document.createElement('button');
    about.addEventListener('click', () => getResp(`${BASE_URL}/about`, 'Get'));
    about.innerHTML = 'About';
    return [loginForm, login, signUpForm, signup, about];
}

let sendInfo = function(url, values){
    fetch(`${url}`,{
        method: `POST`,
        headers: {
            'Content-Type': 'application/json',
            'Accepts': 'application/json'
        },
        body: JSON.stringify(values)
    }).then(response => response.json()).then(data => console.log(data)).catch((errors) => console.log(errors.messages));
}
    