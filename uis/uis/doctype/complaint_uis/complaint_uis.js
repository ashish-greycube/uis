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

		
		frm.set_query("department",function() {   
			return{
				filters: 
				{ 
					
					"is_group": 1
				}
			}
		})

		frm.set_query("division", function(doc, cdt, cdn) {
			var selectedDepartment = locals[cdt][cdn].department;
			
			return {
				filters: {
					"parent_department": selectedDepartment
				}
			};
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


				frappe.db.get_value('Customer', frm.doc.party, ['customer_name','territory'])
				.then(r => {
				console.log(r.message.customer_name,r.message.territory)
				frm.set_value('full_name',r.message.customer_name)
				frm.set_value('complaint_territory',r.message.territory)
				})

				frappe.call({
					method: 'uis.uis.doctype.complaint_uis.complaint_uis.get_contact_and_email',
					args: { 
						"doctype":frm.doc.complaint_by,
						"name": frm.doc.party 
					},
					callback: function (r) {

						if (r.message) {
							var contactEmail = r.message.contact_email;
							var contactMobile = r.message.contact_mobile;

							console.log(contactEmail, contactMobile);
		
							
							frm.set_value('email', contactEmail);
							frm.set_value('phone', contactMobile);
						}
						else{
							frappe.msgprint("No Primary Contact is set for this Customer.")
						}

					}
				})
        }

		else if (frm.doc.complaint_by == "Supplier") {


				frappe.db.get_value('Supplier', frm.doc.party, 'supplier_name')
				.then(r => {
				console.log(r.message.supplier_name)
				frm.set_value('full_name',r.message.supplier_name)
				})

				frappe.call({
					method: 'uis.uis.doctype.complaint_uis.complaint_uis.get_contact_and_email',
					args: { 
						"doctype":frm.doc.complaint_by,
						"name": frm.doc.party 
					},
					callback: function (r) {

						if (r.message) {
							var contactEmail = r.message.contact_email;
							var contactMobile = r.message.contact_mobile;

							console.log(contactEmail, contactMobile);
		
							
							frm.set_value('email', contactEmail);
							frm.set_value('phone', contactMobile);
						}
						else{
							frappe.msgprint("No Primary Contact is set for this Supplier.")
						}

					}
				})

			
        }
    },

	complaint_date: function(frm) {
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
