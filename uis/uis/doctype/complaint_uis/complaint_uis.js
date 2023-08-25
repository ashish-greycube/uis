// Copyright (c) 2023, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Complaint UIS', {
	setup: function(frm) {

		frm.set_query("complaint_by", function() {
			return{
				"filters": {
					"name": ["in", ["Employee", "Customer", "Supplier"]],
				}
			}
		});
	},
	onload: function(frm) {
        
        var today = frappe.datetime.nowdate();
        var completeDate = frappe.datetime.add_days(today, 3);

       
        frm.set_value('complete_date', completeDate);
    },
	party: function(frm) {
		
        if (frm.doc.complaint_by == "Employee") {
			
				frappe.db.get_value('Employee', frm.doc.party, 'employee_name')
    			.then(r => {
        		console.log(r.message.employee_name)
				frm.set_value('full_name',r.message.employee_name)
				})

				frappe.db.get_value('Employee', frm.doc.party, 'person_to_be_contacted')
    			.then(r => {
        		console.log(r.message.person_to_be_contacted)
				frm.set_value('contact_person',r.message.person_to_be_contacted)
				
    			})

				frappe.db.get_value('Employee', frm.doc.party, 'cell_number')
    			.then(r => {
        		console.log(r.message.cell_number)
				frm.set_value('phone',r.message.cell_number)
				
    			})

				frappe.db.get_value('Employee', frm.doc.party, 'personal_email')
    			.then(r => {
        		console.log(r.message.personal_email)
				frm.set_value('email',r.message.personal_email)
				
    			})	
        }
		else if (frm.doc.complaint_by == "Customer") {

				frappe.db.get_value('Customer', frm.doc.party, 'customer_name')
				.then(r => {
				console.log(r.message.customer_name)
				frm.set_value('full_name',r.message.customer_name)
				})

				frappe.db.get_value('Customer', frm.doc.party, 'mobile_no')
				.then(r => {
				console.log(r.message.mobile_no)
				frm.set_value('phone',r.message.mobile_no)
				})

				frappe.db.get_value('Customer', frm.doc.party, 'email_id')
				.then(r => {
				console.log(r.message.email_id)
				frm.set_value('email',r.message.email_id)
				})
        }
		else if (frm.doc.complaint_by == "Supplier") {

				frappe.db.get_value('Supplier', frm.doc.party, 'supplier_name')
				.then(r => {
				console.log(r.message.supplier_name)
				frm.set_value('full_name',r.message.supplier_name)
				})

				frappe.db.get_value('Supplier', frm.doc.party, 'supplimobile_noer_name')
				.then(r => {
				console.log(r.message.mobile_no)
				frm.set_value('phone',r.message.mobile_no)
				})

				frappe.db.get_value('Supplier', frm.doc.party, 'email_id')
				.then(r => {
				console.log(r.message.email_id)
				frm.set_value('email',r.message.email_id)
				})
        }
    },

	complaint_date: function(frm) {
        // Get the selected complaint_date value
        var complaintDate = frm.doc.complaint_date;

        if (complaintDate) {
            
            var completeDate = frappe.datetime.add_days(complaintDate, 3);

            frm.set_value('complete_date', completeDate);
        }
    },
	validate: function(frm){
		if(frm.doc.status=="Closed"){
			frm.set_df_property('complaint_close_date','reqd',1)
		}
		else{
			frm.set_df_property('complaint_close_date','reqd',0)
		}
	},
	complaint_others: function(frm){
		if(frm.doc.complaint_others==1){
			frm.set_df_property('complaint_by','hidden',1)
			frm.set_df_property('party','hidden',1)
			frm.set_df_property('full_name','hidden',1)
			frm.set_df_property('contact_person','hidden',1)
			frm.set_df_property('phone','hidden',1)
			frm.set_df_property('email','hidden',1)
			frm.set_df_property('complaint_territory','hidden',1)
		}
		else{
			frm.set_df_property('complaint_by','hidden',0)
			frm.set_df_property('party','hidden',0)
			frm.set_df_property('full_name','hidden',0)
			frm.set_df_property('contact_person','hidden',0)
			frm.set_df_property('phone','hidden',0)
			frm.set_df_property('email','hidden',0)
			frm.set_df_property('complaint_territory','hidden',0)
		}
	}



	// refresh: function(frm) {
   
    //     var today = frappe.datetime.nowdate();
    //     var targetDate = frappe.datetime.add_days(today, 3);

    //     frm.set_value('complete_date', targetDate);
    // }


});
