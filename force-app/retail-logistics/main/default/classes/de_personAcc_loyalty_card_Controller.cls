public with sharing class de_personAcc_loyalty_card_Controller {
    @AuraEnabled
    public static Map<String, Object> getLoyaltyData(String recordId) {
        Map<String, Object> result = new Map<String, Object>();

        Account acc = [
            SELECT Id, Name, PersonContactId,
                   Loyalty_Tier__c, Loyalty_Points__c, Points_Expiry__c,
                   Lifetime_Value__c, Diamond_Affinity__c, Customer_Since__c
            FROM Account
            WHERE Id = :recordId
            LIMIT 1
        ];
        result.put('account', acc);

        List<VISTA_Scheme__c> schemes = [
            SELECT Id, Name, Status__c, Corpus__c,
                   Bonus__c, Maturity_Date__c, Months_Complete__c, Scheme_Type__c
            FROM VISTA_Scheme__c
            WHERE Contact__c = :acc.PersonContactId
            AND Status__c = 'Active'
            ORDER BY CreatedDate DESC
            LIMIT 1
        ];
        if (!schemes.isEmpty()) {
            result.put('scheme', schemes[0]);
        }

        return result;
    }
}