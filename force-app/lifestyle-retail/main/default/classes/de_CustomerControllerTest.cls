@isTest
private class de_CustomerControllerTest {
    @isTest
    static void testGetCustomer() {
        Contact c = new Contact(
            FirstName = 'Neha',
            LastName = 'Singh',
            Email = 'neha.singh@example.com',
            MobilePhone = '555-0100',
            Gender = 'Female',
            Birthdate = Date.today().addYears(-31),
            MailingCity = 'Mumbai',
            MailingState = 'Maharashtra'
        );
        insert c;

        Test.startTest();
        de_CustomerController.CustomerWrapper w = de_CustomerController.getCustomer(c.Id);
        Test.stopTest();

        System.assertEquals('Neha Singh', w.name, 'Name should match');
        System.assertEquals('Female', w.gender, 'Gender should match');
        System.assertEquals(31, w.age, 'Age should be derived from birthdate');
        System.assertEquals('Mumbai, Maharashtra', w.location, 'Location should combine city and state');
        System.assertEquals('555-0100', w.phone, 'Phone should prefer mobile');
        System.assertNotEquals(null, w.customerId, 'Customer Id should be populated');
        System.assertNotEquals(null, w.memberSince, 'Member since should be populated');
    }

    @isTest
    static void testGetCustomerNullId() {
        Boolean threw = false;
        try {
            de_CustomerController.getCustomer(null);
        } catch (AuraHandledException e) {
            threw = true;
        }
        System.assert(threw, 'Should throw when recordId is null');
    }
}
