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


    //[select contactid, contact.accountid from user where id = :userid].contact.accountid;
    //[SELECT User.Contact.Account.id FROM User WHERE id =: userid].Contact.Account.id;


    // @AuraEnabled(cacheable=true)
    // public static List<Asset> getAllDonorCodesForDonor(String serialNumber) {
    //     String sn = '%' + serialNumber + '%';
    //     return [
    //         SELECT Name, Price, SerialNumber, CreatedById
    //         FROM Asset
    //         WHERE SerialNumber LIKE :sn
    //     ];
    // }

    // @AuraEnabled
    // public static String getUserId() {
    //     return UserInfo.getUserId();
    // }

    // @AuraEnabled
    // public static String getUserFullName() {
    //     return UserInfo.getFirstName() + ' ' + UserInfo.getLastName();
    // }

    // @AuraEnabled(cacheable=true)
    // public static List<Asset> getUserAssets() {
    //     String userId = getUserId(); 
    //     return [
    //         SELECT Name, Price, SerialNumber, CreatedById
    //         FROM Asset
    //         WHERE CreatedById = :userId
    //     ];
    // }
}
