public with sharing class De_CasesController {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getCases(Id recordId) {
        Id contactId = getContactId(recordId);
        if (contactId == null) {
            return new List<Map<String, Object>>();
        }

        List<Case> cases = [
            SELECT CaseNumber, Subject, Status, Priority, Owner.Name, CreatedDate
            FROM Case
            WHERE ContactId = :contactId
            ORDER BY CreatedDate DESC
            LIMIT 5
        ];

        List<Map<String, Object>> results = new List<Map<String, Object>>();
        for (Case c : cases) {
            Map<String, Object> caseMap = new Map<String, Object>();
            caseMap.put('key', c.Id);
            caseMap.put('id', c.CaseNumber);
            caseMap.put('type', c.Subject != null ? c.Subject : '—');
            caseMap.put('badge', c.Status);
            caseMap.put('badgeClass', getBadgeClass(c.Status));

            List<Map<String, String>> rows = new List<Map<String, String>>();
            rows.add(buildRow('priority', 'Priority', c.Priority, getPriorityClass(c.Priority)));
            rows.add(buildRow('assigned', 'Assigned To', c.Owner.Name, 'de-value'));
            rows.add(buildRow('opened', 'Opened', c.CreatedDate.format('dd MMM yyyy'), 'de-value'));
            caseMap.put('rows', rows);

            results.add(caseMap);
        }
        return results;
    }

    private static Id getContactId(Id recordId) {
        String sObjType = recordId.getSObjectType().getDescribe().getName();
        if (sObjType == 'Contact') {
            return recordId;
        } else if (sObjType == 'Account') {
            List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :recordId LIMIT 1];
            return contacts.isEmpty() ? null : contacts[0].Id;
        }
        return null;
    }

    private static Map<String, String> buildRow(String key, String label, String value, String valueClass) {
        Map<String, String> row = new Map<String, String>();
        row.put('key', key);
        row.put('label', label);
        row.put('value', value != null ? value : '—');
        row.put('valueClass', valueClass);
        return row;
    }

    private static String getBadgeClass(String status) {
        if (status == 'Closed') return 'de-badge de-badge-closed';
        return 'de-badge de-badge-open';
    }

    private static String getPriorityClass(String priority) {
        if (priority == 'High') return 'de-value de-high';
        if (priority == 'Critical') return 'de-value de-high';
        return 'de-value';
    }
}
