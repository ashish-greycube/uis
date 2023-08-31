// Copyright (c) 2023, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('NCR UIS', {
	onload: function(frm) {

		frm.set_df_property('other_reported','hidden',1)
		frm.set_df_property('employee_name','hidden',1)

    },
	reported_by:function(frm){
		if(frm.doc.reported_by=="Employee"){
			frm.set_df_property('other_reported','hidden',1)
			frm.set_df_property('employee_name','hidden',0)

			frm.set_value('employee_name', frappe.session.user);
			var session_user_name = frm.doc.employee_name;


			frappe.db.get_list('Employee', {
				filters: {
					user_id: session_user_name
				},
				fields: ['employee_name'],
				limit: 1
			}).then(function(result) {
				if (result && result.length > 0) {
					frm.set_value('employee_name', result[0].employee_name);
				}
			}).catch(function(err) {
				console.log(err);
			});
		}
		else if (frm.doc.reported_by=="Other"){
			frm.set_df_property('other_reported','hidden',0)
			frm.set_df_property('employee_name','hidden',1)
		}
	},


	refresh:function(frm){
		if(frm.doc.type==="Complaint" && frm.doc.complaint_number!=""){
			frm.set_df_property('type','read_only',1)
			frm.set_df_property('complaint_number','read_only',1)
		}
	}
});
