import { LightningElement, wire, api, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import INVOICE_OBJECT from '@salesforce/schema/Invoice__c';
import fetchOpportunityProducts from '@salesforce/apex/OpportunityHelper.fetchOpportunityProducts';
import getOpportunityDetails from '@salesforce/apex/OpportunityHelper.getOpportunityDetails';
import createInvoice from '@salesforce/apex/OpportunityHelper.createInvoice';
import getInvoiceData from '@salesforce/apex/OpportunityHelper.getInvoiceData';

export default class NavigateToUrlParamTable extends NavigationMixin(LightningElement){
    @api recordId;
    @api objectApiName;
    @track isModalOpen = false;
    @track invoiceId;
    closeDate;
    opportunityProducts=[];
    invoiceObject = INVOICE_OBJECT;
    @track invoiceaccount;
    @track invoiceduedate;
    @track invoicedate;
    recData= {};
    recDataLineItems= {};
    isOpportunity = false;
    lineItemCount = 0;
    showCreateInvoiceButton= true;

    connectedCallback() {
        console.log('recordId: '+this.recordId);
        console.log('objectApiName: '+ this.objectApiName);
        if(this.objectApiName == 'Opportunity'){
            this.fetchOpportunityDetails();
            this.isOpportunity = true;
        }
        this.getInvoice();
    }


    getInvoice(){
        getInvoiceData({ recordId: this.recordId})
        .then(invoice =>{
            this.invoiceId = invoice ? invoice.Id : null;
            this.showCreateInvoiceButton = this.invoiceId!=null ? false: true;
            console.log('this.invoiceId'+this.invoiceId);
    
        }) 
        .catch(error=> {
            console.error('Error fetching invoice:', error);
        });
    }

    fetchOpportunityDetails(){
        getOpportunityDetails({opportunityId: this.recordId})
        .then((record) => {
            this.recData.origin_record= this.recordId;
            this.recData.account= record.AccountId;
            this.invoiceaccount = record.AccountId;
            this.recData.invoice_date= record.CloseDate;
            this.invoicedate = record.CloseDate;
            this.recData.invoice_due_date= record.Invoice_Date__c;
            this.invoiceduedate = record.Invoice_Date__c;
            this.recData.child_relationship_name= 'OpportunityLineItems';
            
        })
        .catch((error) => {
            console.error('Error fetching opportunity data: '+ error);  
        });

        fetchOpportunityProducts({opportunityId: this.recordId})
        .then((data) =>{
            this.opportunityProducts = data;
            console.log('this.opportunityProducts'+JSON.stringify(this.opportunityProducts));
            this.opportunityProducts.forEach((item,index)=>{
                const itemIndex = index +1;
                this.lineItemCount = itemIndex;
                let lid = 'line_item_description_'+itemIndex;
                let liq = 'line_item_quantity_'+itemIndex;
                let lip = 'line_item_unit_price_'+itemIndex;
                this.recDataLineItems[lid]= item.Description;
                this.recDataLineItems[liq]= item.Quantity;
                this.recDataLineItems[lip]= item.UnitPrice;
            })
            console.log('this.recDataLineItems'+JSON.stringify(this.recDataLineItems));
        })
        .catch((error) => {
            console.error('Error fetching Opportunity Products:',error);
        });
        
    }

    handleCreateInvoice(){
        this.isModalOpen = true;
        console.log('inhandlecreateInvoice');
        if(this.isOpportunity == true){
            createInvoice({ opportunityId: this.recordId })
            .then(invoice => {
                console.log('Inside createInvoice'+invoice.Id);
                this.invoiceId = invoice.Id;
            })
            .catch(error => {
                console.error('Error creating invoice:', error);
            });
        }    
    }

    handleCloseModal(){
        this.isModalOpen = false;
    }

    handleSuccess(event){
        this.invoiceId = event.detail.id;
        this.isModalOpen = false;
        this.showCreateInvoiceButton = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title:'Success',
                message:'Invoice created successfully!',
                variant: 'success',
            })
        );
    }


    handleViewInvoice(){
        const {account,invoice_date,invoice_due_date,child_relationship_name} = this.recData;
        console.log(this.recData);
        const encodedLineItems = encodeURIComponent(JSON.stringify(this.recDataLineItems));
        console.log('encodedLineItems:'+encodedLineItems);
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__invoiceCreation'
            },
            state: {
                c__invoiceId: this.invoiceId,
                c__origin_record: this.recordId,
                c__account: account,
                c__invoice_date: invoice_date,
                c__invoice_due_date: invoice_due_date,
                c__child_relationship_name: child_relationship_name,
                c__lineItems: encodedLineItems
                
            }
        });
    }



}