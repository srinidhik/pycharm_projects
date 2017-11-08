# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'AddData'
        db.create_table(u'calculator_app_adddata', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('input', self.gf('django.db.models.fields.IntegerField')()),
            ('output', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'calculator_app', ['AddData'])


    def backwards(self, orm):
        # Deleting model 'AddData'
        db.delete_table(u'calculator_app_adddata')


    models = {
        u'calculator_app.adddata': {
            'Meta': {'object_name': 'AddData'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'input': ('django.db.models.fields.IntegerField', [], {}),
            'output': ('django.db.models.fields.IntegerField', [], {})
        }
    }

    complete_apps = ['calculator_app']