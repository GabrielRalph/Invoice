import * as FB from "./firebase-config.js"

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

// class WaveLoader{
//   constructor(el){
//     console.log(el);
//     this.el =  el;
//     this.θ = 0;
//     this.dθ = 0.1;
//     this.width = 100;
//     this.height = 30;
//     this.moving = false;

//     this.fade_delay = 0.5; //seconds

//     //fullscreen
//     let w = window.innerWidth;
//     let h = window.innerHeight;
//     this.el.setAttribute('viewBox',`-${w/2} -${h/2} ${w} ${h}`)
//   }
//   wavePath(){
//     let path = ''
//     let x = -this.width/2;
//     for (var θ = this.θ; θ - this.θ < 2*Math.PI; θ += this.dθ){
//       let y = (this.height/2)*Math.sin(θ);
//       path += `L${x},${y}`;
//       x += this.width/(2*Math.PI/this.dθ);
//     }
//     path = path.replace(/L/, 'M')
//     this.el.innerHTML = `<path d = "${path}" class = "wave" />`
//     this.θ += this.dθ
//   }

//   start(){
//     this.el.style.setProperty('opacity', '1')
//     this.moving = true;
//     let callback = () => {
//       this.wavePath();
//       if (this.moving){
//         window.requestAnimationFrame(callback);
//       }
//     }
//     window.requestAnimationFrame(callback)
//   }
//   stop(){
//     this.el.style.setProperty('transition', this.fade_delay + 's ease-in')
//     this.el.style.setProperty('pointer-events', 'none')
//     this.el.style.setProperty('opacity', '0')
//     setTimeout(() => {
//       this.moving = false;
//     }, 1000*this.fade_delay)
//   }
// }

class FireAuth {
  constructor(){
    this.user = null;
    this.onuser = [];
    this.onnewuser = [];


    FB.onAuthStateChanged((user) => {
      //If no user then navigate to the login widget
      if (!user){
        alert("click to sign in")
        window.onclick = () => {
          this.signIn();
        }
      }else{
        this.getUser(user)

      }
    });
  }

  async deleteAccount() {
    try {
      await FB.deleteUser(getAuth().currentUser)
    } catch (e){
      alert('Please sign in again to delete your account.');
      
    }
  }

  signIn(){
    window.onclick = null;
    // if (window.confirm("Sign in to continue?")) {
      alert("siging in")
      try {
        const provider = new FB.GoogleAuthProvider();
        FB.signInWithPopup(provider);
      } catch (e) {
        alert(e);
      }
    // }
  }

  signOut(){
    FB.signOut();
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
    FB.onValue(FB.ref(`invoices/users/${user_a.uid}`), (e) => {
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
    if (FB.getAuth().currentUser == null){
      throw `No user`
      return
    }
    let c_user = firebase.auth().currentUser
    var create_user = FB.httpsCallable('createUser');
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

    return FB.update(FB.ref(`invoices/users/${this.user.uid}`), update)
  }

  addClient(client){
    if (this.user == null){
      throw `No user`
      return
    }

    var add_client = FB.httpsCallable('addClient');
    return add_client({client: client})
  }

  getClient(email){
    if (this.user == null){
      throw `No user`
      return
    }

    var get_client = FB.httpsCallable('getClient');
    return get_client({email: email})
  }

  // get_OAuth2(){
  //   return new Promise((resolve, reject) => {
  //     const SCOPE = 'https://www.googleapis.com/auth/gmail.send';
  //     console.log('getting auth ...');
  //     gapi.load('client', () => {
  //       gapi.client.init({
  //         apiKey: 'AIzaSyAo_SQIwSNHY1SaH8C-dKDGW86lX4nUDZI',
  //         clientId: '201145539454-8shtqk42sdmjqqalujg61lb0lb4shbdb.apps.googleusercontent.com',
  //         discoveryDocs: ['https://gmail.googleapis.com/$discovery/rest?version=v1'],
  //         scope: SCOPE
  //       }).then((e) => {
  //         console.log('client loaded.\nsignin ...');
  //         const googleAuth = gapi.auth2.getAuthInstance()
  //          googleAuth.signIn().then(() => {
  //           let user = googleAuth.currentUser.get();
  //           let isAuthorized = user.hasGrantedScopes(SCOPE);
  //           if (isAuthorized){
  //             console.log('Access Recieved');
  //             let accessToken = user.getAuthResponse().access_token;
  //             console.log(accessToken);
  //             resolve(accessToken);
  //           }
  //         }).catch((err2) => {
  //           reject(err2)
  //         })
  //       }).catch((err) => {
  //         reject(err)
  //       })
  //     })
  //   })
  // }

  // send(invoice, html){
  //   if (this.user == null){
  //     throw `No user`
  //     return
  //   }
  //   return new Promise((resolve, reject) => {
  //     this.get_OAuth2().then((oAuth2) => {
  //       var send_email = firebase.functions().httpsCallable('sendInvoice');
  //       send_email({invoice: invoice, html: html, accessToken: oAuth2}).then((e) => {
  //         resolve(e)
  //       }).catch((err2) => {
  //         reject(err2)
  //       })
  //     }).catch((err) => {
  //       reject(err)
  //     })

  //   })

  // }

  removeClient(client){
    if (this.user == null){
      throw `No user`
    }
    let id = client;
    if (typeof client === 'object' && 'email' in client){
      id = this.client_id(client.email)
    }

    return FB.set(FB.ref(`invoices/users/${this.user.uid}/clients/${id}`), null);
  }

  runEventListener(name, param){

    name = 'on' + name;
    if (!(name in this)){
      throw `${name} is not a valid event`
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
    }
    if (!(callback instanceof Function)){
      throw 'Callback must be a function'
    }
    this[type].push(callback)
  }
}

// class FireFriend{
//   constructor(auth){
//     this.fireAuth = auth;
//     this.userTemplate = (user) => {
//       return{
//         name: user.displayName,
//         dpURL: user.photoURL,
//       }
//     }
//     this.user = null
//   }

//   async getUser(user, callback){
//     let ref = FB.ref(`users/${user.uid}`);
//     let sc = await FB.get(ref);
//       if (sc.val() == null){
//         await FB.set(ref, this.userTemplate(user));
//         this.getUser(user, callback);
//       }else{
//         this.user = sc.val();
//         this.addNavigator('navigator')
//         callback(sc)
//         if (this.fireAuth.loader instanceof WaveLoader){
//           this.fireAuth.loader.stop()
//         }
//       }
//   }

//   addNavigator(elem){
//     this.el = parseElement(elem);
//     if (this.el != null){
//       this.el.innerHTML = `<span>Hey, ${this.user.name}</span><img src = "${this.user.dpURL}" />` + this.el.innerHTML
//     }
//   }
// }

window.FireAuth = FireAuth;
export {FireAuth}