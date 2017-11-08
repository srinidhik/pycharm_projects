# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Hotel'
        db.create_table(u'hotel_app_hotel', (
            ('HotelName', self.gf('django.db.models.fields.CharField')(max_length=15, primary_key=True)),
            ('Amount', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'hotel_app', ['Hotel'])

        # Adding model 'Details'
        db.create_table(u'hotel_app_details', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('HotelInfo', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['hotel_app.Hotel'])),
            ('NoOfPersons', self.gf('django.db.models.fields.IntegerField')()),
            ('FromDate', self.gf('django.db.models.fields.DateField')()),
            ('ToDate', self.gf('django.db.models.fields.DateField')()),
            ('NoOfDays', self.gf('django.db.models.fields.IntegerField')()),
            ('TotalAmount', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'hotel_app', ['Details'])


    def backwards(self, orm):
        # Deleting model 'Hotel'
        db.delete_table(u'hotel_app_hotel')

        # Deleting model 'Details'
        db.delete_table(u'hotel_app_details')


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
        }
    }

    complete_apps = ['hotel_app']