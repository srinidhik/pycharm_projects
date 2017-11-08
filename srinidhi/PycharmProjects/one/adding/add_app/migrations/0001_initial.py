# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'AddData'
        db.create_table(u'add_app_adddata', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('input1', self.gf('django.db.models.fields.CharField')(max_length=3)),
            ('input2', self.gf('django.db.models.fields.CharField')(max_length=3)),
            ('input3', self.gf('django.db.models.fields.CharField')(max_length=3)),
            ('output', self.gf('django.db.models.fields.CharField')(max_length=3)),
        ))
        db.send_create_signal(u'add_app', ['AddData'])


    def backwards(self, orm):
        # Deleting model 'AddData'
        db.delete_table(u'add_app_adddata')


    models = {
        u'add_app.adddata': {
            'Meta': {'object_name': 'AddData'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'input1': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'input2': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'input3': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'output': ('django.db.models.fields.CharField', [], {'max_length': '3'})
        }
    }

    complete_apps = ['add_app']