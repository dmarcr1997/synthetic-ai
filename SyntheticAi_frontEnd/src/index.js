let current_user;

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
            console.log(getInfo(`${BASE_URL}/sessions/destroy`, 'logout'));
        });
        mainContent.appendChild(logout);
        let about = document.createElement('button');
        about.addEventListener('click', () => renderAboutPage());
        about.innerHTML = 'About';
        mainContent.appendChild(about);
    }

    createBrainButton(name){
        let button = document.createElement('button');
        button.innerHTML = `Create a ${name}`;
        let indexButton = document.createElement('button');
        indexButton.innerHTML = `All ${name}s`;
        button.addEventListener('click', () => Brain.renderBrainForm(name));
        indexButton.addEventListener('click', () => Brain.renderBrainIndex(`${BASE_URL}/users/${current_user.id}/brains`, {brain_type: name}));
        mainContent.appendChild(button);
        mainContent.appendChild(indexButton);
        
    }

    createBrainLinks(){
        let types = ['Suggestive Brain', 'Sentimental Brain']
        for(let i = 0; i < types.length; i++){
            this.createBrainButton(types[i]);
        }
    }
}

class Brain{
    static renderBrainForm(option){
        let thisUser = current_user;
        console.log(thisUser.id);
        mainContent.innerHTML = '';
        let inputOne = document.createElement('input');
        inputOne.placeholder = 'Name';
        let inputTwo = document.createElement('textarea');
        inputTwo.placeholder = 'if you are creating a suggestive brain list values as {input: prop, output: [0 or 1]},. With sentimental brains enter sentences as { input: I am super happy!, output: happy },';
        let submit = document.createElement('button');
        submit.innerText = 'Submit';
        submit.addEventListener('click', () => Brain.send(`${BASE_URL}/users/${thisUser.id}/brains/new`, {name: inputOne.value, brain_data: inputTwo.value, brain_type: option}));
        let attr = [inputOne, inputTwo, submit];
        for(let i = 0; i< attr.length; i ++){
            mainContent.appendChild(attr[i]);
        }
    }

    static send(url, values){
        fetch(`${url}`,{
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'Accepts': 'application/json'
            },
            body: JSON.stringify(values)
        }).then(response => response.json()).then((data) =>{
            Brain.renderBrainFromJson(data['data'])

        } ).catch((errors) => console.log(errors.messages));
    }
    static renderBrainFromJson(data){
        mainContent.innerHTML = '';
        let brainName = data['attributes']['name'];
        let brainType = data['attributes']['brain_type'];
        let currentData = data['attributes']['brain_data'];
        let name = document.createElement('h1');
        name.innerText = brainName;
        let type = document.createElement('h3');
        type.innerText = brainType;
        let brainData = document.createElement('p');
        brainData.innerText = currentData;
        let dataEditBox = document.createElement('textarea');
        dataEditBox.innerText = currentData;
        let dataEditSubmit = document.createElement('button');
        dataEditSubmit.innerText = 'Update Data';
        dataEditSubmit.addEventListener('click', () => Brain.updateBrain(data, dataEditBox.value));
        let homePageButton = document.createElement('button');
        homePageButton.innerText = 'Back to Landing Page'
        homePageButton.addEventListener('click', () => refreshRender()); 
        let attr = [name, type, brainData, dataEditBox, dataEditSubmit, homePageButton];
        for(let i = 0; i< attr.length; i++){
            mainContent.appendChild(attr[i]);
        }
        if (brainType === 'Sentimental Brain') Brain.setupSentimentalBrain(brainName, brainData);
        else if(brainType === 'Suggestive Brain') Brain.setupSuggestiveBrain(brainName, brainData);
    }

    static updateBrain(data, value){
        let brain_id = data['data']['id']
        Brain.send(`${BASE_URL}/users/${current_user.id}/brains/${brain_id}/edit`, {brain_data: value});
    }

    static renderBrainIndex(url, values){
        fetch(`${url}`,{
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'Accepts': 'application/json'
            },
            body: JSON.stringify(values)
        }).then(response => response.json()).then((data) =>{
            Brain.renderBrainsFromJson(data)

        } ).catch((errors) => console.log(errors.messages));
    }

    static renderBrainsFromJson(data){
        let brains = data['data'];
        mainContent.innerHTML = '';
        let h1 = document.createElement('h1');
        h1.innerText = `${brains[0]['attributes']['brain_type']}`
        let ul = document.createElement('ul');
        for(let i = 0; i < brains.length; i++){
            let name = brains[i]['attributes']['name'];
            let li = document.createElement('li');
            li.innerText = name;
            li.addEventListener('click', () => Brain.renderBrainFromJson(brains[i]));
            ul.appendChild(li);
        }
        mainContent.appendChild(h1);
        mainContent.appendChild(ul);
        
    }

    static setupSentimentalBrain(name, data){

    }
    static setupSuggestiveBrain(name, data){
        console.log('in the sug brain');
        let sugBrain = new SuggestiveBrain(name, data);
        let learnButton = document.createElement('button');
        learnButton.innerText = "LEARN";
        learnButton.addEventListener('click', () => sugBrain.learn());
        let propertyInput = document.createElement('input');
        propertyInput.placeholder = 'Enter Property. Brain will tell you how much you like it.';
        let propSubmit = document.createElement('button');
        propSubmit.innerText = "Do I Like This?";
        propSubmit.addEventListener('click', () => sugBrain.propertyLike(propertyInput.value));
        let newPropertyPar = document.createElement('h3');
        newPropertyPar.innerText = 'Create a new Property and give it a like value. Less than 50 if you dislike it and greater if you like it'
        let newPropertyInput = document.createElement('input');
        newPropertyInput.placeholder = 'Create a new property';
        let newPropertyLike = document.createElement('p');
        newPropertyLike.innerText = '50';
        let propLikeButton = document.createElement('button');
        propLikeButton.innerText ='+';
        propLikeButton.addEventListener('click', () => {if (parseInt(newPropertyLike.innerText, 10) <= 100){ 
            newPropertyLike.innerHTML = `${parseInt(newPropertyLike.innerHTML, 10) + 1}`;
            console.log(newPropertyLike.innerHTML);
            }
        });
        let propDisLikeButton = document.createElement('button');
        propDisLikeButton.innerText ='-'; 
        propDisLikeButton.addEventListener('click', () => {if (parseInt(newPropertyLike.innerText, 10) >= 0) {
            
            newPropertyLike.innerHTML = `${parseInt(newPropertyLike.innerHTML, 10) -1}`;
            console.log(newPropertyLike.innerHTML);
            }
        });
        let newPropSubmit = document.createElement('button');
        newPropSubmit.innerText = "Create new Property";
        newPropSubmit.addEventListener('click', () => sugBrain.updateOrAddActivity(newPropertyInput.value, parseInt(newPropertyLike.innerText, 10)));
        let attrs =[learnButton, propertyInput, propSubmit, newPropertyPar, newPropertyInput, newPropertyLike, propLikeButton, propDisLikeButton, newPropSubmit];
        for(let i = 0; i < attrs.length; i++){
            mainContent.appendChild(attrs[i]);
        }
    }
}

