public with sharing class de_Timeline_Controller {

    @AuraEnabled(cacheable=true)
    public static List<Task> getRelatedTimelineActivities(Id relatedToId) {
        return [
            SELECT Id, Subject, Description, ActivityDate, Status
            FROM Task
            WHERE WhoId = :relatedToId OR WhatId = :relatedToId
            ORDER BY ActivityDate DESC
            LIMIT 20
        ];
    }
}