import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import createInvoiceAndLineItems from '@salesforce/apex/InvoiceController.createInvoiceAndLineItems';

export default class JsonPage extends NavigationMixin(LightningElement) {
    @track jsonData;
    @track opportunityId;

    @wire(CurrentPageReference)
    getStateParameters;

    connectedCallback() {
        if (this.getStateParameters?.state?.c__data) {
            const jsonString = decodeURIComponent(this.getStateParameters.state.c__data);
            this.opportunityId = this.getStateParameters.state.c__opportunityId;
            this.jsonData = JSON.stringify(JSON.parse(jsonString), null, 4);
            console.log('formatted jsonData'+ this.jsonData);
        }
    }

    handleCreateInvoice() {
       
        createInvoiceAndLineItems({ opportunityId: this.opportunityId })
            .then(invoiceId => {
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: invoiceId,
                        objectApiName: 'Invoice__c',
                        actionName: 'view'
                    }
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
}