class SuggestiveBrain{
    constructor(name, data){
        this.name = name;
        this.data = data;
        this.type = "Suggester";
        this.net = new brain.NeuralNetwork();
    }

    learn(){
        this.net.train(this.data);
        //add log to above code 
    }

    propertyLike(prop){
        let value = Array.from(this.net.run(prop))[0];
        if(value > 0.9) return alert("You Really Like this!");
        else if(value > 0.5) return alert("You Kind of like this.");
        else return alert("You Hate this!");
    }
    updateOrAddActivity(prop, likeVal = 50){
        let change;
        if (likeVal >= 50){
            change = [1];
        }
        else change = [0];
        this.data.push({
            input: prop, output: change});
        this.learn();
        return alert(`You changed ${Object.keys(prop)}'s value`);
    }
}

class SentimentalBrain{
    constructor(name, data){
        this.name = name;
        this.data = data;
        this.type = type;
        this._net = new brain.recurrent.LSTM();
        this._iterations = 100;
        this._errorThresh = 0.011;
    }

    learn(){
        this.net.train(this.data, {
            iterations: this.iterations,
            errorThresh: this.errorThresh
        });
    }

    get iterations(){
        return this._iterations
    }
    set iterations(iter){
        this._iterations = iter;
    }
    get errorThresh(){
        return this._errorThresh;
    }
    set errorThresh(err){
        this._errorThresh = err;
    }

