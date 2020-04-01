public with sharing class donorCodeController {

    @AuraEnabled(cacheable=true)
    public static List<Asset> getAllDonorCodes() {
        return [
            SELECT Name, Price, SerialNumber
            FROM Asset
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Asset> getAllDonorCodesForDonor(String serialNumber) {
        String sn = '%' + serialNumber + '%';
        return [
            SELECT Name, Price, SerialNumber, CreatedById
            FROM Asset
            WHERE SerialNumber LIKE :sn
        ];
    }

    @AuraEnabled
    public static String getUserId() {
        return UserInfo.getUserId();
    }

    @AuraEnabled
    public static String getUserFullName() {
        return UserInfo.getFirstName() + ' ' + UserInfo.getLastName();
    }

    @AuraEnabled(cacheable=true)
    public static List<Asset> getUserAssets() {
        String userId = getUserId(); 
        return [
            SELECT Name, Price, SerialNumber, CreatedById
            FROM Asset
            WHERE CreatedById = :userId
        ];
    }

    @AuraEnabled
    public static List<Donation__c> getCurrentUsersDonations() {
        String userId = getUserId();
        return [
            SELECT Donor__r.Name, Donation_Code__c, Amount__c, Donor__r.Owner.Name
            FROM Donation__c 
            WHERE Donor__r.Owner.id = :userId
        ];
    }
}

// Donation__c.Donor__c -> Account.id -> Account.OwnerId -> User.id == Current User Id

// Select Donor__r.Name, Donation_Code__c, Amount__c, Donor__r.Owner.Name
// FROM Donation__c
