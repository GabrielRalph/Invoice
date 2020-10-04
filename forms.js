let ICON_SVGS = {
  edit: `   <path d="M171.6,426.3c-4.8-1.8-9.2-4-13.1-6.4l2.9,27.7c0.2,2.2,2.8,3.1,4.4,1.6l20.4-19.2C181.6,429.4,176.6,428.1,171.6,426.3z"/>
            <path d="M349.6,94.7c-6.2-18-20.2-33.3-39.5-40.5c-18.9-7.1-39-4.9-55.4,4.2L151,336.5c-0.6,1.5-0.8,3.2-0.6,4.8l6.3,61.2c3.6,4,10,8.7,19.2,12.1c9.7,3.6,17.9,4.2,23.3,3.3l44-41.3c1.5-1.4,2.7-3.2,3.4-5.2L349.6,94.7z M159.4,349.1L263.7,69.4l13.1,9L159.4,349.1z"/>`,

  add: `    <path d="M407.3,207.3H292.7V92.7c0-23.6-19.1-42.7-42.7-42.7h0c-23.6,0-42.7,19.1-42.7,42.7v114.7H92.7C69.1,207.3,50,226.4,50,250v0c0,23.6,19.1,42.7,42.7,42.7h114.7v114.7c0,23.6,19.1,42.7,42.7,42.7h0c23.6,0,42.7-19.1,42.7-42.7V292.7h114.7c23.6,0,42.7-19.1,42.7-42.7v0C450,226.4,430.9,207.3,407.3,207.3z"/>`,

  delete: ` <path d="M360.3,139.1c0.2-0.3,0.3-0.7,0.5-1c7.1-17.7-29.8-49.2-82.4-70.3s-101-23.9-108.1-6.2c-0.1,0.3-0.3,0.7-0.4,1c-12.7,1.5-21.3,5.8-24.2,13c-8.3,20.7,34.9,57.6,96.5,82.3s118.3,27.9,126.6,7.2C371.7,158,368.4,148.9,360.3,139.1z"/>
            <path d="M250,182.1c-66.4,0-120.2,14.8-120.2,40c0,1.3,0.1,2.6,0.4,3.8L151,412.5c0,20.7,44.3,37.5,99,37.5s99-16.8,99-37.5l20.8-186.6c0.3-1.3,0.4-2.5,0.4-3.8C370.2,196.9,316.4,182.1,250,182.1z M170.9,418.3l-10.2-1l-13.9-150.9l17.6,1l12,7.3l4.6,152L170.9,418.3z"/>`,

  return: `<path d="M186.4,145.5l35.1-63L50,181.6l171.5,99l-34.1-57c73.7,2.1,203.5-1.9,203.5,81c0,93.8-113.8,112.8-113.8,112.8S450,410.6,450,297.7C450,190.3,338.6,150.9,186.4,145.5z M165.6,152.9l-85.4,25l104.2-60.4L165.6,152.9z"/>`,

  confirm: `<path d="M212.7,363.6L60.2,300.8L231.4,450L439.8,50L212.7,363.6z M195,385l-76-53l88,39L195,385z"/>`,

  save: `<path d="M368.8,99h-74.9v59.4c0,4.7-3.9,8.6-8.6,8.6H159.7c-4.7,0-8.6-3.9-8.6-8.6V99h-19.9C113.5,99,99,113.5,99,131.2v237.6
  	c0,17.7,14.5,32.2,32.2,32.2h237.6c17.7,0,32.2-14.5,32.2-32.2V131.2C401,113.5,386.5,99,368.8,99z M250,223.6
  	c14.6,0,26.4,11.8,26.4,26.4s-11.8,26.4-26.4,26.4s-26.4-11.8-26.4-26.4S235.4,223.6,250,223.6z M142,341.9h158.5v6.8H142V341.9z
  	 M330.8,370.8H142v-7.5h188.8V370.8z M330.8,327H142v-6.8h188.8V327z"/>`
}
Vue.component('icon', {
  props: {
    color: {
      default: null,
      type: String
    },
    size: {
      default: 1,
      type: Number
    },
    float: {
      default: null,
      type: String
    },
    pos: {
      default: null,
      type: Object
    },
    src: {
      default: null,
      type: String
    }
  },
  data: function(){
    return {
      slot_captured: false,
      svg_path: false,
    }
  },
  computed: {
    styler: function(){
      let style = "cursor: pointer;"

      style += `width: ${this.size}em; height: ${this.size}em;`

      if (this.color != null) {
        style += `fill: ${this.color};`
        style += `border-color: ${this.color};`
      }

      if (this.float != null){
        style += `float: ${this.float};`
      }

      if (this.pos != null){
        style += `position: fixed;`
        if('top' in this.pos){
          this.pos['y'] = this.pos.top
        }
        if('left' in this.pos){
          this.pos['x'] = this.pos.left
        }
        if('x' in this.pos){
          let x = this.pos.x;
          let left_num = parseFloat(x);
          if (!Number.isNaN(left_num)){
            if (x === `${left_num}`){
              style += `left: ${left_num}px;`
            }else{
              style += `left: ${x};`
            }
          }
        }

        if('y' in this.pos){
          let y = this.pos.y;
          let top_num = parseFloat(y);
          if (!Number.isNaN(top_num)){
            if (y === `${top_num}`){
              style += `top: ${top_num}px;`
            }else{
              style += `top: ${y};`
            }
          }
        }
      }
      return style;
    },
    image: function(){
      if (this.src == null){
        return false
      }else{
        return this.src
      }
    }
  },
  mounted(){
      let slot = this.$slots.default[0].text;
      if (slot in ICON_SVGS){
        this.svg_path = ICON_SVGS[slot]
      }else{
        this.src = this.$slots.default[0].text;
      }
      this.slot_captured = true;
  },
  template: `
  <svg v-if = "!image" :style = "styler" class = "icon" viewBox="0 0 500 500" v-html = "svg_path" @click = "$emit('click')">
    <slot ref = 'slot' v-if = "!slot_captured"></slot>
  </svg>
  <img v-else class = "icon" :style = "styler" :src = "image" @click = "$emit('click')"></img>`,
})


