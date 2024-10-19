import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
export default class InvoiceCreation extends LightningElement {


    urlStateParameters = null;
    origin_record;
    account;
    invoice_date;
    invoice_due_date;
    child_relationship_name;
    line_item_description;
    line_item_quantity;
    line_item_unit_price; 

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference){
        if(currentPageReference){
            console.log('curr: '+currentPageReference);
            this.urlStateParameters = currentPageReference.state;
            this.setParametersBasedOnUrl();
        }
    }
    setParametersBasedOnUrl() {
        this.origin_record = this.urlStateParameters.c__origin_record;
        this.account = this.urlStateParameters.c__account;
        this.invoice_date = this.urlStateParameters.c__invoice_date;
        this.invoice_due_date = this.urlStateParameters.c__invoice_due_date;
        this.child_relationship_name = this.urlStateParameters.c__child_relationship_name;
        this.line_item_description = this.urlStateParameters.c__line_item_description;
        this.line_item_quantity = this.urlStateParameters.c__line_item_quantity;
        this.line_item_unit_price = this.urlStateParameters.c__line_item_unit_price;
        console.log(this.params);
    }
}