/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 10-27-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class InvoiceController {

    @AuraEnabled(cacheable=true)
    public static String createJson(Id opportunityId) {
        Opportunity opp = [
            SELECT AccountId, CloseDate, Invoice_Date__c
            FROM Opportunity 
            WHERE Id = :opportunityId
            LIMIT 1
        ];
        
        List<OpportunityLineItem> lineItems = [
            SELECT Description, Quantity, UnitPrice 
            FROM OpportunityLineItem 
            WHERE OpportunityId = :opportunityId
        ];

        InvoiceWrapper invoice = new InvoiceWrapper();
        invoice.Type = 'ACCREC'; 
        invoice.Contact = new ContactWrapper('0000000');
        invoice.invoiceDate = opp.CloseDate;
        invoice.dueDate = opp.Invoice_Date__c != null ? opp.Invoice_Date__c : opp.CloseDate.addDays(15);

        for (OpportunityLineItem oli : lineItems) {
            LineItemWrapper lineItem = new LineItemWrapper();
            lineItem.Description = oli.Description;
            lineItem.Quantity = oli.Quantity;
            lineItem.UnitAmount = oli.UnitPrice;
            invoice.LineItems.add(lineItem);
        }
        return JSON.serialize(invoice);
    }

    @AuraEnabled
    public static Id createInvoiceAndLineItems(Id opportunityId) {
        Opportunity opp = [
            SELECT AccountId, CloseDate, Invoice_Date__c 
            FROM Opportunity 
            WHERE Id = :opportunityId 
            LIMIT 1
        ];

        Invoice__c invoice = new Invoice__c(
            Account__c = opp.AccountId,
            Invoice_Date__c = opp.CloseDate,
            Invoice_Due_Date__c = opp.Invoice_Date__c != null ? opp.Invoice_Date__c : opp.CloseDate.addDays(15),
            Related_Record_Id__c = opp.Id
        );
        insert invoice;

        List<OpportunityLineItem> lineItems = [
            SELECT Description, Quantity, UnitPrice 
            FROM OpportunityLineItem 
            WHERE OpportunityId = :opportunityId
        ];
        
        List<Line_Item__c> lineItemRecords = new List<Line_Item__c>();

        for (OpportunityLineItem oli : lineItems) {
            Line_Item__c lineItem = new Line_Item__c(
                Invoice__c = invoice.Id,
                Description__c = oli.Description,
                Quantity__c = oli.Quantity,
                Unit_Price__c = oli.UnitPrice
            );
            lineItemRecords.add(lineItem);
        }

        insert lineItemRecords;
        return invoice.Id;
    }

 
    public class InvoiceWrapper {
        public String Type; 
        public ContactWrapper Contact; 
        public Date invoiceDate; 
        public Date dueDate; 
        public List<LineItemWrapper> LineItems = new List<LineItemWrapper>();
    }

    public class ContactWrapper {
        public String ContactID; 
        public ContactWrapper(String contactId) {
            this.ContactID = contactId;
        }
    }

    public class LineItemWrapper {
        public String Description;
        public Decimal Quantity;
        public Decimal UnitAmount;
    }
}