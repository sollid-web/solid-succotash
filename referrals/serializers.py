from rest_framework import serializers
from .models import ReferralCode, Referral, ReferralReward


class ReferralCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralCode
        fields = ('code', 'active', 'created_at')


class ReferralSerializer(serializers.ModelSerializer):
    referrer_email = serializers.CharField(source='referrer.email', read_only=True)
    referred_email = serializers.CharField(source='referred_user.email', read_only=True)
    
    class Meta:
        model = Referral
        fields = ('id', 'referrer', 'referrer_email', 'referred_user', 'referred_email', 
                  'code', 'status', 'created_at', 'reward_processed')


class ReferralRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralReward
        fields = '__all__'
