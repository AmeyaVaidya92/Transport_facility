Complete User Journey - Transport Facility
User Journey: Employee EMP001 Creates & Books Rides
STEP 1: EMP001 Logs In

Employee accesses the Transport Facility web application

System recognizes Employee ID: EMP001

Dashboard loads showing "Add Ride" and "Available Rides" sections

STEP 2: EMP001 Creates a Ride

Action: EMP001 clicks "Add Ride" button

Form Filled:

Employee ID: EMP001 (Auto-filled, Mandatory)
Vehicle Type: Car (Dropdown - Bike/Car)
Vehicle No: MH34VB1000 (Mandatory, Format: XX##XX####)
Vacant Seats: 4 (Mandatory, Range: 1-10)
Time: 09:00 (24-hour format, Current day only)
Pick-up Point: Mumbai
Destination: Ahmedabad

Validation Checks:

✅ All mandatory fields filled

✅ Employee ID (EMP001) is unique for this ride

✅ Vehicle Number format valid

✅ Seats between 1-10

✅ Time is for current day

✅ Pick-up ≠ Destination

Result: Ride Posted Successfully ✅

Ride ID: RIDE001
Driver: EMP001 | Car | MH34VB1000
Time: 09:00
Route: Mumbai → Ahmedabad
Seats Available: 4

STEP 3: EMP002 Searches for Available Rides

Current System Time: 09:00

Time Buffer Applied: ±60 minutes
Visible Time Range: 08:00 – 10:00

Rides Displayed:

Ride ID: RIDE001
Vehicle: Car
Time: 09:00
Route: Mumbai → Ahmedabad
Vacant Seats: 4

STEP 4: EMP002 Filters by Vehicle Type

Filter Applied: Vehicle Type = Car

Result:
RIDE001 remains visible

STEP 5: EMP002 Books the Ride

Validation Checks:

✅ EMP002 ≠ EMP001

✅ First booking attempt

✅ Seats available

✅ Current day booking

Booking Confirmation:

Ride ID: RIDE001
Passenger: EMP002
Time: 09:00
Route: Mumbai → Ahmedabad

Vacant Seats Updated:
4 → 3

STEP 6: EMP003 Searches & Books Same Ride

Available Seats Before Booking: 3

Ride Details:
Time: 09:00
Route: Mumbai → Ahmedabad

Booking Successful

Seats Updated:
3 → 2

STEP 7: EMP002 Attempts Duplicate Booking

System Validation:
❌ Employee already booked this ride

Result:
Booking Failed
Error: "Same employee cannot book a ride twice."

STEP 8: EMP001 Tries to Book Own Ride

System Validation:
❌ Ride creator cannot book own ride

Result:
Booking Failed
Error: "You cannot book your own ride."

STEP 9: EMP004 Searches with Time Filter

Current Time: 09:30

Buffer Applied: ±60 minutes
Visible Range: 08:30 – 10:30

RIDE001 (09:00) → Within buffer

EMP004 Books Successfully

Seats Updated:
2 → 1

STEP 10: EMP005 Books Last Seat

Current Time: 09:45

Available Seats Before Booking: 1

Booking Successful

Seats Updated:
1 → 0 (FULLY BOOKED)

STEP 11: EMP006 Searches for Rides

Result:
No rides available
RIDE001: 0 seats (Fully Booked)

Booking option disabled

STEP 12: Time Buffer Expired

Current Time: 11:05

Buffer Applied: ±60 minutes
Visible Range: 10:05 – 12:05

RIDE001 (09:00) → Outside buffer

Result:
Ride hidden from search results

Summary of Journey
Step	Employee	Action	Result	Seats Update
2	EMP001	Creates RIDE001	Posted	4
5	EMP002	Books RIDE001	Booked	4→3
6	EMP003	Books RIDE001	Booked	3→2
7	EMP002	Duplicate attempt	Rejected	2
8	EMP001	Own ride attempt	Rejected	2
9	EMP004	Books RIDE001	Booked	2→1
10	EMP005	Books RIDE001	Booked	1→0
11	EMP006	Searches	No seats	0
Requirements Satisfied

✔ Add new ride
✔ Pick/Book a ride
✔ Time matching (±60 min buffer)
✔ Filter by Vehicle Type
✔ Mandatory fields validation
✔ Duplicate employee prevention
✔ Same employee cannot book own ride
✔ Same employee cannot book twice
✔ Vacant seats auto-update
✔ Current day only restriction