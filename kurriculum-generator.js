'use strict';
class KurriculumGenerator extends Polymer.Element {
  static get is() { return 'kurriculum-generator'; }
  static get properties() {
    return {
      loading: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      blind: {
        type: Boolean,
        value: false
      },
      cvItem: {
        type: Object,
        value: () => {return {}}
      },
      index: {
        type: Number
      },
      section:{
        type: String,
        value: ''
      },
      user:{
        type: Object
      },
      _computeName: {
        type: String,
        computed: '_generateName(user.name, user.surname, blind)'
      },
      isAdmin: {
        type: Boolean,
        value: true
      },
      _userId: String
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }

  _linkAddButton(e) {
    this.$.modal.open();
    this.set('cvItem', { });
    this.set('index', null);
    this.set('section', e.currentTarget.dataset.field);
  }

  _linkEditButton(e) {
    this.$.modal.open();
    let dataset = e.currentTarget.dataset;
    this.cvItem = Object.assign({}, dataset.index ? this.user[dataset.field][dataset.index] : this.user[dataset.field]);
    this.set('index', dataset.index);
    this.set('section', dataset.field);
  }

  _getLocaleDate(d) {
    var date = new Date(d);
    return date && date.toLocaleDateString(navigator.language, {
      year: 'numeric',
      month: 'numeric'
    });
  }

  deleteItem () {
    this.splice(`user.${this.section}`, this.index, 1);
    this.$.modal.close();
  }

  editItem(e) {
    let obj = (!this.index) ? `user.${this.section}` : `user.${this.section}.${this.index}`;
    this.user[this.section] instanceof Array && !this.index ? this.push(`user.${this.section}`, this.cvItem) : this.set(obj, this.cvItem);
    this.$.modal.close();
  }
  
  getBlindCV() {
    this.blind = !this.blind;
    this.$.blindIcon.setAttribute('icon', (this.blind) ? 'visibility-off' : 'visibility');
  }

  _generateName(name, surname, blind) {
    if(name && surname){
      return (this.blind) ? `${this.user.name.slice(0,1)}. ${this.user.surname.slice(0,1)}.` : `${this.user.name} ${this.user.surname}`;
    }
  }

  _computeFieldPeriod(sect) {
    return ['experience', 'studies'].includes(sect);
  }

  _computeFieldTitle(sect) {
    return sect !== 'aptitudes';
  }

  _computeFieldDescription(sect) {
    return sect !== 'studies';
  }

  _computeFieldPercent(sect) {
    return sect === 'skills';
  }

  print() {
    window.print();
  }
}

window.customElements.define(KurriculumGenerator.is, KurriculumGenerator);