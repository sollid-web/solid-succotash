from django.contrib import admin
from django.contrib import messages
from django.db import transaction
from .models import Transaction, AdminAuditLog
# from .services import approve_transaction, reject_transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'tx_type', 'amount', 'status', 'approved_by', 'created_at')
    list_filter = ('tx_type', 'status', 'created_at', 'approved_by')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'reference', 'id')
    readonly_fields = ('id', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'
    # actions = ['approve_transactions', 'reject_transactions']
    fieldsets = (
        (None, {
            'fields': ('id', 'user', 'tx_type', 'amount', 'reference', 'status')
        }),
        ('Admin Info', {
            'fields': ('notes', 'approved_by', 'created_at', 'updated_at')
        }),
    )


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
