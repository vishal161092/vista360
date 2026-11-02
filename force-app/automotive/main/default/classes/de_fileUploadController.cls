public without sharing class de_fileUploadController {

    @AuraEnabled
    public static String uploadFile(String caseId, String fileName, String base64Data) {
        if (String.isBlank(caseId) || String.isBlank(fileName) || String.isBlank(base64Data)) {
            throw new AuraHandledException('Missing required parameters.');
        }

        Id recordId;
        try {
            recordId = Id.valueOf(caseId);
        } catch (Exception e) {
            throw new AuraHandledException('Invalid Case Id.');
        }

        if (recordId.getSObjectType() != Case.SObjectType) {
            throw new AuraHandledException('Record Id must be a Case.');
        }

        try {
            ContentVersion cv = new ContentVersion();
            cv.Title = fileName;
            cv.PathOnClient = fileName;
            cv.VersionData = EncodingUtil.base64Decode(base64Data);
            insert cv;

            Id contentDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :cv.Id LIMIT 1].ContentDocumentId;

            ContentDocumentLink cdl = new ContentDocumentLink();
            cdl.ContentDocumentId = contentDocId;
            cdl.LinkedEntityId = recordId;
            cdl.ShareType = 'V';
            cdl.Visibility = 'AllUsers';
            insert cdl;

            return cv.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Upload failed: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getCaseNumber(String caseId) {
        if (String.isBlank(caseId)) {
            throw new AuraHandledException('Case Id is required.');
        }

        Id recordId;
        try {
            recordId = Id.valueOf(caseId);
        } catch (Exception e) {
            throw new AuraHandledException('Invalid Case Id.');
        }

        if (recordId.getSObjectType() != Case.SObjectType) {
            throw new AuraHandledException('Record Id must be a Case.');
        }

        List<Case> cases = [SELECT CaseNumber FROM Case WHERE Id = :recordId LIMIT 1];
        if (cases.isEmpty()) {
            throw new AuraHandledException('Case not found.');
        }
        return cases[0].CaseNumber;
    }
}
