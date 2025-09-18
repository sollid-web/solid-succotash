from django.contrib import admin
from django.contrib import messages
from django.db import transaction
from .models import Transaction, AdminAuditLog
from .services import approve_transaction, reject_transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'tx_type', 'amount', 'status', 'approved_by', 'created_at')
    list_filter = ('tx_type', 'status', 'created_at', 'approved_by')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'reference', 'id')
    readonly_fields = ('id', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'
    actions = ['approve_transactions', 'reject_transactions']
    fieldsets = (
        (None, {
            'fields': ('id', 'user', 'tx_type', 'amount', 'reference', 'status')
        }),
        ('Admin Info', {
            'fields': ('notes', 'approved_by', 'created_at', 'updated_at')
        }),
    )
    
    def approve_transactions(self, request, queryset):
        """Approve selected transactions"""
        approved_count = 0
        failed_count = 0
        
        for txn in queryset.filter(status='pending'):
            try:
                approve_transaction(txn, request.user, "Approved via admin bulk action")
                approved_count += 1
            except Exception as e:
                failed_count += 1
                self.message_user(
                    request,
                    f"Failed to approve transaction {txn.id}: {str(e)}",
                    level=messages.ERROR
                )
        
        if approved_count:
            self.message_user(
                request,
                f"Successfully approved {approved_count} transaction(s).",
                level=messages.SUCCESS
            )
        
        if failed_count:
            self.message_user(
                request,
                f"Failed to approve {failed_count} transaction(s).",
                level=messages.WARNING
            )
    
    approve_transactions.short_description = "Approve selected transactions"
    
    def reject_transactions(self, request, queryset):
        """Reject selected transactions"""
        rejected_count = 0
        
        for txn in queryset.filter(status='pending'):
            try:
                reject_transaction(txn, request.user, "Rejected via admin bulk action")
                rejected_count += 1
            except Exception as e:
                self.message_user(
                    request,
                    f"Failed to reject transaction {txn.id}: {str(e)}",
                    level=messages.ERROR
                )
        
        if rejected_count:
            self.message_user(
                request,
                f"Successfully rejected {rejected_count} transaction(s).",
                level=messages.SUCCESS
            )
    
    reject_transactions.short_description = "Reject selected transactions"


@admin.register(AdminAuditLog)
class AdminAuditLogAdmin(admin.ModelAdmin):
    list_display = ('admin', 'entity', 'entity_id', 'action', 'created_at')
    list_filter = ('entity', 'action', 'created_at', 'admin')
    search_fields = ('admin__email', 'entity_id', 'notes')
    readonly_fields = ('id', 'admin', 'entity', 'entity_id', 'action', 'notes', 'created_at')
    date_hierarchy = 'created_at'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False
