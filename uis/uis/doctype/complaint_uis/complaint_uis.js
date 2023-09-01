// Copyright (c) 2023, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Complaint UIS', {
	status: function (frm) {
		if (frm.doc.status!='Closed') {
			frm.set_value('complaint_close_date', '');
		}
	},
	setup: function (frm) {
		frm.set_query("complaint_by", function () {
			return {
				"filters": {
					"name": ["in", ["Employee", "Customer", "Supplier"]],
				}
			}
		});
		frm.set_query("department", function () {
			return {
				filters: {
					"is_group": 1
				}
			}
		})
		frm.set_query("division", function (doc, cdt, cdn) {
			return {
				filters: {
					"parent_department": doc.department
				}
			};
		});
	},
	onload: function (frm) {
		if (!frm.doc.complete_date) {
			var today = frappe.datetime.nowdate();
			var completeDate = frappe.datetime.add_days(today, 3);
			frm.set_value('complete_date', completeDate);			
		}
	},
	party: function (frm) {
		if (frm.doc.complaint_by == "Employee") {
			frappe.db.get_value('Employee', frm.doc.party, 'employee_name')
				.then(r => {
					frm.set_value('full_name', r.message.employee_name)
				})
			frappe.db.get_value('Employee', frm.doc.party, 'cell_number')
				.then(r => {
					frm.set_value('phone', r.message.cell_number)
				})
			frappe.db.get_value('Employee', frm.doc.party, 'personal_email')
				.then(r => {
					frm.set_value('email', r.message.personal_email)
				})
		} else if (frm.doc.complaint_by == "Customer") {
			frappe.db.get_value('Customer', frm.doc.party, 'customer_name')
				.then(r => {
					frm.set_value('full_name', r.message.customer_name)
				})
			frappe.call({
				method: 'uis.uis.doctype.complaint_uis.complaint_uis.get_contact_and_email',
				args: {
					"doctype": frm.doc.complaint_by,
					"name": frm.doc.party
				},
				callback: function (r) {
					if (r.message) {
						var contactEmail = r.message.contact_email;
						var contactMobile = r.message.contact_mobile;
						var contactPerson = r.message.contact_person;
						if (contactEmail && contactMobile && contactPerson) {
							frappe.db.get_value('Contact', contactPerson, 'first_name')
								.then(r => {
									frm.set_value('contact_person', r.message.first_name)
								})
							frm.set_value('email', contactEmail);
							frm.set_value('phone', contactMobile);
						} else {
							frappe.msgprint("No contact details found for this Customer.");
						}
					} else {
							frappe.msgprint("No Primary Contact is set for this Customer.");
					}
				}})
		} else if (frm.doc.complaint_by == "Supplier") {

			frappe.db.get_value('Supplier', frm.doc.party, 'supplier_name')
				.then(r => {
					frm.set_value('full_name', r.message.supplier_name)
				})
			frappe.call({
				method: 'uis.uis.doctype.complaint_uis.complaint_uis.get_contact_and_email',
				args: {
					"doctype": frm.doc.complaint_by,
					"name": frm.doc.party
				},
				callback: function (r) {
					if (r.message) {
						var contactEmail = r.message.contact_email;
						var contactMobile = r.message.contact_mobile;
						var contactPerson = r.message.contact_person;
						if (contactEmail && contactMobile && contactPerson) {
							frappe.db.get_value('Contact', contactPerson, 'first_name')
								.then(r => {
									frm.set_value('contact_person', r.message.first_name)
								})
							frm.set_value('email', contactEmail);
							frm.set_value('phone', contactMobile);
						} else {
							frappe.msgprint("No contact details found for this Supplier.");
						}
					} else {
						frappe.msgprint("No Primary Contact is set for this Supplier.");
					}
				}})
		}

	},
	complaint_date: function (frm) {
		var complaintDate = frm.doc.complaint_date;
		if (complaintDate) {
			var completeDate = frappe.datetime.add_days(complaintDate, 3);
			frm.set_value('complete_date', completeDate);
		}
	},
	complaint_others: function (frm) {
		if (frm.doc.complaint_others == 1) {
			frm.set_df_property('complaint_by', 'hidden', 1)
			frm.set_df_property('party', 'hidden', 1)
			frm.set_df_property('full_name', 'hidden', 1)
			frm.set_df_property('contact_person', 'hidden', 1)
			frm.set_df_property('phone', 'hidden', 1)
			frm.set_df_property('email', 'hidden', 1)
			frm.set_df_property('complaint_territory', 'hidden', 1)
		} else {
			frm.set_df_property('complaint_by', 'hidden', 0)
			frm.set_df_property('party', 'hidden', 0)
			frm.set_df_property('full_name', 'hidden', 0)
			frm.set_df_property('contact_person', 'hidden', 0)
			frm.set_df_property('phone', 'hidden', 0)
			frm.set_df_property('email', 'hidden', 0)
			frm.set_df_property('complaint_territory', 'hidden', 0)
		}
	},
	refresh: function (frm) {
		frm.add_custom_button('Create NCR', () => {
			frappe.new_doc("NCR UIS", {
				type: "Complaint",
				complaint_number: frm.doc.name
			});
		})
	}
});