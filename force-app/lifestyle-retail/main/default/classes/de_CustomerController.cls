public with sharing class de_CustomerController {
    /**
     * Returns real Contact data used by the de_customerHeader and de_customerDetails
     * components on the Urbanweave 360 record page.
     */
    @AuraEnabled(cacheable=true)
    public static CustomerWrapper getCustomer(Id recordId) {
        if (recordId == null) {
            throw new AuraHandledException('A Contact record Id is required.');
        }

        Contact c = [
            SELECT Id, Name, FirstName, LastName, Email, Phone, MobilePhone,
                   Birthdate, Gender, MailingStreet, MailingCity, MailingState,
                   MailingCountry, MailingPostalCode, CreatedDate,
                   SDO_Cust360_Id__c, SDO_Cust360_Contact_Picture_URL__c,
                   SDO_PA_Preferred_Contact_Channel__c
            FROM Contact
            WHERE Id = :recordId
            WITH USER_MODE
            LIMIT 1
        ];

        CustomerWrapper w = new CustomerWrapper();
        w.recordId = c.Id;
        w.name = c.Name;
        w.email = c.Email;
        w.phone = c.MobilePhone != null ? c.MobilePhone : c.Phone;
        w.gender = c.Gender;
        w.photoUrl = c.SDO_Cust360_Contact_Picture_URL__c;
        w.customerId = String.isNotBlank(c.SDO_Cust360_Id__c)
            ? c.SDO_Cust360_Id__c
            : ('CUS-' + String.valueOf(c.Id).right(6));
        w.preferredContact = c.SDO_PA_Preferred_Contact_Channel__c;

        // Age from Birthdate
        if (c.Birthdate != null) {
            Integer age = c.Birthdate.daysBetween(Date.today()) / 365;
            w.age = age;
        }

        // Location string
        List<String> parts = new List<String>();
        if (String.isNotBlank(c.MailingCity)) {
            parts.add(c.MailingCity);
        }
        if (String.isNotBlank(c.MailingState)) {
            parts.add(c.MailingState);
        }
        w.location = String.join(parts, ', ');

        // Full address components for Location Details
        w.street = c.MailingStreet;
        w.state = c.MailingState;
        w.country = c.MailingCountry;
        w.postalCode = c.MailingPostalCode;
        w.city = c.MailingCity;

        // "Member since" from CreatedDate
        if (c.CreatedDate != null) {
            w.memberSince = c.CreatedDate.format('MMM yyyy');
        }

        return w;
    }

    public class CustomerWrapper {
        @AuraEnabled public Id recordId;
        @AuraEnabled public String name;
        @AuraEnabled public String customerId;
        @AuraEnabled public Integer age;
        @AuraEnabled public String gender;
        @AuraEnabled public String email;
        @AuraEnabled public String phone;
        @AuraEnabled public String location;
        @AuraEnabled public String street;
        @AuraEnabled public String city;
        @AuraEnabled public String state;
        @AuraEnabled public String country;
        @AuraEnabled public String postalCode;
        @AuraEnabled public String photoUrl;
        @AuraEnabled public String preferredContact;
        @AuraEnabled public String memberSince;
    }
}
