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
          value: ''
      });

      ret.push({
          label: 'Seneca Park Zoo',
          value: '1'
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
  @track
  project;
  get projects() {
      var ret = []; //Set Up Return

      //Push all projects to return
      ret.push({
          label: 'Default: Any',
          value: ''
      });
      ret.push({
          label: 'Madagascar Reforesting Project',
          value: '1'
      });
      ret.push({
          label: 'ID = 2 [Sample]',
          value: '2'
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
  @track
  asset;
  get assets() {
      var ret = [];

      ret.push({
          label: 'Default: Any',
          value: ''
      });
      ret.push({
          label: 'Tree',
          value: '1'
      });
      ret.push({
          label: 'ID = 2 [Sample]',
          value: '2'
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
