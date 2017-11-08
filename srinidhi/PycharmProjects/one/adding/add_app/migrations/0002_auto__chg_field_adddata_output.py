# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'AddData.output'
        db.alter_column(u'add_app_adddata', 'output', self.gf('django.db.models.fields.CharField')(max_length=10))

    def backwards(self, orm):

        # Changing field 'AddData.output'
        db.alter_column(u'add_app_adddata', 'output', self.gf('django.db.models.fields.CharField')(max_length=3))

    models = {
        u'add_app.adddata': {
            'Meta': {'object_name': 'AddData'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'input1': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'input2': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'input3': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'output': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        }
    }

    complete_apps = ['add_app']