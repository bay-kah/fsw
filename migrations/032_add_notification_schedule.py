"""Peewee migrations -- 032_add_notification_schedule.py.

Add notification_schedule JSONField to User model for storing user-defined notification schedules.

Some examples (model - class or model name)::

    > Model = migrator.orm['model_name']            # Return model in current state by name

    > migrator.sql(sql)                             # Run custom SQL
    > migrator.python(func, *args, **kwargs)        # Run python code
    > migrator.create_model(Model)                  # Create a model (could be used as decorator)
    > migrator.remove_model(model, cascade=True)    # Remove a model
    > migrator.add_fields(model, **fields)          # Add fields to a model
    > migrator.change_fields(model, **fields)       # Change fields
    > migrator.remove_fields(model, *field_names, cascade=True)
    > migrator.rename_field(model, old_field_name, new_field_name)
    > migrator.rename_table(model, new_table_name)
    > migrator.add_index(model, *col_names, unique=False)
    > migrator.drop_index(model, *col_names)
    > migrator.add_not_null(model, *field_names)
    > migrator.drop_not_null(model, *field_names)
    > migrator.add_default(model, field_name, default)

"""

import peewee as pw
from playhouse.sqlite_ext import JSONField

SQL = pw.SQL


def migrate(migrator, database, fake=False, **kwargs):
    # Add notification_schedule JSONField with default empty schedule
    migrator.sql(
        'ALTER TABLE "user" ADD COLUMN "notification_schedule" TEXT DEFAULT \'{"enabled": false, "quiet_hours": {"start": "22:00", "end": "08:00"}, "timezone": "UTC"}\''
    )


def rollback(migrator, database, fake=False, **kwargs):
    migrator.sql('ALTER TABLE "user" DROP COLUMN "notification_schedule"')