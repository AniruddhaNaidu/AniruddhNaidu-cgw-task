import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
export default class InvoiceCreation extends LightningElement {


    urlStateParameters = null;
    origin_record;
    account;
    invoice_date;
    invoice_due_date;
    child_relationship_name;
    lineitems={};
    lineItemEntries = [];

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference){
        if(currentPageReference){
            console.log('currentPage: '+currentPageReference);
            this.urlStateParameters = currentPageReference.state;
            const encodedData = currentPageReference.state.c__lineItems;
            console.log('encodedData'+encodedData);
            if (encodedData) {
                try {
                    this.lineItems = JSON.parse(decodeURIComponent(encodedData));
                    console.log('this.lineItems'+this.lineItems);
                    this.lineItemEntries = Object.entries(this.lineItems).map(([key,value]) => ({
                        key, value
                    }));
                    console.log('Decoded line items:', this.lineItems);
                    console.log('Decoded line items:', this.lineItems);
                } catch (error) {
                    console.error('Error decoding line items:', error);
                }
            }
            this.setParametersBasedOnUrl();
        }
    }
    setParametersBasedOnUrl() {
        this.origin_record = this.urlStateParameters.c__origin_record;
        this.account = this.urlStateParameters.c__account;
        this.invoice_date = this.urlStateParameters.c__invoice_date;
        this.invoice_due_date = this.urlStateParameters.c__invoice_due_date;
        this.child_relationship_name = this.urlStateParameters.c__child_relationship_name;
        console.log(this.params);
    }
}