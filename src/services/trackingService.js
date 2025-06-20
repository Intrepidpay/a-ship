let mockPackages = [
  {
    trackingNumber: "SH87556849",
    status: "Pending Payment",
    recipient: "Victor",
    destination: "4 Lesnaya St, Peski, Kolomensky, Moscow, RU",
    weight: "3.7 kg",
    progress: 83,
    createdAt: new Date("2025-06-07T08:33:00Z"),
    estimatedDelivery: new Date("2025-06-12T12:00:00Z"),
    history: [
      {
        timestamp: new Date("2025-06-07T08:41:00Z"),
        location: "Kabul Warehouse",
        status: "processed",
        coordinates: { lat: 34.5255, lng: 69.1708 },
        isCurrentLocation: false 
      },
      {
        timestamp: new Date("2025-06-08T15:45:00Z"),
        location: "Istanbul Warehouse",
        status: "shipped",
        coordinates: { lat: 41.0082, lng: 28.9784 },
        isCurrentLocation: false
      }
      ,
       {
       timestamp: new Date("2025-06-09T21:23:00Z"),
       location: "Vladivostok Warehouse",
       status: "In Transit",
       coordinates: { lat: 43.1155, lng: 131.8855 },
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
    trackingNumber: "SH87577841",
    status: "In Transit",
    recipient: "Shinya Ohno",
    destination: " Tokyo Kikaku Co. Ltd. 2-6-1 Shinobu, Gyoda-shi Saitama 361-0077 JAPAN",
    weight: "3.7 kg",
    progress: 91,
    createdAt: new Date("2025-06-017T06:33:00Z"),
    estimatedDelivery: new Date("2025-06-20T12:00:00Z"),
    history: [
      {
        timestamp: new Date("2025-06-17T06:41:00Z"),
        location: "Amman Warehouse",
        status: "processed",
        coordinates: { lat: 31.9539, lng: 35.9106 },
        isCurrentLocation: false
      },
      {
        timestamp: new Date("2025-06-18T07:45:00Z"),
        location: "Istanbul Warehouse",
        status: "shipped",
        coordinates: { lat: 41.0082, lng: 28.9784 },
        isCurrentLocation: false
      },
       {
        timestamp: new Date("2025-06-19T21:20:00Z"),
        location: "Okinawa Warehouse",
        status: "In Transit",
        coordinates: { lat: 26.3344, lng: 127.8056 },
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
