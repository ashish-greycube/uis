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
		if not self.competitor_primary_contact:
			if self.mobile_no or self.email_id:
				contact = self.make_contact(self)
				self.db_set("competitor_primary_contact", contact.name)
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
	
	# def create_primary_address(self):
	# 	from frappe.contacts.doctype.address.address import get_address_display

	# 	if self.flags.is_new_doc and self.get("address_line1"):
	# 		address = make_address(self)
	# 		address_display = get_address_display(address.name)

	# 		self.db_set("competitor_primary_address", address.name)
	# 		self.db_set("primary_address", address_display)
	
	
	
	# def make_address(args, is_primary_address=1):
	# 	reqd_fields = []
	# 	for field in ["city", "country"]:
	# 		if not args.get(field):
	# 			reqd_fields.append("<li>" + field.title() + "</li>")
		
	# 	if reqd_fields:
	# 		msg = _("Following fields are mandatory to create address:")
	# 		frappe.throw(
	# 		"{0} <br><br> <ul>{1}</ul>".format(msg, "\n".join(reqd_fields)),
	# 		title=_("Missing Values Required"),
	# 	)
	# 	address = frappe.get_doc(
	# 	{
	# 		"doctype": "Address",
	# 		"address_title": args.get("name"),
	# 		"address_line1": args.get("address_line1"),
	# 		"address_line2": args.get("address_line2"),
	# 		"city": args.get("city"),
	# 		"state": args.get("state"),
	# 		"pincode": args.get("pincode"),
	# 		"country": args.get("country"),
	# 		"links": [{"link_doctype": args.get("doctype"), "link_name": args.get("name")}],
	# 	}
	# ).insert()
	# 	return address

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_competitor_primary_contact(doctype, txt, searchfield, start, page_len, filters):
	competitor = filters.get("competitor_name")

	con = qb.DocType("Contact")
	dlink = qb.DocType("Dynamic Link")

	return (
		qb.from_(con)
		.join(dlink)
		.on(con.name == dlink.parent)
		.select(con.name, con.email_id)
		.where((dlink.link_name == competitor) & (con.name.like(f"%{txt}%")))
		.run()
	)