import { LightningElement, wire, track } from 'lwc';
//import { assets } from 'c/controllers';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class App extends LightningElement {
  @wire(CurrentPageReference) pageRef;
  @track
  state = {
      title: 'Select Asset Type'
  };

  @track
  sponsor;

  get sponsors() {
      var ret = [];

      ret.push({
          label: 'Default: Any',
          value: '0'
      });

      ret.push({
          label: 'Seneca Park Zoo',
          value: '1'
      });
    
      if (ret.sizeOf === 0) {
          return [
              {
                  label: 'Default: Any',
                  value: '0'
              }
          ];
      }
    
      return ret;
  }
  @track
  project;
  get projects() {
      var ret = []; //Set Up Return

      //Push all projects to return
      ret.push({
          label: 'Default: Any',
          value: '0'
      });
      ret.push({
          label: 'Madagascar Lemur Conservation',
          value: '1'
      });
      ret.push({
          label: 'Madagascar Reforesting',
          value: '2'
      });
      ret.push({
          label: 'African Elephant Conservation',
          value: '3'
      });
      if (ret.sizeOf === 0) {
          return [
              {
                  label: 'Default: Any',
                  value: '0'
              }
          ];
      }
      return ret;
  }
  @track
  asset;
  get assets() {
      var ret = [];

      ret.push({
          label: 'Default: Any',
          value: '0'
      });
      ret.push({
          label: 'Ring Tailed Lemur',
          value: '1'
      });
      ret.push({
          label: 'Brown Mouse Lemur',
          value: '2'
      });
      ret.push({
          label: 'Silky Sifaka',
          value: '3'
      });
      ret.push({
          label: 'Tree',
          value: '4'
      });
      ret.push({
          label: 'Elephant',
          value: '5'
      });
      ret.push({
          label: 'Baobab',
          value: '6'
      });
      if (ret.sizeOf === 0) {
          return [
              {
                  label: 'Default: Any',
                  value: ''
              }
          ];
      }
      return ret;
  }
  handleSponsorChange(event) {
      this.sponsor = event.detail.value;
      fireEvent(this.pageRef, 'selectedSponsor', this.sponsor);
  }
  handleProjectChange(event) {
      this.project = event.detail.value;
      fireEvent(this.pageRef, 'selectedProject', this.project);
  }
  handleAssetChange(event) {
      this.asset = event.detail.value;
      fireEvent(this.pageRef, 'selectedAsset', this.asset);
  }
}
