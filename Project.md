**
Project Structure

**

**

Europages

Table - Companies :
Columns : 
id - int,
company_id - String,
name - string unique,
description - string ,
country - string,
city - string,
logo_link - string,
field_of_activity_id - int,
commercial_information - int,
key_figure_id - int,
contact_id - int,
organisation_id - int,
category_id : int,

**

**

Table - Key Figures 
Columns : 
id - int ,
company_id - string,
headcount - string , 
sales_staff - string ,
export_sales - string ,
sales_turnover - string ,

**

Table - Organisations
Columns : 
id - int,
established_year - int,
site_status - string,
main_activity - string,

**

Table - Commercial Informations
Columns : 
id - int,
company_id - string,
abbreviation - string,
title - string,
image - string,

**

Table - Contacts
Columns : 
id - int ,
company_id - int ,
vat_code - string,
phone - string , 


**

**

Table - Categories

id - int , 
name - string,

**