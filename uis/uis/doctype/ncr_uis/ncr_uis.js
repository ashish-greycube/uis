// Copyright (c) 2023, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('NCR UIS', {
	onload: function(frm) {
        frm.set_value('reported_by', frappe.session.user);
		frm.set_value('reportedby_name', frappe.session.user);

    },
	reported_by:function(frm){
		var reported_by = frm.doc.reported_by;
		frm.set_value('reportedby_name', reported_by);

	},
	reported_by_other: function(frm){
		if(frm.doc.reported_by_other==1){
			frm.set_df_property('reported_by','hidden',1)
			frm.set_df_property('reportedby_name','hidden',1)
			
		}
		else{
			frm.set_df_property('reported_by','hidden',0)
			frm.set_df_property('reportedby_name','hidden',0)
		}
	}
});
