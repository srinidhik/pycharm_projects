# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'AddProduct'
        db.create_table(u'product_app_addproduct', (
            ('name', self.gf('django.db.models.fields.CharField')(max_length=15, primary_key=True)),
            ('rate', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'product_app', ['AddProduct'])

        # Adding model 'AddCart'
        db.create_table(u'product_app_addcart', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('product_name', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['product_app.AddProduct'])),
            ('quantity', self.gf('django.db.models.fields.IntegerField')()),
            ('amount', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'product_app', ['AddCart'])


    def backwards(self, orm):
        # Deleting model 'AddProduct'
        db.delete_table(u'product_app_addproduct')

        # Deleting model 'AddCart'
        db.delete_table(u'product_app_addcart')


    models = {
        u'product_app.addcart': {
            'Meta': {'object_name': 'AddCart'},
            'amount': ('django.db.models.fields.IntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'product_name': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['product_app.AddProduct']"}),
            'quantity': ('django.db.models.fields.IntegerField', [], {})
        },
        u'product_app.addproduct': {
            'Meta': {'object_name': 'AddProduct'},
            'name': ('django.db.models.fields.CharField', [], {'max_length': '15', 'primary_key': 'True'}),
            'rate': ('django.db.models.fields.IntegerField', [], {})
        }
    }

    complete_apps = ['product_app']