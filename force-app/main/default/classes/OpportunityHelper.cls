/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 10-26-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class OpportunityHelper {
    @AuraEnabled(cacheable=true)
    public static Opportunity getOpportunityDetails(Id opportunityId) {
        return [
            SELECT CloseDate,AccountId,Invoice_Date__c 
            FROM Opportunity
            WHERE Id = :opportunityId
            LIMIT 1
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<OpportunityLineItem> fetchOpportunityProducts(Id opportunityId) {
        return [
            SELECT Description, Quantity, UnitPrice
            FROM OpportunityLineItem
            WHERE OpportunityId = :opportunityId
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Invoice__c getInvoiceData(Id recId) {
        List<Invoice__c> invoices = [
            SELECT Id
            FROM Invoice__c
            WHERE Related_Record_Id__c = :recId
            LIMIT 1
        ];
        return invoices.isEmpty() ? null : invoices[0];
    }

    @AuraEnabled(cacheable=true)
    public static Invoice__c createInvoice(Id opportunityId) {
        // Fetch Opportunity details for default values
        Opportunity opportunity = [
            SELECT CloseDate,AccountId,Invoice_Date__c
            FROM Opportunity
            WHERE Id = :opportunityId
            LIMIT 1
        ];

        List<OpportunityLineItem> oppLineItems = [
            SELECT Description, Quantity, UnitPrice
            FROM OpportunityLineItem
            WHERE OpportunityId = :opportunityId
        ];


        // Create new Invoice with default values from Opportunity
        Invoice__c newInvoice = new Invoice__c(
            Related_Record_Id__c = opportunityId,
            Invoice_Date__c = opportunity.CloseDate,
            Invoice_Due_Date__c = opportunity.Invoice_Date__c, // Example due date 30 days after Close Date
            Account__c = opportunity.AccountId
        );
        insert newInvoice;
        List<Line_Item__c> lineItemsToCreate = new List<Line_Item__c>();
        Line_Item__c lineItemToInsert = new Line_Item__c();
        for(OpportunityLineItem opp: oppLineItems){
            lineItemToInsert.Description__c = opp.Description;
            lineItemToInsert.Unit_Price__c = opp.UnitPrice;
            lineItemToInsert.Quantity__c = opp.Quantity;
            lineItemsToCreate.add(lineItemToInsert);
        }
        insert lineItemsToCreate;
        return newInvoice;
    }
}