    sentenceMood(sentence){
        return this.net.run(sentence);
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
    about.addEventListener('click', () => renderAboutPage());
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
let getInfo = function(url, option){
    fetch(`${url}`,{
        method: `GET`,
        headers: {
            'Content-Type': 'application/json',
            'Accepts': 'application/json'
        }
    }).then(response => response.json()).then((data) =>{
        renderHomePage();
        createMessageOrPage(data, option);
    } ).catch((errors) => console.log(errors.messages));
}
let createMessageOrPage = function(data, option){
    if (option === 'logout')
    {
        alert(data['message']);
    }
}
let newUserFromJson = function(data){
    // console.log(data)
    mainContent.innerHTML = '';
    console.log(data)
    current_user = new User(data['data']['attributes']['username'], data['data']['attributes']['email'], data['data']['id']);
 }

 let setUp = function(data){
     if (data['noCurrentUser']) renderHomePage();
     else{
        newUserFromJson(data);
        }
 }

 let renderAboutPage = function(){
    mainContent.innerHTML = '';
    let box = document.createElement('div')
    box.style.width = '100%';
    box.style.height = '100%';
    box.style.background = '#C4C4C4';
    box.innerHTML = "About";
    mainContent.appendChild(box);
    let loginPageButton = document.createElement('button');
    loginPageButton.innerText = 'Back to Landing Page'
    loginPageButton.addEventListener('click', () => refreshRender()); 
    mainContent.appendChild(loginPageButton);
   
    let par = document.createElement('p')
    par.innerText = " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum placerat, orci nec malesuada feugiat, lorem ante ultricies dui, a elementum ante risus ultrices lectus. Nunc mattis a odio vel tempor. Proin libero nunc, condimentum ac mi at, sodales tincidunt ligula. Quisque sit amet vehicula nunc. Fusce porta pulvinar metus et eleifend. Fusce accumsan fermentum justo et egestas. Sed varius mi eget auctor sodales. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ultricies elementum erat, a iaculis sapien commodo in. Nulla id volutpat massa. Suspendisse odio velit, gravida id mollis at, tincidunt ullamcorper odio. Aenean varius, lorem sit amet luctus sodales, lacus felis rhoncus tellus, nec commodo orci tellus non neque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In quam purus, vestibulum vitae fermentum eu, pulvinar non enim. Nam sapien orci, consequat vel ante ut, sodales eleifend magna. Curabitur gravida vel diam eget venenatis. Nulla facilisi. Etiam sagittis fringilla auctor. Ut a tincidunt eros. Aenean tincidunt lacus ut massa faucibus ultricies. In hac habitasse platea dictumst. Proin eu commodo mauris. Morbi blandit felis eleifend ligula pellentesque consectetur. Integer sagittis laoreet vulputate. Praesent congue egestas euismod. Etiam orci nisl, pulvinar id nisl at, congue molestie ipsum. Fusce ultrices metus massa, at pharetra nisl tempus eget. Morbi pulvinar felis elit, vel ornare lorem pretium id. Ut ac porta turpis. Nam tellus tortor, dictum eu est sed, vulputate molestie leo. Nam condimentum turpis ac massa luctus, sed laoreet dolor hendrerit. Vivamus elit ipsum, ornare malesuada dui at, convallis interdum dolor. Donec dapibus lorem hendrerit justo accumsan fringilla. Nullam pharetra vel dui sed molestie. Nam et scelerisque tellus. Fusce pulvinar ut odio at rutrum. Aenean quis turpis eu lorem rutrum fringilla at et sapien. Phasellus et molestie erat. Cras pretium mauris non gravida mattis. Integer lacinia diam eu pretium sollicitudin. Vivamus hendrerit eros eu accumsan ullamcorper. Maecenas id mauris nibh. Vivamus tristique consequat augue, placerat sodales dui facilisis vitae. Fusce neque nibh, ultrices ac ullamcorper nec, feugiat eu massa. Integer justo leo, tempor vitae commodo nec, lacinia blandit ex. Nulla ut faucibus lorem. Mauris semper et eros vel condimentum. Nulla at pretium turpis, nec finibus libero. Suspendisse eget tempor libero. Sed tincidunt orci tortor, quis lacinia erat dictum eu. Sed dignissim pellentesque turpis sit amet ullamcorper. Aenean venenatis leo vel elit sodales tincidunt. Cras neque massa, feugiat eu nibh eu, molestie semper arcu. Suspendisse ultrices nunc vel dictum vehicula. Suspendisse scelerisque nulla sed velit pellentesque efficitur. Maecenas placerat, eros quis pretium sollicitudin, est neque vestibulum dolor, nec tincidunt sapien nisi et ipsum. Nulla non vehicula ex, at rutrum ipsum. Nam accumsan, risus at maximus consectetur, libero lectus euismod diam, id rutrum justo ipsum nec mi. Ut tortor sem, faucibus sed orci ut, auctor accumsan urna. Pellentesque dictum suscipit erat at placerat. Etiam quis rhoncus augue. Pellentesque tincidunt diam in dignissim tristique."
    mainContent.appendChild(par);    
 
}

let refreshRender = function(){
    fetch(`${BASE_URL}/sessions`,{
        method: 'GET'
    }).then(response => response.json()).then(data => setUp(data)).catch(error => alert(error.message));
    
}
 document.addEventListener('DOMContentLoaded', (e) => { 
    refreshRender();
});