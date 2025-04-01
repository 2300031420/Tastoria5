import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";

export function SlotBooking() {
  const { cafeId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  
  // Updated tables data with more clear structure
  const [tables, setTables] = useState([
    { id: 1, number: "T1", seats: 2, position: 'Window', status: 'available' },
    { id: 2, number: "T2", seats: 2, position: 'Window', status: 'available' },
    { id: 3, number: "T3", seats: 4, position: 'Center', status: 'available' },
    { id: 4, number: "T4", seats: 4, position: 'Center', status: 'available' },
    { id: 5, number: "T5", seats: 6, position: 'Corner', status: 'available' },
    { id: 6, number: "T6", seats: 8, position: 'Private', status: 'available' },
  ]);

  // Add helper function for chair positions
  const getChairPositionsForTable = (seats, index) => {
    const positions = {
      2: ['top', 'bottom'],
      4: ['top', 'right', 'bottom', 'left'],
      6: ['top', 'top-right', 'right', 'bottom', 'bottom-left', 'left'],
      8: ['top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left']
    };
    return positions[seats]?.[index] || '';
  };

  // Add helper function for chair positioning classes
  const getChairPosition = (position) => {
    const positions = {
      'top': 'absolute -top-6',
      'top-right': 'absolute -top-4 -right-4',
      'right': 'absolute -right-6',
      'bottom-right': 'absolute -bottom-4 -right-4',
      'bottom': 'absolute -bottom-6',
      'bottom-left': 'absolute -bottom-4 -left-4',
      'left': 'absolute -left-6',
      'top-left': 'absolute -top-4 -left-4'
    };
    return positions[position] || '';
  };

  // Chair Icon Component
  const ChairIcon = ({ position, isSelected }) => (
    <div className={`${getChairPosition(position)} transform transition-all duration-300`}>
      <svg 
        viewBox="0 0 24 24" 
        className={`w-6 h-6 ${isSelected ? 'text-blue-500' : 'text-gray-500'}`}
        fill="currentColor"
      >
        <path d="M20 8V6C20 4.34315 18.6569 3 17 3H7C5.34315 3 4 4.34315 4 6V8C2.89543 8 2 8.89543 2 10V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V10C22 8.89543 21.1046 8 20 8Z" />
      </svg>
    </div>
  );

  // Table Icon Component
  const TableIcon = ({ seats, isSelected }) => (
    <div className={`relative ${seats > 4 ? 'w-20 h-20' : 'w-16 h-16'}`}>
      <svg 
        viewBox="0 0 24 24" 
        className={`w-full h-full ${isSelected ? 'text-blue-500' : 'text-gray-500'}`}
        fill="currentColor"
      >
        <path d="M21 9V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V9C3 10.1046 3.89543 11 5 11H19C20.1046 11 21 10.1046 21 9Z" />
        <path d="M21 15V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V15C3 13.8954 3.89543 13 5 13H19C20.1046 13 21 13.8954 21 15Z" />
      </svg>
    </div>
  );

  // Add function to fetch available slots
  const fetchAvailableSlots = async (date) => {
    setIsLoading(true);
    try {
      // Temporary mock data for testing
      const mockSlots = [
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "01:00 PM",
        "02:00 PM",
        "03:00 PM"
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setAvailableSlots(mockSlots);
      
      /* Comment out the actual API call for now
      const response = await fetch(`/api/cafes/${cafeId}/slots?date=${date}`);
      const data = await response.json();
      setAvailableSlots(data.slots);
      */
      
    } catch (error) {
      console.error('Error fetching slots:', error);
      alert('Failed to fetch available slots');
    } finally {
      setIsLoading(false);
    }
  };

  // Update date selection handler
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setSelectedTime(''); // Reset selected time when date changes
    fetchAvailableSlots(newDate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      cafeId,
      date: selectedDate,
      time: selectedTime,
      partySize,
      name,
      contact
    });
    
    setOpenDialog(true);
    
    setTimeout(() => {
      setOpenDialog(false);
      navigate('/booking-confirmation');
    }, 2000);
  };

  // Modified function to filter tables based on exact party size match
  const getFilteredTables = () => {
    console.log('Filtering tables for party size:', partySize); // Debug log
    const filtered = tables.filter(table => table.seats === partySize);
    console.log('Filtered tables:', filtered); // Debug log
    return filtered;
  };

  // Modified TableSelection component
  const TableSelection = () => {
    const filteredTables = getFilteredTables();

    return (
      <div className="my-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Available Tables for {partySize} {partySize === 1 ? 'Guest' : 'Guests'}
          </label>
          <span className="text-sm text-blue-600 font-medium">
            {filteredTables.length} {filteredTables.length === 1 ? 'table' : 'tables'} available
          </span>
        </div>

        {filteredTables.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <Typography color="gray" className="text-lg font-medium">
              No tables available for {partySize} guests
            </Typography>
            <Typography color="gray" className="text-sm mt-2">
              Please try a different party size or select another time slot
            </Typography>
            <Button
              color="blue"
              variant="text"
              className="mt-4"
              onClick={() => setPartySize(prev => Math.max(1, prev - 1))}
            >
              Decrease Party Size
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {filteredTables.map((table) => (
              <div
                key={table.id}
                onClick={() => setSelectedTable(table.id)}
                className={`
                  p-8 rounded-xl cursor-pointer relative
                  transform transition-all duration-300 ease-in-out
                  ${selectedTable === table.id 
                    ? 'bg-blue-50 shadow-blue-200 scale-105' 
                    : 'bg-white hover:bg-gray-50'}
                  shadow-lg hover:shadow-2xl
                  hover:-translate-y-2
                  border-2 ${selectedTable === table.id ? 'border-blue-500' : 'border-transparent'}
                  group
                  hover:border-blue-200
                  before:absolute before:inset-0 before:rounded-xl
                  before:bg-gradient-to-b before:from-transparent before:to-blue-50/30
                  before:opacity-0 before:transition-opacity
                  hover:before:opacity-100
                  overflow-hidden
                `}
              >
                {/* Status Badge with hover effect */}
                <div className={`
                  absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium
                  transform transition-all duration-300
                  ${selectedTable === table.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700 group-hover:scale-110'}
                `}>
                  {selectedTable === table.id ? 'Selected' : 'Available'}
                </div>

                {/* Table number with hover effect */}
                <div className="flex items-center mb-6">
                  <span className={`
                    font-semibold text-lg transform transition-all duration-300
                    ${selectedTable === table.id 
                      ? 'text-blue-600' 
                      : 'text-gray-700 group-hover:text-blue-500'}
                  `}>
                    Table {table.number}
                  </span>
                </div>

                {/* Table and chairs visualization with hover effect */}
                <div className="relative flex items-center justify-center py-8 transform transition-all duration-300 group-hover:scale-105">
                  {/* Chairs */}
                  {Array.from({ length: table.seats }).map((_, index) => {
                    const chairPositions = getChairPositionsForTable(table.seats, index);
                    return (
                      <ChairIcon 
                        key={index} 
                        position={chairPositions}
                        isSelected={selectedTable === table.id}
                      />
                    );
                  })}
                  
                  {/* Table */}
                  <div className="relative">
                    <TableIcon 
                      seats={table.seats} 
                      isSelected={selectedTable === table.id}
                    />
                  </div>
                </div>

                {/* Table information with hover effect */}
                <div className="text-center mt-6 space-y-2 transform transition-all duration-300">
                  <p className={`
                    font-medium
                    ${selectedTable === table.id 
                      ? 'text-blue-600' 
                      : 'text-gray-600 group-hover:text-blue-500'}
                  `}>
                    {table.seats} Seats
                  </p>
                  <p className={`
                    capitalize text-sm transform transition-all duration-300
                    ${selectedTable === table.id 
                      ? 'text-blue-500' 
                      : 'text-gray-500 group-hover:text-blue-400'}
                  `}>
                    {table.position} Location
                  </p>
                </div>

                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-50/20 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                              pointer-events-none rounded-xl" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-400 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto mt-20">
        <Card className="w-full shadow-xl">
          <CardBody className="p-8 md:p-12">
            <Typography variant="h3" color="blue-gray" className="mb-6">
              Reserve Your Table
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Contact Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter your contact number"
                />
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                {isLoading ? (
                  <div className="text-center py-4">Loading available slots...</div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`px-4 py-2 text-sm rounded-md ${
                          selectedTime === slot
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
                {selectedDate && availableSlots.length === 0 && !isLoading && (
                  <p className="text-red-500 mt-2">No available slots for this date</p>
                )}
              </div>

              {/* Party Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPartySize(Math.max(1, partySize - 1));
                      setSelectedTable(null); // Reset table selection when party size changes
                    }}
                    className="px-3 py-1 bg-gray-200 rounded-md"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium">{partySize}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPartySize(Math.min(10, partySize + 1));
                      setSelectedTable(null); // Reset table selection when party size changes
                    }}
                    className="px-3 py-1 bg-gray-200 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add Table Selection Component */}
              {selectedTime && <TableSelection />}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-16 bg-blue-500 hover:bg-blue-600"
                disabled={!selectedDate || !selectedTime || !selectedTable}
              >
                Confirm Reservation
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
        <DialogHeader className="flex items-center justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </DialogHeader>
        <DialogBody className="text-center">
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Booking Successful!
          </Typography>
          <Typography variant="paragraph" color="gray" className="mb-6">
            Your table has been reserved successfully.
          </Typography>
        </DialogBody>
      </Dialog>
    </div>
  );
}

export default SlotBooking; 