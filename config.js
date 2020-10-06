var CLIENT_ID = null;//'469438762797-b0d7le9gnc9tctol5hfq2co0r2ak7o77.apps.googleusercontent.com';

const firebaseConfig = {
  apiKey: "AIzaSyDniS0prRjEmOyKbMd4jequo9gkwe2otKI",
  authDomain: "fashion-galetora.firebaseapp.com",
  databaseURL: "https://fashion-galetora.firebaseio.com",
  projectId: "fashion-galetora",
  storageBucket: "fashion-galetora.appspot.com",
  messagingSenderId: "469438762797",
  appId: "1:469438762797:web:759f543ce82183b9f04da4",
  measurementId: "G-Q7DJ37H3D0"
};

firebase.initializeApp(firebaseConfig);

let parseElement = (elem) => {
  if (elem == null){
    return null
  }
  if (typeof elem === 'string'){
    return parseElement(document.getElementById(elem))
  }else if ((`${elem.constructor}`).indexOf('Element') != -1){
    return elem
  }else{
    return null
  }
}

class WaveLoader{
  constructor(el){
    console.log(el);
    this.el =  el;
    this.θ = 0;
    this.dθ = 0.1;
    this.width = 100;
    this.height = 30;
    this.moving = false;

    this.fade_delay = 0.5; //seconds

    //fullscreen
    let w = window.innerWidth;
    let h = window.innerHeight;
    this.el.setAttribute('viewBox',`-${w/2} -${h/2} ${w} ${h}`)
  }
  wavePath(){
    let path = ''
    let x = -this.width/2;
    for (var θ = this.θ; θ - this.θ < 2*Math.PI; θ += this.dθ){
      let y = (this.height/2)*Math.sin(θ);
      path += `L${x},${y}`;
      x += this.width/(2*Math.PI/this.dθ);
    }
    path = path.replace(/L/, 'M')
    this.el.innerHTML = `<path d = "${path}" class = "wave" />`
    this.θ += this.dθ
  }

  start(){
    this.el.style.setProperty('opacity', '1')
    this.moving = true;
    let callback = () => {
      this.wavePath();
      if (this.moving){
        window.requestAnimationFrame(callback);
      }
    }
    window.requestAnimationFrame(callback)
  }
  stop(){
    this.el.style.setProperty('transition', this.fade_delay + 's ease-in')
    this.el.style.setProperty('pointer-events', 'none')
    this.el.style.setProperty('opacity', '0')
    setTimeout(() => {
      this.moving = false;
    }, 1000*this.fade_delay)
  }
}

class FireAuth{
  constructor(signin = true){

    this.uiConfig = {
      // Url to redirect to after a successful sign-in.
      'signInSuccessUrl': '/',
      'callbacks': {
        'signInSuccess': function(user, credential, redirectUrl) {
          if (window.opener) {
            // The widget has been opened in a popup, so close the window
            // and return false to not redirect the opener.
            window.close();
            return false;
          } else {
            // The widget has been used in redirect mode, so we redirect to the signInSuccessUrl.
            return true;
          }
        }
      },
      'signInOptions': [
        // TODO(developer): Remove the providers you don't need for your app.
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // Required to enable ID token credentials for this provider.
          clientId: CLIENT_ID,
          customParameters: {
            // Forces account selection even when one account
            // is available.
            prompt: 'select_account'
          }
        },
      ],
      // Terms of service url.
      'tosUrl': 'https://www.google.com',
      'credentialHelper': CLIENT_ID && CLIENT_ID != 'YOUR_OAUTH_CLIENT_ID' ?
          firebaseui.auth.CredentialHelper.GOOGLE_YOLO :
          firebaseui.auth.CredentialHelper.NONE
    };

    this.user = null;
    this.onuser = [];
    this.onnewuser = [];

    // Initialize the FirebaseUI Widget using Firebase.
    this.ui = new firebaseui.auth.AuthUI(firebase.auth());

