# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'AddData'
        db.create_table(u'dict_app_adddata', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('letter', self.gf('django.db.models.fields.CharField')(max_length=1)),
            ('word', self.gf('django.db.models.fields.CharField')(max_length=15)),
            ('picture', self.gf('django.db.models.fields.CharField')(max_length=50)),
        ))
        db.send_create_signal(u'dict_app', ['AddData'])


    def backwards(self, orm):
        # Deleting model 'AddData'
        db.delete_table(u'dict_app_adddata')


    models = {
        u'dict_app.adddata': {
            'Meta': {'object_name': 'AddData'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'letter': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            'picture': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'word': ('django.db.models.fields.CharField', [], {'max_length': '15'})
        }
    }

    complete_apps = ['dict_app']