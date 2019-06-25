import { LightningElement, wire, track } from 'lwc';
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
      return [
          {
              label: 'Default: Any',
              value: ''
          },
          {
              label: 'Seneca Park Zoo',
              value: '1'
          }
      ];
  }
  @track
  project;
  get projects() {
      return [
          {
              label: 'Default: Any',
              value: ''
          },
          {
              label: 'Madagascar Reforesting Project',
              value: '1'
          },
          {
              label: 'ID=2',
              value: '2'
          }
      ];
  }
  @track
  asset;
  get assets() {
      return [
          {
              label: 'Default: Any',
              value: ''
          },
          {
              label: 'Tree',
              value: '1'
          },
          {
              label: 'ID=2',
              value: '2'
          }
      ];
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
