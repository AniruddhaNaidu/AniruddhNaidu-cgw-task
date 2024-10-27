import { LightningElement, api} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class ShowURLParams extends NavigationMixin(LightningElement){
    @api recordId;
    @api objectApiName;
    recData= {};
    connectedCallback() {
        console.log('recordId: '+this.recordId);
        console.log('objectApiName: '+ this.objectApiName);
        if(this.objectApiName == 'Opportunity'){
            this.setOpportunityDetails();
        }
    }

    setOpportunityDetails(){
        this.recData.account= 'AccountId';
        this.recData.invoice_date= 'CloseDate';
        this.recData.invoice_due_date= 'Invoice_Date__c';
        this.recData.child_relationship_name= 'Child_Relationship_Name__c'; 
        this.recData.line_item_description = 'Description';
        this.recData.line_item_quantity = 'Quantity';
        this.recData.line_item_unit_price= 'UnitPrice';
    }

    handleURLParams(){
        const {account,invoice_date,invoice_due_date,child_relationship_name,line_item_description,line_item_quantity,line_item_unit_price} = this.recData;
        console.log(this.recData);
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__urlParamTablePage'
            },
            state: {
                c__origin_record: this.recordId,
                c__account: account,
                c__invoice_date: invoice_date,
                c__invoice_due_date: invoice_due_date,
                c__child_relationship_name: child_relationship_name,
                c__line_item_description: line_item_description,
                c__line_item_quantity: line_item_quantity,
                c__line_item_unit_price: line_item_unit_price
            }
        });
    }

}