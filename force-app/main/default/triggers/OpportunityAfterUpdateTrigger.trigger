/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 10-19-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
trigger OpportunityAfterUpdateTrigger on Opportunity (before update) {
    List<Invoice__c> invoicesToInsert = new List<Invoice__c>();
    List<Line_Item__c> lineItemsToInsert = new List<Line_Item__c>();
    List<Opportunity> opportunitiesToUpdate = new List<Opportunity>();

    for(Opportunity opp: Trigger.new){
        if(opp.StageName=='Closed Won'){
            opp.CloseDate = Date.today();
            opp.Invoice_Date__c = Date.today().addDays(30);
            
            System.debug(opp.Line_Item_Quantity__c);

            Schema.DescribeSObjectResult oppDescribe = Schema.SObjectType.Opportunity;
            List<Schema.ChildRelationship> childRelationships = oppDescribe.getChildRelationships();
            for(Schema.ChildRelationship rel: childRelationships){
                if(rel.getChildSObject().getDescribe().getName()=='Invoice__c'){
                    opp.Child_Relationship_Name__c = rel.getRelationshipName();
                    break;
                }
            }

            Invoice__c newInvoice  = new Invoice__c();
            newInvoice.Opportunity__c = opp.Id;
            invoicesToInsert.add(newInvoice);
            opportunitiesToUpdate.add(opp);
            
        }
    }

    
    if(!opportunitiesToUpdate.isEmpty()){
        insert invoicesToInsert;
        for(Invoice__c newInvoice: invoicesToInsert){
            for(Opportunity opp: opportunitiesToUpdate){
                if(newInvoice.Opportunity__c == opp.Id){
                    Line_Item__c newLineItem  = new Line_Item__c();
                    System.debug(newInvoice);
                    newLineItem.Invoice__c = newInvoice.Id;
                    newLineItem.Quantity__c = opp.Line_Item_Quantity__c;
                    newLineItem.Unit_Price__c = opp.Line_Item_Unit_Price__c;
                    lineItemsToInsert.add(newLineItem);
                }
            }
        }
    }

    if(!lineItemsToInsert.isEmpty()){
        insert lineItemsToInsert;
    }
    
}