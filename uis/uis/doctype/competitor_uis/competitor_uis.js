// Copyright (c) 2023, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Competitor UIS', {
	refresh: function(frm){
		frappe.dynamic_link = {doc: frm.doc, fieldname: 'name', doctype: 'Competitor UIS'}
	},
	customer_primary_address: function(frm){
		if(frm.doc.customer_primary_address){
			frappe.call({
				method: 'frappe.contacts.doctype.address.address.get_address_display',
				args: {
					"address_dict": frm.doc.customer_primary_address
				},
				callback: function(r) {
					frm.set_value("primary_address", r.message);
				}
			});
		}
		// if(!frm.doc.customer_primary_address){
		// 	frm.set_value("primary_address", "");
		// }
	},
	setup: function(frm) {
		frm.set_query('customer_primary_contact', function(doc) {
			return {
				query: "uis.uis.doctype.competitor_uis.competitor_uis.get_customer_primary_contact",
				filters: {
					'customer': doc.name
				}
			}
		})

		frm.set_query('customer_primary_address', function(doc) {
			return {
				filters: {
					'link_doctype': 'Competitor UIS',
					'link_name': doc.name
				}
			}
		})
	}
});
