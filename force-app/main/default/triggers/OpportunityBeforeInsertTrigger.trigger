/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 10-27-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
trigger OpportunityBeforeInsertTrigger on Opportunity (before insert) {
    for(Opportunity opp: Trigger.new){
        opp.Child_Relationship_Name__c = 'OpportunityLineItems';
    }
}