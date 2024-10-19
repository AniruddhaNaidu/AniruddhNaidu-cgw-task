import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { CurrentPageReference } from 'lightning/navigation';
import AccountId from '@salesforce/schema/Opportunity.AccountId';
import CloseDate from '@salesforce/schema/Opportunity.CloseDate';
import Invoice_Date__c from '@salesforce/schema/Opportunity.Invoice_Date__c';
import Child_Relationship_Name__c from '@salesforce/schema/Opportunity.Child_Relationship_Name__c';
import Line_Item_Description__c from '@salesforce/schema/Opportunity.Line_Item_Description__c';
import Line_Item_Quantity__c from '@salesforce/schema/Opportunity.Line_Item_Quantity__c';
import Line_Item_Unit_Price__c from '@salesforce/schema/Opportunity.Line_Item_Unit_Price__c';
import StageName from '@salesforce/schema/Opportunity.StageName';

const FIELDS = [AccountId,CloseDate,Invoice_Date__c,Child_Relationship_Name__c,Line_Item_Description__c,Line_Item_Quantity__c,Line_Item_Unit_Price__c,StageName];

export default class NavigateToUrlParamTable extends NavigationMixin(LightningElement){
    oppId;
    oppData={};


    @wire(CurrentPageReference)
    getStateParameters(currentPageReference){
        if(currentPageReference){
            this.oppId = currentPageReference.state.recordId;
            console.log("oppId:"+this.oppId);
        }
    }

    @wire(getRecord, {recordId: '$oppId', fields: FIELDS})
    oppRecord({data,error}){
        if(data){
            this.oppData = {
                origin_record: this.oppId,
                account: data.fields.AccountId.value,
                invoice_date: data.fields.CloseDate.value,
                invoice_due_date: data.fields.Invoice_Date__c.value,
                child_relationship_name: data.fields.Child_Relationship_Name__c.value,
                line_item_description: data.fields.Line_Item_Description__c.value,
                line_item_quantity: data.fields.Line_Item_Quantity__c.value,
                line_item_unit_price: data.fields.Line_Item_Unit_Price__c.value,
                stageName: data.fields.StageName.value
            };
        }
        else if(error){
            console.error('Error fetching opportunity data: '+ error);
        }
    }

    navigateToUrl(){
        const {account,invoice_date,invoice_due_date,child_relationship_name,line_item_description,line_item_quantity,line_item_unit_price} = this.oppData;
        console.log(this.oppData);
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__invoiceCreation'
            },
            state: {
                c__origin_record: this.oppId,
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