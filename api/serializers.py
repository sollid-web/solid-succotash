from rest_framework import serializers
from investments.models import InvestmentPlan, UserInvestment
from transactions.models import Transaction
from users.models import UserWallet


class InvestmentPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestmentPlan
        fields = ['id', 'name', 'description', 'daily_roi', 'duration_days', 'min_amount', 'max_amount']


class UserInvestmentSerializer(serializers.ModelSerializer):
    plan = InvestmentPlanSerializer(read_only=True)
    plan_id = serializers.IntegerField(write_only=True)
    total_return = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = UserInvestment
        fields = ['id', 'plan', 'plan_id', 'amount', 'status', 'started_at', 'ends_at', 'created_at', 'total_return']
        read_only_fields = ['status', 'started_at', 'ends_at', 'created_at']
    
    def validate(self, data):
        plan_id = data.get('plan_id')
        amount = data.get('amount')
        
        if plan_id and amount:
            try:
                plan = InvestmentPlan.objects.get(id=plan_id)
                if amount < plan.min_amount:
                    raise serializers.ValidationError(
                        f"Minimum investment for {plan.name} is ${plan.min_amount}"
                    )
                if amount > plan.max_amount:
                    raise serializers.ValidationError(
                        f"Maximum investment for {plan.name} is ${plan.max_amount}"
                    )
            except InvestmentPlan.DoesNotExist:
                raise serializers.ValidationError("Invalid investment plan")
        
        return data


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            'id',
            'tx_type',
            'amount',
            'reference',
            'payment_method',
            'tx_hash',
            'wallet_address_used',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['status', 'created_at', 'updated_at']
        extra_kwargs = {
            'payment_method': {'required': False},
            'tx_hash': {'required': False, 'allow_blank': True},
            'wallet_address_used': {'required': False, 'allow_blank': True},
        }


class UserWalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWallet
        fields = ['balance', 'updated_at']
        read_only_fields = ['balance', 'updated_at']


class AdminTransactionSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    approved_by_email = serializers.EmailField(source='approved_by.email', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'user_email', 'tx_type', 'amount', 'reference', 'status', 'notes', 'approved_by_email', 'created_at', 'updated_at']
        read_only_fields = ['user_email', 'tx_type', 'amount', 'reference', 'approved_by_email', 'created_at', 'updated_at']


class AdminUserInvestmentSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    total_return = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = UserInvestment
        fields = ['id', 'user_email', 'plan_name', 'amount', 'status', 'started_at', 'ends_at', 'created_at', 'total_return']
        read_only_fields = ['user_email', 'plan_name', 'amount', 'created_at', 'total_return']