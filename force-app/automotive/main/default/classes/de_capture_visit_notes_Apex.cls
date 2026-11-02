public with sharing class de_capture_visit_notes_Apex {

    private static final String VISIT_OBJECT = 'Visit';
    private static final String FIELD_NOTES = 'Visit_Notes__c';

    @AuraEnabled
    public static void saveVisitNotes(Id visitId, String notes) {
        if (visitId == null) {
            throw new AuraHandledException('Visit Id is required.');
        }
        if (visitId.getSObjectType().getDescribe().getName() != VISIT_OBJECT) {
            throw new AuraHandledException('Record Id must be a Visit.');
        }
        Schema.SObjectType t = Schema.getGlobalDescribe().get(VISIT_OBJECT);
        if (t == null) {
            throw new AuraHandledException('Visit object is not available in this org.');
        }
        String text = notes == null ? '' : notes;
        if (text.length() > 32768) {
            text = text.substring(0, 32768);
        }
        SObject v = t.newSObject();
        v.put('Id', visitId);
        v.put(FIELD_NOTES, text);
        try {
            update v;
        } catch (DmlException e) {
            throw new AuraHandledException(e.getDmlMessage(0));
        }
    }
}