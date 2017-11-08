# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Login'
        db.create_table(u'hotel_app_login', (
            ('username', self.gf('django.db.models.fields.CharField')(max_length=15, primary_key=True)),
            ('password', self.gf('django.db.models.fields.CharField')(max_length=15)),
        ))
        db.send_create_signal(u'hotel_app', ['Login'])


    def backwards(self, orm):
        # Deleting model 'Login'
        db.delete_table(u'hotel_app_login')


    models = {
        u'hotel_app.details': {
            'FromDate': ('django.db.models.fields.DateField', [], {}),
            'HotelInfo': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['hotel_app.Hotel']"}),
            'Meta': {'object_name': 'Details'},
            'NoOfDays': ('django.db.models.fields.IntegerField', [], {}),
            'NoOfPersons': ('django.db.models.fields.IntegerField', [], {}),
            'ToDate': ('django.db.models.fields.DateField', [], {}),
            'TotalAmount': ('django.db.models.fields.IntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'hotel_app.hotel': {
            'Amount': ('django.db.models.fields.IntegerField', [], {}),
            'HotelName': ('django.db.models.fields.CharField', [], {'max_length': '15', 'primary_key': 'True'}),
            'Meta': {'object_name': 'Hotel'}
        },
        u'hotel_app.login': {
            'Meta': {'object_name': 'Login'},
            'password': ('django.db.models.fields.CharField', [], {'max_length': '15'}),
            'username': ('django.db.models.fields.CharField', [], {'max_length': '15', 'primary_key': 'True'})
        }
    }

    complete_apps = ['hotel_app']