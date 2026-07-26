from rest_framework import serializers


class CardDetailSerializer(serializers.Serializer):
    last4 = serializers.CharField(max_length=4)
    exp_month = serializers.IntegerField()
    exp_year = serializers.IntegerField()
    is_frozen = serializers.BooleanField()
    status = serializers.CharField()


class CardTransactionSerializer(serializers.Serializer):
    merchant = serializers.CharField()
    amount = serializers.IntegerField()
    currency = serializers.CharField()
    date = serializers.IntegerField()
    type = serializers.CharField()
