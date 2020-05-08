class User{
    constructor(username, email, id){
        this.username = username;
        this.email = email;
        this.id = id;
        this.homePage();
    }
    index(){
        fetch(`${BASE_URL}/users/${this.id}`).then(response => response.json()).then(data => this.setUpHomePage(data)).catch(error => console.log(error.messages));
    }
    show(brain_id){
        fetch(`${BASE_URL}/users/${this.id}/brains/${brain_id}`).then(response => response.json()).then(data => this.setUpHomePage(data)).catch(error => console.log(error.messages));
    }      
    
    homePage(){
        let heading = document.createElement('h1');
        heading.innerText = this.username;
        mainContent.appendChild(heading);
        this.createUserButtons();
        this.createBrainLinks();
    }
    createUserButtons(){
        let home = document.createElement('button');
        home.innerHTML = 'Home';
        home.addEventListener('click', () => this.homePage);
        mainContent.appendChild(home);
        let logout = document.createElement('button');
        logout.innerHTML = 'Logout';
        logout.addEventListener('click', () => {
            current_user = null;
                
            console.log(getInfo(`${BASE_URL}/sessions/destroy`));
            renderHomePage();
        });
        mainContent.appendChild(logout);
        let about = document.createElement('button');
        about.addEventListener('click', () => getResp(`${BASE_URL}/about`, 'Get'));
        about.innerHTML = 'About';
        mainContent.appendChild(about);
    }

    createBrainButton(name){
        let button = document.createElement('button');
        button.innerHTML = `Create a ${name}`;
        button.addEventListener('click', () => getResp(`${BASE_URL}/users/${this.id}/brains/new`));
        mainContent.appendChild(button);
    }

    createBrainLinks(){
        let types = ['Suggestive Brain', 'Sentimental Brain']
        for(let i = 0; i < types.length; i++){
            this.createBrainButton(types[i]);
        }
    }

    static async getCurrentUser(){
        
        let thisUser;
        await fetch(`${BASE_URL}/sessions`,{
            method: 'GET'
        }).then(response => response.json()).then(data => thisUser = data).catch(error => alert(error.message));
        if (thisUser !== undefined) return thisUser;
    
    }
}

const BASE_URL = "http://localhost:3000"
const mainContent = document.getElementsByClassName('user_location')[0];

let renderHomePage = function(){
    mainContent.innerHTML = '';
    let box = document.createElement('div')
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
    login.addEventListener('click', () => sendInfo(`${BASE_URL}/sessions`, {username: loginForm.value}));

    let signUpForm = document.createElement('input')
    let signup = document.createElement('button');
    signup.innerHTML = 'Signup';
    signup.addEventListener('click', () => sendInfo(`${BASE_URL}/users/new`, {username: signUpForm.value}));

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
    }).then(response => response.json()).then((data) =>{
        newUserFromJson(data)
    } ).catch((errors) => console.log(errors.messages));

}
let getInfo = function(url){
    fetch(`${url}`,{
        method: `GET`,
        headers: {
            'Content-Type': 'application/json',
            'Accepts': 'application/json'
        }
    }).then(response => response.json()).then((data) =>{
        console.log(data);
    } ).catch((errors) => console.log(errors.messages));
}

let newUserFromJson = function(data){
    console.log(data)
    mainContent.innerHTML = '';
    current_user = new User(data['data']['attributes']['username']);
 }

 document.addEventListener('DOMContentLoaded', (e) => { 
     console.log(User.getCurrentUser());
    if (await User.getCurrentUser() === 'null') renderHomePage();
    
    else {
        current_user = User.getCurrentUser();
        current_user.homePage();
    }
});