Vue.component('biller-form', {
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          displayName: '',
          address: '',
          city: '',
          phoneNumber: '',
          abn: '',
          bsb: '',
          accountNo: '',
          uid: '',
          photoURL: '',
          email: ''
        }
      }
    }
  },
  methods: {
    update: function(){
      if (this.value.displayName.length == 0){
        alert('Please provide your name.');
        return
      }
      let user = firebase.auth().currentUser;
      firebase.database().ref(`invoices/users/${user.uid}`).set(this.value).then((e) => {
        this.$emit('input',this.value);
      }).catch(function(error) {
        alert(error)
        throw error;
      });
    },
  },
  template: `
    <table>
      <tr>
        <th colspan="2">
          <h1>Update User</h1>
        </th>
      </tr>
      <tr>
        <td>
          <h2>Name</h2>
        </td>
        <td>
          <input v-model = "value.displayName"/>
        </td>
      </tr>
      <tr>
        <td>
          <h2>Number</h2>
        </td>
        <td>
          <input v-model = "value.phoneNumber"/>
        </td>
      </tr>
      <tr>
        <td>
          <h2>Address</h2>
        </td>
        <td>
          <input v-model = "value.address"/>
        </td>
      </tr>
      <tr>
        <td>
          <h2>City</h2>
        </td>
        <td>
          <input v-model = "value.City"/>
        </td>
      </tr>
      <tr>
        <td>
          <h2>ABN</h2>
        </td>
        <td>
          <input v-model = "value.abn"/>
        </td>
      </tr>
      <tr>
        <td>
          <h2>BSB</h2>
        </td>
        <td>
          <input v-model = "value.bsb"/>
        </td>
      </tr>
      <tr>
        <td>
          <h2>Account Number</h2>
        </td>
        <td>
          <input v-model = "value.accountNo"/>
        </td>
      </tr>
      <tr>
        <td></td>
        <td>
          <icon size = "1.3" float = "right" @click = "update">confirm</icon>
        </td>
      </tr>
    </table>
  `
})
Vue.component('add-client-form', {
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          displayName: '',
          address: '',
          city: '',
          phoneNumber: '',
          email: ''
        }
      }
    }
  },
  methods: {
    add_client: function(){
      if (this.value.displayName.length == 0){
        alert('Please provide the clients name.');
        return
      }
      if (this.value.email.length == 0){
        alert('Please provide the clients email.')
      }
      let user = firebase.auth().currentUser;
      firebase.database().ref(`invoices/users/${user.uid}/clients/${this.value.displayName}`).set(this.value).then((e) => {
        this.$emit('input', this.value)
      }).catch((err) => {
        alert(err)
        throw err;
      })
    },
  },
  template: `
  <table>
    <tr>
      <th colspan="2">
        <h1>Add a Recipient</h1>
      </th>
    </tr>
    <tr>
      <td>
        <h2>Name</h2>
      </td>
      <td>
        <input v-model = "value.displayName"/>
      </td>
    </tr>
    <tr>
      <td>
        <h2>Number</h2>
      </td>
      <td>
        <input v-model = "value.phoneNumber"/>
      </td>
    </tr>
    <tr>
      <td>
        <h2>Email</h2>
      </td>
      <td>
        <input v-model = "value.email"/>
      </td>
    </tr>
    <tr>
      <td>
        <h2>Address</h2>
      </td>
      <td>
        <input v-model = "value.address"/>
      </td>
    </tr>
    <tr>
      <td>
        <h2>City</h2>
      </td>
      <td>
        <input v-model = "value.City"/>
      </td>
    </tr>
    <tr>
      <td>
        <icon size = "1.3" float = "left" @click = "$emit('return')">return</icon>
      </td>
      <td>
        <icon size = "1.3" float = "right" @click = "add_client">add</icon>
      </td>
    </tr>
  </table>
  `
})
Vue.component('add-recipient', {
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          displayName: '',
          address: '',
          city: '',
          phoneNumber: '',
          email: ''
        }
      }
    }
  },
  data: function() {
    return {
      clients: null,
      add: false,
      client: {
        displayName: '',
        address: '',
        city: '',
        email: '',
        phoneNumber: '',
      }
    }
  },
  template: `
  <table v-if = "!add">
    <tr>
      <th>
        <h1>Choose A Recipient</h1>
      </th>
      <td></td>
      <td>
        <icon size = "1.3" float = "right" @click = "add = true">add</icon>
      </td>
    </tr>
    <tr v-for = "client in clients">
      <td @click = "set_recipient(client)">
        <h2 class = "bubble">{{client.displayName}}</h2>
      </td>
      <td>{{client.email}}</td>
      <td>
        <icon size = "1.3" float = "right" @click = "edit(client)">edit</icon>
        <icon size = "1.3" float = "right" @click = "delete_client(client)">delete</icon>

      </td>
    </tr>
  </table>
  <add-client-form v-else :value = 'client' @input = "set_recipient" @return = "add = false"></add-client-form>
  `,
  methods: {
    set_recipient: function(client){
      this.$emit('input', client)
    },
    edit: function(client){
      this.add = true;
      this.client = client;
    },
    delete_client: function(client){
      let user = firebase.auth().currentUser;
      firebase.database().ref(`invoices/users/${user.uid}/clients/${client.displayName}`).remove();
    }
  },
  created(){
    let user = firebase.auth().currentUser;

    firebase.database().ref(`invoices/users/${user.uid}/clients`).on('value', (e) => {
      this.clients = e.val()
    })
  }
})
Vue.component('add-item-form', {
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          description: '',
          date: '',
          rate: 0,
          qty: 0
        }
      }
    }
  },
  methods: {
    add_item: function(){
      let rate = parseFloat(this.value.rate);
      let qty = parseFloat(this.value.qty);
      if (Number.isNaN(rate)){
        alert('Rate must be a valid number.');
        return
      }else if(Number.isNaN(qty)){
        alert('Quantity must be a valid number.');
        return
      }
      if (this.value.description.length == 0){
        alert('Please provide a description.');
        return
      }
      this.$emit('input', {
        description: this.value.description,
        date: this.value.date,
        rate: rate,
        qty: qty,
      })
    },
  },
  template: `
  <table>
    <tr>
      <th colspan="2">
        <h1>Add an Item</h1>
      </th>
    </tr>
    <tr>
      <td>
        <h2>Description</h2>
      </td>
      <td>
        <input v-model = "value.description"/>
      </td>
    </tr>
    <tr>
      <td>
        <h2>Date</h2>
      </td>
      <td>
        <input v-model = "value.date"/>
      </td>
    </tr>
    <tr>
      <td>
        <h2>Rate</h2>
      </td>
      <td>
        <input v-model = "value.rate"/>
      </td>
    </tr>
    <tr>
      <td>
        <h2>Quantity</h2>
      </td>
      <td>
        <input v-model = "value.qty"/>
      </td>
    </tr>
    <tr>
      <td>

      </td>
      <td>
        <icon size = "1.3" float = "right" @click = "add_item">add</icon>
      </td>
    </tr>
  </table>
  `
})
