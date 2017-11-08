# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'AddData.status'
        db.add_column(u'app_adddata', 'status',
                      self.gf('django.db.models.fields.CharField')(default='Incomplete', max_length=15),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'AddData.status'
        db.delete_column(u'app_adddata', 'status')


    models = {
        u'app.adddata': {
            'Meta': {'object_name': 'AddData'},
            'date': ('django.db.models.fields.DateField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'Incomplete'", 'max_length': '15'}),
            'task': ('django.db.models.fields.CharField', [], {'max_length': '20'})
        }
    }

    complete_apps = ['app']