from django.db import migrations


RLS_TABLES = [
    "transactions_transaction",
    "investments_user_investment",
    "users_notification",
    "users_wallet",
    "users_kyc_application",
]


def enable_rls(apps, schema_editor):
    if schema_editor.connection.vendor != "postgresql":
        return

    with schema_editor.connection.cursor() as cursor:
        for table in RLS_TABLES:
            cursor.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;")
            cursor.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY;")

            cursor.execute(
                f"DROP POLICY IF EXISTS user_isolation ON {table};"
            )
            cursor.execute(
                f"""
                CREATE POLICY user_isolation ON {table}
                USING (
                    COALESCE(current_setting('app.is_admin', true), 'false')
                        = 'true'
                    OR user_id = NULLIF(
                        current_setting('app.current_user_id', true),
                        ''
                    )::integer
                )
                WITH CHECK (
                    COALESCE(current_setting('app.is_admin', true), 'false')
                        = 'true'
                    OR user_id = NULLIF(
                        current_setting('app.current_user_id', true),
                        ''
                    )::integer
                );
                """
            )


def disable_rls(apps, schema_editor):
    if schema_editor.connection.vendor != "postgresql":
        return

    with schema_editor.connection.cursor() as cursor:
        for table in RLS_TABLES:
            cursor.execute(f"DROP POLICY IF EXISTS user_isolation ON {table};")
            cursor.execute(f"ALTER TABLE {table} NO FORCE ROW LEVEL SECURITY;")
            cursor.execute(f"ALTER TABLE {table} DISABLE ROW LEVEL SECURITY;")


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0006_platformcertificate"),
    ]

    operations = [
        migrations.RunPython(enable_rls, reverse_code=disable_rls),
    ]
