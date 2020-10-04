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
  constructor(elem){

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
          clientId: CLIENT_ID
        },
      ],
      // Terms of service url.
      'tosUrl': 'https://www.google.com',
      'credentialHelper': CLIENT_ID && CLIENT_ID != 'YOUR_OAUTH_CLIENT_ID' ?
          firebaseui.auth.CredentialHelper.GOOGLE_YOLO :
          firebaseui.auth.CredentialHelper.NONE
    };
    this.signin = (elem === 'signin');
    // let el = parseElement(elem);
    // if (el != null){
    //   this.loader = new WaveLoader(el.getElementsByTagName('svg')[0])
    //   this.loader.start()
    // }

    // Initialize the FirebaseUI Widget using Firebase.
    this.ui = new firebaseui.auth.AuthUI(firebase.auth());

    if (!this.signin){
      // Disable auto-sign in.
      this.ui.disableAutoSignIn();

      this.onsignin = [];

      firebase.auth().onAuthStateChanged((user) => {
        //If no user then navigate to the login widget
        if (!user){
          window.location.assign('/widget.html')

          // Execute event handlers
        }else{

          if (this.onsignin instanceof Function){
            this.onsignin(user)
          }else if(this.onsignin instanceof Array){
            this.onsignin.forEach((func) => {
              func(user)
            })
          }

        }
      });
    }else{
      this.ui.start('#firebaseui-auth-container', this.uiConfig)
    }
  }

  // attachLoader(loader){
  //   this.loader = loader;
  // }

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

  addEventListener(type, callback){
    let events = this['on' + type]
    if (events){
      if (callback instanceof Function){
        if (events instanceof Function){
          this['on' + type] = []
          this['on' + type].push(events)
          this['on' + type].push(callback)
        }else if (events instanceof Array){
          events.push(callback)
        }
      }else{
        console.error('Callback must be a function');
      }
    }else{
      console.error(`No event handler called ${type}`);
    }
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
