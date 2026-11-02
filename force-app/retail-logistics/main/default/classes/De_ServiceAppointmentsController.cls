public with sharing class De_ServiceAppointmentsController {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getServiceAppointments(Id recordId) {
        Id contactId = getContactId(recordId);
        if (contactId == null) {
            return new List<Map<String, String>>();
        }

        List<ServiceAppointment> appointments = [
            SELECT AppointmentNumber, Subject, Status, SchedStartTime, SchedEndTime, AppointmentType, DueDate
            FROM ServiceAppointment
            WHERE ContactId = :contactId
              AND Status != 'Completed'
              AND Status != 'Canceled'
            ORDER BY SchedStartTime ASC
            LIMIT 5
        ];

        List<Map<String, String>> results = new List<Map<String, String>>();
        for (ServiceAppointment sa : appointments) {
            Map<String, String> row = new Map<String, String>();
            row.put('key', sa.Id);
            row.put('id', sa.AppointmentNumber);
            row.put('route', sa.Subject != null ? sa.Subject : '—');
            row.put('service', sa.AppointmentType != null ? sa.AppointmentType : 'General');
            row.put('amount', formatDateTime(sa.SchedStartTime));
            row.put('status', sa.Status);
            row.put('statusClass', getStatusClass(sa.Status));
            row.put('dotClass', getDotClass(sa.Status));
            results.add(row);
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

    private static String formatDateTime(Datetime dt) {
        if (dt == null) return '—';
        return dt.format('dd MMM yyyy, h:mm a');
    }

    private static String getStatusClass(String status) {
        if (status == 'Scheduled') return 'de-status de-warn';
        if (status == 'Dispatched' || status == 'In Progress') return 'de-status de-success';
        return 'de-status de-danger';
    }

    private static String getDotClass(String status) {
        if (status == 'Scheduled') return 'de-dot de-dot-warn';
        if (status == 'Dispatched' || status == 'In Progress') return 'de-dot de-dot-success';
        return 'de-dot de-dot-danger';
    }
}
