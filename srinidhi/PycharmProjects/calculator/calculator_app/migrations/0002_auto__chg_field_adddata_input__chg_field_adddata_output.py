# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'AddData.input'
        db.alter_column(u'calculator_app_adddata', 'input', self.gf('django.db.models.fields.CharField')(max_length=50))

        # Changing field 'AddData.output'
        db.alter_column(u'calculator_app_adddata', 'output', self.gf('django.db.models.fields.CharField')(max_length=50))

    def backwards(self, orm):

        # Changing field 'AddData.input'
        db.alter_column(u'calculator_app_adddata', 'input', self.gf('django.db.models.fields.IntegerField')())

        # Changing field 'AddData.output'
        db.alter_column(u'calculator_app_adddata', 'output', self.gf('django.db.models.fields.IntegerField')())

    models = {
        u'calculator_app.adddata': {
            'Meta': {'object_name': 'AddData'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'input': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'output': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        }
    }

    complete_apps = ['calculator_app']