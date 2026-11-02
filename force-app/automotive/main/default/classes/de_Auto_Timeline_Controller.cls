public with sharing class de_Auto_Timeline_Controller {
    /**
     * Returns the tasks related to a record (as What or Who), newest first.
     */
    @AuraEnabled(cacheable=true)
    public static List<Task> getRelatedTimelineWTE(Id relatedToId) {
        if (relatedToId == null) {
            return new List<Task>();
        }
        return [
            SELECT Id, Subject, Status, ActivityDate, Description, CallDisposition, WhatId, WhoId, CreatedDate
            FROM Task
            WHERE WhatId = :relatedToId OR WhoId = :relatedToId
            ORDER BY ActivityDate DESC NULLS LAST, CreatedDate DESC
            LIMIT 200
        ];
    }
}
