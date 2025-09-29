let mockPackages = [
  {
    trackingNumber: "SH82352287",
    status: "In Transit",
    recipient: "Ryo Kuratomi",
    destination: "Apt 204 Gran Paseo/Primal, 2-17-46 Okubo, Shinjuku-ku, Tokyo 169-0072, Japan",
    weight: "800 g",
    progress: 93,
    createdAt: new Date("2025-09-20T23:53:00Z"),
    estimatedDelivery: new Date("2025-09-24T13:00:00Z"),
    history: [
      {
        timestamp: new Date("2025-09-21T20:17:00Z"),
        location: "Amman Warehouse",
        status: "processed",
        coordinates: { lat: 31.9539, lng: 35.9106 },
        isCurrentLocation: false
      },
      {
        timestamp: new Date("2025-09-22T22:37:00Z"),
        location: "Istanbul Warehouse",
        status: "shipped",
        coordinates: { lat: 41.0082, lng: 28.9784 },
        isCurrentLocation: false
      },
      {
        timestamp: new Date("2025-09-24T09:21:33Z"),
        location: "Miyazaki Warehouse",
        status: "In Transit",
        coordinates: { lat: 31.9111, lng: 131.4239 },
        isCurrentLocation: true
      }
    ] 
  },
  {
    trackingNumber: "SH82437295",
    status: "Pending Payment",
    recipient: "Satoru Ueno",
    destination: "4-13-3 Tatekawa Sumida-ku, Tokyo 130-0023 Japan",
    weight: "1.8 kg",
    progress: 86,
    createdAt: new Date("2025-08-07T21:26:00Z"),
    estimatedDelivery: new Date("2025-08-10T13:00:00Z"),
    history: [
      {
        timestamp: new Date("2025-08-07T21:28:00Z"),
        location: "Amman Warehouse",
        status: "Processed",
        coordinates: { lat: 31.9539, lng: 35.9106 },
        isCurrentLocation: false
      },
      {
        timestamp: new Date("2025-08-08T22:37:00Z"),
        location: "Istanbul Warehouse",
        status: "Shipped",
        coordinates: { lat: 41.0082, lng: 28.9784 },
        isCurrentLocation: false
      },
      {
        timestamp: new Date("2025-08-10T06:09:41Z"),
        location: "Miyazaki Warehouse",
        status: "OnHold",
        coordinates: { lat: 31.9111, lng: 131.4239 },
        isCurrentLocation: true
      }
    ]
  },
  {
    trackingNumber: "SH86737495",
    status: "Pending Payment",
    recipient: "Joey",
    destination: "103 Witherspoon Court, Warner Robins, GA 31088, USA",
    weight: "800 g",
    progress: 87,
    createdAt: new Date("2025-08-08T12:40:00Z"),
    estimatedDelivery: new Date("2025-08-11T12:00:00Z"),
    history: [
        {
        timestamp: new Date("2025-08-08T12:42:00Z"),
        location: "Amman Warehouse",
        status: "Processed",
        coordinates: { lat: 31.9539, lng: 35.9106 },
        isCurrentLocation: false
      },
      {
        timestamp: new Date("2025-08-09T14:23:00Z"),
        location: "Istanbul Warehouse",
        status: "Shipped",
        coordinates: { lat: 41.0082, lng: 28.9784 },
        isCurrentLocation: false
      },
      {
        timestamp: new Date("2025-08-11T10:07:00Z"),
        location: "Portland Warehouse",
        status: "OnHold",
        coordinates: { lat: 45.5152, lng: -122.6784 }
        ,
        isCurrentLocation: true
      }
    ]
  },
  {
    trackingNumber: "SH82152286",
    status: "Pending Payment",
    recipient: "Hiromi Kubo",
    destination: "Prejiel 101 Sakaecho 4-166, Ushiku-shi, Ibaraki 300-1233, Japan",
    weight: "800 g",
    progress: 87,
    createdAt: new Date("2025-09-23T20:53:00Z"),
    estimatedDelivery: new Date("2025-09-26T12:00:00Z"),
    history: [
      {
        timestamp: new Date("2025-09-23T20:54:00Z"),
        location: "Amman Warehouse",
        status: "processed",
        coordinates: { lat: 31.9539, lng: 35.9106 },
        isCurrentLocation: false 
      },
      {
        timestamp: new Date("2025-09-24T22:37:00Z"),
        location: "Istanbul Warehouse",
        status: "Shipped",
        coordinates: { lat: 41.0082, lng: 28.9784 },
        isCurrentLocation: false
      },
       {
        timestamp: new Date("2025-09-26T06:21:33Z"),
        location: "Miyazaki Warehouse",
        status: "OnHold",
        coordinates: { lat: 31.9111, lng: 131.4239 },
        isCurrentLocation: true
      }
   ]
  },
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
