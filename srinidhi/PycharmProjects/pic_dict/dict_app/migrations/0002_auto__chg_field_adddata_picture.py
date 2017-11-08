# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'AddData.picture'
        db.alter_column(u'dict_app_adddata', 'picture', self.gf('django.db.models.fields.files.FileField')(max_length=100))

    def backwards(self, orm):

        # Changing field 'AddData.picture'
        db.alter_column(u'dict_app_adddata', 'picture', self.gf('django.db.models.fields.CharField')(max_length=50))

    models = {
        u'dict_app.adddata': {
            'Meta': {'object_name': 'AddData'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'letter': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            'picture': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'word': ('django.db.models.fields.CharField', [], {'max_length': '15'})
        }
    }

    complete_apps = ['dict_app']