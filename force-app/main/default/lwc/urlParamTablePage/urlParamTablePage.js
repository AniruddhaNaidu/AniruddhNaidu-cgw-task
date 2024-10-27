import { LightningElement, wire,track } from 'lwc';
import { CurrentPageReference,NavigationMixin } from 'lightning/navigation';
import createJson from '@salesforce/apex/InvoiceController.createJson';
export default class UrlParamTablePage extends NavigationMixin(LightningElement) {

    urlStateParameters = null;
    origin_record;
    account;
    invoice_date;
    invoice_due_date;
    child_relationship_name;
    line_item_description;
    line_item_quantity;
    line_item_unit_price;
    @track jsonResult;

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference){
        if(currentPageReference){
            console.log('currentPage: '+currentPageReference);
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
        console.log(this.urlStateParameters);
    }
    handleShowJson(){
        createJson({ opportunityId: this.origin_record})
        .then(result => {
            this.jsonResult = result;
            console.log('this.jsonResult: '+JSON.stringify(this.jsonResult));
            this[NavigationMixin.Navigate]({
                type: 'standard__component',
                attributes: {
                    componentName: 'c__jsonPage'
                },
                state: {
                    c__data: encodeURIComponent(result),
                    c__opportunityId: this.origin_record
                }
            });
        })
        .catch(error => {
            console.error(error);
        });
    }
}