    if (signin){
      // Disable auto-sign in.
      this.ui.disableAutoSignIn();


      firebase.auth().onAuthStateChanged((user) => {
        //If no user then navigate to the login widget
        if (!user){
          window.location.assign('/widget.html')

          // Execute event handlers
        }else{
          this.getUser(user)
        }
      });
    }else{
      this.ui.start('#firebaseui-auth-container', this.uiConfig)
    }
  }

  deleteAccount() {
    firebase.auth().currentUser.delete().catch(function(error) {
      if (error.code == 'auth/requires-recent-login') {
        // The user's credential is too old. She needs to sign in again.
        firebase.auth().signOut().then(function() {
          // The timeout allows the message to be displayed after the UI has
          // changed to the signed out state.
          setTimeout(function() {
            alert('Please sign in again to delete your account.');
          }, 1);
        });
      }
    });
  }

  signOut(){
    firebase.auth().signOut();
  }
  attachSignOutButton(elem){
    let element = parseElement(elem);
    if (element != null){
      element.onclick = () => {
        this.signOut();
      }
    }else{
      console.error(`${elem} is neither a valid element or id`);
    }
  }

  client_id(user){
    return user.email.replace(/\.|\#|\$|\[|\]/g, '_')
  }

  getUser(user_a){
    // Find user in the database
    firebase.database().ref(`invoices/users/${user_a.uid}`).on('value', (e) => {
      let user_f = e.val();

      // If no user exists
      if (user_f == null){
        this.createUser().then((e) => {
          this.runEventListener('user', e.data)
        })

      //If they have an account, run the onuser event listener and set this user
      }else{
        this.user = user_f;
        this.runEventListener('user', user_f)
      }
    })
  }
  createUser(){
    if (firebase.auth().currentUser == null){
      throw `No user`
      return
    }
    let c_user = firebase.auth().currentUser
    var create_user = firebase.functions().httpsCallable('createUser');
    return create_user({user: {
      displayName: c_user.displayName,
      email: c_user.email,
      photoURL: c_user.photoURL
    }})
  }
  updateUser(update){
    if (this.user == null){
      throw `No user`
      return
    }

    return firebase.database().ref(`invoices/users/${this.user.uid}`).update(update)
  }

  addClient(client){
    if (this.user == null){
      throw `No user`
      return
    }

    var add_client = firebase.functions().httpsCallable('addClient');
    return add_client({client: client})
  }
  getClient(email){
    if (this.user == null){
      throw `No user`
      return
    }

    var get_client = firebase.functions().httpsCallable('getClient');
    return get_client({email: email})
  }
  get_OAuth2(){
    return new Promise((resolve, reject) => {
      const SCOPE = 'https://www.googleapis.com/auth/gmail.send';
      console.log('getting auth ...');
      gapi.load('client', () => {
        gapi.client.init({
          apiKey: 'AIzaSyAo_SQIwSNHY1SaH8C-dKDGW86lX4nUDZI',
          clientId: '201145539454-8shtqk42sdmjqqalujg61lb0lb4shbdb.apps.googleusercontent.com',
          discoveryDocs: ['https://gmail.googleapis.com/$discovery/rest?version=v1'],
          scope: SCOPE
        }).then((e) => {
          console.log('client loaded.\nsignin ...');
          const googleAuth = gapi.auth2.getAuthInstance()
           googleAuth.signIn().then(() => {
            let user = googleAuth.currentUser.get();
            let isAuthorized = user.hasGrantedScopes(SCOPE);
            if (isAuthorized){
              console.log('Access Recieved');
              let accessToken = user.getAuthResponse().access_token;
              console.log(accessToken);
              resolve(accessToken);
            }
          }).catch((err2) => {
            reject(err2)
          })
        }).catch((err) => {
          reject(err)
        })
      })
    })
  }


  send(invoice, html){
    if (this.user == null){
      throw `No user`
      return
    }
    return new Promise((then, catch) => {
      this.get_OAuth2().then((oAuth2) => {
        var send_email = firebase.functions().httpsCallable('sendInvoice');
        send_email({invoice: invoice, html: html, accessToken: oAuth2}).then((e) => {
          then(e)
        }).catch((err2) => {
          catch(err)
        })
      }).catch((err) => {
        catch(err)
      })

    })

  }

  removeClient(client){
    if (this.user == null){
      throw `No user`
      return
    }
    let id = client;
    if (typeof client === 'object' && 'email' in client){
      id = this.client_id(client.email)
    }
    return firebase.database().ref(`invoices/users/${this.user.uid}/clients/${id}`).remove()
  }

  runEventListener(name, param){
    name = 'on' + name;
    if (!(name in this)){
      throw `${name} is not a valid event`
      return
    }
    let event_listener = this[name]
    if (event_listener instanceof Function){
      event_listener(param)
    }else if(event_listener instanceof Array){
      event_listener.forEach((callback) => {
        callback(param)
      })
    }
  }
  addEventListener(type, callback){
    type = 'on' + type;
    if (!(type in this)){
      throw `${type} is not a valid event listener`
      return
    }
    if (!(callback instanceof Function)){
      throw 'Callback must be a function'
      return
    }
    this[type].push(callback)
  }
}

class FireFriend{
  constructor(auth){
    this.fireAuth = auth;
    this.db = firebase.database();
    this.userTemplate = (user) => {
      return{
        name: user.displayName,
        dpURL: user.photoURL,
      }
    }
    this.user = null
  }

  getUser(user, callback){
    let ref = this.db.ref(`users/${user.uid}`)
    ref.once('value').then((sc) => {
      if (sc.val() == null){
        ref.set(this.userTemplate(user)).then(() => {
          this.getUser(user, callback)
        })
      }else{

        this.user = sc.val();
        this.addNavigator('navigator')
        callback(sc)
        if (this.fireAuth.loader instanceof WaveLoader){
          this.fireAuth.loader.stop()
        }
      }
    })
  }

  addNavigator(elem){
    this.el = parseElement(elem);
    if (this.el != null){
      this.el.innerHTML = `<span>Hey, ${this.user.name}</span><img src = "${this.user.dpURL}" />` + this.el.innerHTML
    }
  }
}
