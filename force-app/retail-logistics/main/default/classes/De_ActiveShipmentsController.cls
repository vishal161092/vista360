public with sharing class De_ActiveShipmentsController {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getActiveOrders(Id recordId) {
        Id accountId = getAccountId(recordId);
        if (accountId == null) {
            return new List<Map<String, String>>();
        }

        List<Order> orders = [
            SELECT OrderNumber, Status, TotalAmount, Type, ShippingCity, ShippingState, EffectiveDate
            FROM Order
            WHERE AccountId = :accountId
              AND Status != 'Closed'
            ORDER BY EffectiveDate DESC
            LIMIT 5
        ];

        List<Map<String, String>> results = new List<Map<String, String>>();
        for (Order o : orders) {
            Map<String, String> row = new Map<String, String>();
            row.put('key', o.Id);
            row.put('id', o.OrderNumber);
            row.put('route', buildRoute(o));
            row.put('service', o.Type != null ? o.Type : 'Standard');
            row.put('amount', formatCurrency(o.TotalAmount));
            row.put('status', o.Status);
            row.put('statusClass', getStatusClass(o.Status));
            row.put('dotClass', getDotClass(o.Status));
            results.add(row);
        }
        return results;
    }

    private static Id getAccountId(Id recordId) {
        String sObjType = recordId.getSObjectType().getDescribe().getName();
        if (sObjType == 'Account') {
            return recordId;
        } else if (sObjType == 'Contact') {
            List<Contact> contacts = [SELECT AccountId FROM Contact WHERE Id = :recordId LIMIT 1];
            return contacts.isEmpty() ? null : contacts[0].AccountId;
        }
        return null;
    }

    private static String buildRoute(Order o) {
        String city = o.ShippingCity != null ? o.ShippingCity : '';
        String state = o.ShippingState != null ? o.ShippingState : '';
        if (String.isNotBlank(city) && String.isNotBlank(state)) {
            return city + ', ' + state;
        } else if (String.isNotBlank(city)) {
            return city;
        } else if (String.isNotBlank(state)) {
            return state;
        }
        return '—';
    }

    private static String formatCurrency(Decimal amount) {
        if (amount == null) return '—';
        return '₹ ' + amount.setScale(0).format();
    }

    private static String getStatusClass(String status) {
        if (status == 'Draft') return 'de-status de-warn';
        if (status == 'Activated') return 'de-status de-success';
        return 'de-status de-danger';
    }

    private static String getDotClass(String status) {
        if (status == 'Draft') return 'de-dot de-dot-warn';
        if (status == 'Activated') return 'de-dot de-dot-success';
        return 'de-dot de-dot-danger';
    }
}
