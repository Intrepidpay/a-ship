let mockPackages = [
  {
    trackingNumber: "SH82417287",
    status: "In Transit",
    recipient: "Dr. William",
    destination: "777 Margotes, Hipusngo Subd. Baybay, Leyte 6521 Philippines",
    weight: "1.8 kg",
    progress: 54,
    createdAt: new Date("2025-08-04T16:03:00Z"),
    estimatedDelivery: new Date("2025-08-07T13:00:00Z"),
    history: [
      {
        timestamp: new Date("2025-08-04T16:17:00Z"),
        location: "Amman Warehouse",
        status: "processed",
        coordinates: { lat: 31.9539, lng: 35.9106 },
        isCurrentLocation: false
      },
      {
        timestamp: new Date("2025-08-06T03:34:00Z"),
        location: "Istanbul Warehouse",
        status: "In Transit",
        coordinates: { lat: 41.0082, lng: 28.9784 },
        isCurrentLocation: true
      }
    ] 
  },
  {
    trackingNumber: "Sopuruon1",
    status: "Delivered",
    recipient: "Jane Smith",
    destination: "456 Oak Ave, Los Angeles, CA",
    weight: "1.8 kg",
    progress: 100,
    createdAt: new Date("2023-04-20T09:15:00Z"),
    estimatedDelivery: new Date("2023-04-28T12:00:00Z"),
    history: [
        {
        timestamp: new Date("2025-05-17T12:15:00Z"),
        location: "Kabul Warehouse",
        status: "processed",
        coordinates: { lat: 34.5255, lng: 69.1708 },
        isCurrentLocation: false
      },
      {
        timestamp: new Date("2025-05-18T15:45:00Z"),
        location: "Istanbul Warehouse",
        status: "shipped",
        coordinates: { lat: 41.0082, lng: 28.9784 },
        isCurrentLocation: false
      },
       {
        timestamp: new Date("2025-05-19T11:20:00Z"),
        location: "New York Dock",
        status: "In Transit",
        coordinates: { lat: 40.7128, lng: -74.0060 },
        isCurrentLocation: true
      }
    ]
  },
  {
    trackingNumber: "SH87587842",
    status: "Pending Payment",
    recipient: "Keigo Makito",
    destination: " Room 612, 1-20-8 Shin-Yokohama, Kohoku, Yokohama 222-0033 Japan",
    weight: "3.7 kg",
    progress: 86,
    createdAt: new Date("2025-07-11T06:33:00Z"),
    estimatedDelivery: new Date("2025-07-14T12:00:00Z"),
    history: [
      {
        timestamp: new Date("2025-07-11T12:41:00Z"),
        location: "Amman Warehouse",
        status: "processed",
        coordinates: { lat: 31.9539, lng: 35.9106 },
        isCurrentLocation: false
      },
      {
        timestamp: new Date("2025-07-12T20:32:04Z"),
        location: "Istanbul Warehouse",
        status: "shipped",
        coordinates: { lat: 41.0082, lng: 28.9784 },
        isCurrentLocation: false
      },
       {
        timestamp: new Date("2025-07-14T06:21:00Z"),
        location: "Miyazaki Warehouse",
        status: "OnHold",
        coordinates: { lat: 31.9111, lng: 131.4239 },
        isCurrentLocation: true
       }
   ]
  }
];

export const trackingService = {
  validateTrackingNumber: async (trackingNumber) => {
    const cleanedNumber = trackingNumber.trim().toUpperCase();
    
    const foundPackage = mockPackages.find(pkg => 
      pkg.trackingNumber.toUpperCase() === cleanedNumber
    );
    
    if (!foundPackage) {
      throw new Error("Tracking number not found in our system");
    }
    
    return foundPackage;
  },
  
  getAllPackages: async () => {
    return mockPackages;
  },
  
  addNewPackage: async (newPackage) => {
    if (!newPackage.trackingNumber) {
      throw new Error("Tracking number is required");
    }

    const cleanedNumber = newPackage.trackingNumber.trim().toUpperCase();
    
    if (mockPackages.some(pkg => pkg.trackingNumber.toUpperCase() === cleanedNumber)) {
      throw new Error("Tracking number already exists");
    }

    const now = new Date();
    const packageToAdd = {
      ...newPackage,
      trackingNumber: cleanedNumber,
      status: newPackage.status || "Processing",
      progress: newPackage.progress || 0,
      createdAt: now,
      estimatedDelivery: newPackage.estimatedDelivery || new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      history: [
        {
          timestamp: now,
          location: newPackage.origin || "Main Warehouse",
          status: newPackage.status || "Processing",
          coordinates: newPackage.coordinates || { lat: 40.7128, lng: -74.0060 },
          isCurrentLocation: true
        }
      ]
    };

    mockPackages.push(packageToAdd);
    return packageToAdd;
  },

  deletePackage: async (trackingNumber) => {
    const cleanedNumber = trackingNumber.trim().toUpperCase();
    mockPackages = mockPackages.filter(pkg => 
      pkg.trackingNumber.toUpperCase() !== cleanedNumber
    );
    return true;
  },

  updatePackageStatus: async (trackingNumber, newStatus, location, coordinates, progress) => {
    const cleanedNumber = trackingNumber.trim().toUpperCase();
    const pkgIndex = mockPackages.findIndex(pkg => 
      pkg.trackingNumber.toUpperCase() === cleanedNumber
    );
    
    if (pkgIndex === -1) {
      throw new Error("Package not found");
    }

    const now = new Date();
    
    // Mark all previous locations as not current
    mockPackages[pkgIndex].history.forEach(item => {
      item.isCurrentLocation = false;
    });

    // Add new history item marked as current
    mockPackages[pkgIndex].history.push({
      timestamp: now,
      location: location || mockPackages[pkgIndex].history.slice(-1)[0].location,
      status: newStatus,
      coordinates: coordinates || mockPackages[pkgIndex].history.slice(-1)[0].coordinates,
      isCurrentLocation: true
    });

    mockPackages[pkgIndex].status = newStatus;
    
    if (progress !== undefined) {
      mockPackages[pkgIndex].progress = progress;
    }

    return mockPackages[pkgIndex];
  },

  getStatusOptions: () => [
    "Processing",
    "In Transit",
    "Out for Delivery",
    "Delivered",
    "Returned",
    "Cancelled"
  ]
};
