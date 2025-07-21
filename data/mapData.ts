import { images } from "../constants";

export const markers = [
  {
    id: "1",
    coordinate: {
      latitude: 22.6293867,
      longitude: 88.4354486,
    },
    name: "Luxury Condo Downtown",
    description: "Stunning condo with panoramic city views",
    type: "Condo",
    image: images.estate1,
    rating: 4.5,
    reviews: 120,
    address: "123 Main Street",
    phoneNumber: "+1 (555) 123-4567",
    distance: 1.5,
    facilities: ["Swimming Pool", "Gym", "Concierge"],
    price: "$3,500/month",
    size: "1500 sqft",
    website: "www.luxurycondodowntown.com"
  },
  {
    id: "2",
    coordinate: {
      latitude: 22.6345648,
      longitude: 88.4377279,
    },
    name: "Spacious Family Home",
    description: "Cozy home perfect for a growing family",
    type: "House",
    image: images.estate2,
    rating: 4.8,
    reviews: 90,
    address: "456 Elm Street",
    phoneNumber: "+1 (555) 987-6543",
    distance: 3,
    facilities: ["Backyard", "Garage", "Fireplace"],
    price: "$2,200/month",
    size: "2000 sqft",
    website: "www.spaciousfamilyhome.com"
  },
  {
    id: "3",
    coordinate: {
      latitude: 22.6281662,
      longitude: 88.4410113,
    },
    name: "Urban Loft Retreat",
    description: "Chic loft in the heart of the city",
    type: "Loft",
    image: images.estate3,
    rating: 4.2,
    reviews: 150,
    address: "789 Oak Lane",
    phoneNumber: "+1 (555) 321-7890",
    distance: 2.5,
    facilities: ["Exposed Brick", "High Ceilings", "City Views"],
    price: "$2,800/month",
    size: "1800 sqft",
    website: "www.urbanloftretreat.com"
  },
  {
    id: "4",
    coordinate: {
      latitude: 22.6341137,
      longitude: 88.4497463,
    },
    name: "Luxury Penthouse",
    description: "Elegant penthouse with breathtaking skyline views",
    type: "Penthouse",
    image: images.estate4,
    rating: 4.9,
    reviews: 120,
    address: "101 Oak Street",
    phoneNumber: "+1 (555) 321-7890",
    distance: 2,
    facilities: ["Private Terrace", "Jacuzzi", "24/7 Security"],
    price: "$6,000/month",
    size: "3000 sqft",
    website: "www.luxurypenthouse.com"
  },
  {
    id: "5",
    coordinate: {
      latitude: 22.5341137,
      longitude: 88.4797463,
    },
    name: "Waterfront Villa",
    description: "Exquisite villa overlooking the bay",
    type: "Villa",
    image: images.estate5,
    rating: 4.9,
    reviews: 120,
    address: "101 Oak Street",
    phoneNumber: "+1 (555) 321-7890",
    distance: 2,
    facilities: ["Private Beach Access", "Infinity Pool", "Gourmet Kitchen"],
    price: "$10,000/month",
    size: "4000 sqft",
    website: "www.waterfrontvilla.com"
  }
];


export const mapDarkStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ];

  export const mapStandardStyle = [
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
  ];