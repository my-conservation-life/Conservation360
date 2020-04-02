public with sharing class DonorCodeController {
    @AuraEnabled(cacheable=true)
    public static List<Donation__c> getAllDonorCodes() {
        return [
            SELECT Donor__r.Name, Donation_Code__c, Amount__c, Donor__r.Owner.Name
            FROM Donation__c 
        ];
    }

    @AuraEnabled
    public static List<Donation__c> getCurrentUsersDonations() {
        String userId = UserInfo.getUserId();
        if (userId == null) {
            return new List<Donation__c>();
        }

        return [
            SELECT Donor__r.Name, Donation_Code__c, Amount__c, Donor__r.Owner.Name
            FROM Donation__c 
            WHERE Donor__r.Owner.id = :userId
        ];
    }

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
