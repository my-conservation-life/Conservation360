/**
 * The DonorCodeController queries Salesforce for Donations
 */
public with sharing class DonorCodeController {
    
    @AuraEnabled(cacheable=true)
    public static List<Donation__c> getAllDonorCodes() {
        return [
            SELECT Donor__r.Name, Donation_Code__c, Amount__c
            FROM Donation__c 
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Donation__c> getCurrentUsersDonations() {
        String userId = UserInfo.getUserId();
        if (userId == null) {
            return new List<Donation__c>();
        }

        Id accountId = [SELECT User.Contact.Account.id FROM User WHERE id =: userid].Contact.Account.id;
        return [
            SELECT Donor__r.Name, Donation_Code__c, Amount__c
            FROM Donation__c 
            WHERE Donor__r.id = :accountId
        ];
    }
}
