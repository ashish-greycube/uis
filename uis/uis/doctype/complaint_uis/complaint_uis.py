# Copyright (c) 2023, GreyCube Technologies and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.contacts.doctype.contact.contact import get_default_contact,get_contact_details

class ComplaintUIS(Document):
	pass

@frappe.whitelist()
def get_contact_and_email(doctype,name):
		# x = get_default_contact(doctype,name)
		# xmsg = print(x)
		# y = get_contact_details(x)
		# ymsg = print(y)
		# return xmsg,ymsg
		x = get_default_contact(doctype, name)
		# print(x)
		if x:


			y = get_contact_details(x)
			# print(y)
			contact_person= y.get('contact_person','')
			contact_email = y.get('contact_email', '')
			contact_mobile = y.get('contact_mobile', '')
			return {
			'contact_person':contact_person,	
			'contact_email': contact_email,
			'contact_mobile': contact_mobile
    	}

		
