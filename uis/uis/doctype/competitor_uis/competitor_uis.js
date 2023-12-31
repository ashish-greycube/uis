// Copyright (c) 2023, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Competitor UIS', {
	setup: function(frm) {
		frm.set_query('competitor_primary_contact', function(doc) {
			return {
				query: "uis.uis.doctype.competitor_uis.competitor_uis.get_competitor_primary_contact",
				filters: {
					'competitor_name': doc.name
				}
			}
		})
		frm.set_query('competitor_primary_address', function(doc) {
			return {
				filters: {
					'link_doctype': 'Competitor UIS',
					'link_name': doc.name
				}
			}
		})
	},	
	refresh: function(frm){
		frappe.dynamic_link = {doc: frm.doc, fieldname: 'name', doctype: 'Competitor UIS'}
		if (frm.is_new()==1) {
			frm.set_df_property('competitor_primary_contact','hidden',1)
			frm.set_df_property('competitor_primary_address','hidden',1)
		}else{
			frm.set_df_property('competitor_primary_contact','hidden',0)
			frm.set_df_property('competitor_primary_address','hidden',0)	
		}
	},
	competitor_primary_address: function(frm){
		if(frm.doc.competitor_primary_address){
			frappe.call({
				method: 'frappe.contacts.doctype.address.address.get_address_display',
				args: {
					"address_dict": frm.doc.competitor_primary_address
				},
				callback: function(r) {
					frm.set_value("primary_address", r.message);
				}
			});
		}
		
	},
	competitor_primary_contact: function(frm){
		if(!frm.doc.competitor_primary_contact){
			frm.set_value("mobile_no", "");
			frm.set_value("email_id", "");
		}
	},	
});
