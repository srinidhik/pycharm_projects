# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'AddData'
        db.create_table(u'app_adddata', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('date', self.gf('django.db.models.fields.DateField')()),
            ('task', self.gf('django.db.models.fields.CharField')(max_length=20)),
        ))
        db.send_create_signal(u'app', ['AddData'])


    def backwards(self, orm):
        # Deleting model 'AddData'
        db.delete_table(u'app_adddata')


    models = {
        u'app.adddata': {
            'Meta': {'object_name': 'AddData'},
            'date': ('django.db.models.fields.DateField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'task': ('django.db.models.fields.CharField', [], {'max_length': '20'})
        }
    }

    complete_apps = ['app']