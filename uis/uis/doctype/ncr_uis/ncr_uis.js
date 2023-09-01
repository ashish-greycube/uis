// Copyright (c) 2023, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('NCR UIS', {
	setup: function (frm) {
		frm.set_query("audit_department", function () {
			return {
				filters: {
					"is_group": 1
				}
			}
		})
		frm.set_query("audit_division", function (doc) {
			return {
				filters: {
					"parent_department": doc.audit_department
				}
			};
		});
	},
	type: function (frm) {
		if (frm.doc.type != 'Complaint') {
			if (frm.doc.complaint_number) {
				frm.set_value('complaint_number', '');
			}
		}
	},
	reported_by: function (frm) {
		if (frm.doc.reported_by == "Employee") {
			if (frappe.session.user != 'Administrator') {
				frm.set_value('employee_name', frappe.session.user);
				var session_user_name = frm.doc.employee_name;
				frappe.db.get_list('Employee', {
					filters: {
						user_id: session_user_name
					},
					fields: ['employee_name'],
					limit: 1
				}).then(function (result) {
					if (result && result.length > 0) {
						frm.set_value('employee_name', result[0].employee_name);
					}
				}).catch(function (err) {
					console.log(err);
				});
			}

		} else {
			frm.set_value('employee_name', '');
		}
	},
});