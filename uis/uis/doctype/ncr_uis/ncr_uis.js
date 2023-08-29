// Copyright (c) 2023, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('NCR UIS', {
	onload: function(frm) {

        // frm.set_value('employee_name', frappe.session.user);
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


			// frappe.db.get_value('Employee', frm.doc.employee_name, 'employee_name')
			// 	.then(r => {
			// 	frm.set_value('employee_full_name',r.message.employee_name)
			// 	})

		}
		else if (frm.doc.reported_by=="Other"){
			frm.set_df_property('other_reported','hidden',0)
			frm.set_df_property('employee_name','hidden',1)
		}
	},
	

	// },
	// reported_by: function(frm){

	// 	if(frm.doc.reported_by=="Employee"){
	// 		frm.set_df_property('employee_name','hidden',0)
	// 		frm.set_df_property('reportedby_name','hidden',1)
			
	// 	}
	// 	else{
	// 		frm.set_df_property('reported_by','hidden',0)
	// 		frm.set_df_property('reportedby_name','hidden',0)
	// 	}
	// }
});
