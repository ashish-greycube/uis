# Copyright (c) 2023, GreyCube Technologies and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import frappe.defaults
from frappe import _, msgprint, qb
from frappe.contacts.address_and_contact import (
	delete_contact_and_address,
	load_address_and_contact,
)
from frappe.desk.reportview import build_match_conditions, get_filters_cond
from frappe.model.mapper import get_mapped_doc
from frappe.model.naming import set_name_by_naming_series, set_name_from_naming_options
from frappe.model.rename_doc import update_linked_doctypes


class CompetitorUIS(Document):
	def on_update(self):
		self.create_primary_contact()
		# self.create_primary_address()


	
	def create_primary_contact(self):
		if not self.customer_primary_contact:
			if self.mobile_no or self.email_id:
				contact = self.make_contact(self)
				self.db_set("customer_primary_contact", contact.name)
				self.db_set("mobile_no", self.mobile_no)
				self.db_set("email_id", self.email_id)

	def make_contact(args, is_primary_contact=1):
		contact = frappe.get_doc(
			{
				"doctype": "Contact",
				"first_name": args.get("name"),
				"is_primary_contact": is_primary_contact,
				"links": [{"link_doctype": args.get("doctype"), "link_name": args.get("name")}],
			}
		)
		if args.get("email_id"):
			contact.add_email(args.get("email_id"), is_primary=True)
		if args.get("mobile_no"):
			contact.add_phone(args.get("mobile_no"), is_primary_mobile_no=True)
		contact.insert()
		return contact
