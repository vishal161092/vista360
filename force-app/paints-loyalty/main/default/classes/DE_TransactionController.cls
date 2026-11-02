public without sharing class DE_TransactionController {
    @AuraEnabled(cacheable=true)
    public static List<TransactionJournal> getTransactions(Id memberId) {
        return [
            SELECT Id, Name, JournalDate, ProductId, Product.Name, Quantity, TransactionAmount, Status
            FROM TransactionJournal
            WHERE MemberId = :memberId
              AND ProductId != null
            ORDER BY JournalDate DESC
            LIMIT 5
        ];
    }
}
